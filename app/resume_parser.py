import fitz  # PyMuPDF
import re

class ResumeParser:
    def __init__(self):
        # Regex patterns for common resume sections
        self.SECTION_PATTERNS = {
            "contact": r"(email|phone|address|linkedin|github|contact|links)",
            "skills": r"(skills|technologies|technical skills|core competencies|expertise)",
            "experience": r"(experience|work experience|employment|history|professional experience)",
            "education": r"(education|academic|qualifications|degrees)",
            "projects": r"(projects|personal projects|academic projects|notable work)",
            "summary": r"(summary|profile|about|objective)",
        }
        
        # Contact Regex
        self.EMAIL_REGEX = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        self.PHONE_REGEX = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        self.GITHUB_REGEX = r'github\.com\/[a-zA-Z0-9_-]+'
        self.LINKEDIN_REGEX = r'linkedin\.com\/in\/[a-zA-Z0-9_-]+'

        # Skill categories for smart detection
        self.SKILL_CATEGORIES = {
            "Languages": r"(python|javascript|java|cpp|c\+\+|sql|typescript|rust|go|swift|ruby|php|html|css)",
            "Frameworks": r"(react|angular|vue|django|flask|fastapi|spring|bootstrap|tailwind|express|laravel|flutter)",
            "Tools/DB": r"(git|docker|kubernetes|aws|azure|gcp|mongodb|postgresql|mysql|redis|linux|jenkins)",
            "Soft Skills": r"(leadership|management|communication|teamwork|problem solving|agile)",
        }

    def extract_text_with_layout(self, file_path: str) -> list:
        """Extracts text blocks with coordinates from PDF."""
        doc = fitz.open(file_path)
        blocks = []
        for page in doc:
            page_dict = page.get_text("dict")
            for block in page_dict.get("blocks", []):
                if block["type"] == 0:  # Text block
                    for line in block["lines"]:
                        for span in line["spans"]:
                            blocks.append({
                                "text": span["text"].strip(),
                                "size": span["size"],
                                "flags": span["flags"],  # Font flags: 16 (bold), 1 (italic)
                                "bbox": span["bbox"],
                                "font": span["font"]
                            })
        return blocks

    def parse(self, file_path: str) -> dict:
        blocks = self.extract_text_with_layout(file_path)
        
        # 1. Initialize result
        parsed_data = {
            "name": "",
            "role": "",
            "summary": "",
            "skills": [],
            "projects": [],
            "experience": [],
            "education": [],
            "contact": {
                "email": "",
                "phone": "",
                "github": "",
                "linkedin": ""
            }
        }

        # 2. Extract global text for contact info
        all_text = " ".join([b["text"] for b in blocks])
        parsed_data["contact"]["email"] = (re.findall(self.EMAIL_REGEX, all_text) or [""])[0]
        parsed_data["contact"]["phone"] = (re.findall(self.PHONE_REGEX, all_text) or [""])[0]
        
        gh_match = re.search(self.GITHUB_REGEX, all_text)
        if gh_match:
            gh_url = gh_match.group(0)
            parsed_data["contact"]["github"] = f"https://{gh_url}" if not gh_url.startswith('http') else gh_url
            
        li_match = re.search(self.LINKEDIN_REGEX, all_text)
        if li_match:
            li_url = li_match.group(0)
            parsed_data["contact"]["linkedin"] = f"https://{li_url}" if not li_url.startswith('http') else li_url

        # 3. Detect Sections and collect blocks
        section_content = {k: [] for k in self.SECTION_PATTERNS.keys()}
        current_section = None
        
        font_sizes = [b["size"] for b in blocks if b["text"]]
        avg_font_size = sum(font_sizes) / len(font_sizes) if font_sizes else 10
        header_threshold = avg_font_size * 1.1

        for block in blocks:
            text = block["text"]
            if not text: continue
            
            # Name detection (first large block)
            if not parsed_data["name"] and block["size"] > header_threshold * 1.5:
                parsed_data["name"] = text
                continue

            # Section Header Detection
            found_header = False
            for section, pattern in self.SECTION_PATTERNS.items():
                if re.search(pattern, text, re.IGNORECASE) and (block["size"] > header_threshold or block["flags"] & 16):
                    current_section = section
                    found_header = True
                    break
            
            if found_header: continue

            if current_section and text:
                section_content[current_section].append(block)

        # 4. Post-process sections
        parsed_data["skills"] = list(set([b["text"] for b in section_content["skills"]]))
        parsed_data["experience"] = [b["text"] for b in section_content["experience"]]
        parsed_data["education"] = [b["text"] for b in section_content["education"]]
        raw_summary = " ".join([b["text"] for b in section_content["summary"]])
        parsed_data["summary"] = raw_summary

        # 5. Group Projects (Complex logic)
        parsed_data["projects"] = self.group_projects(section_content["projects"])
        
        # 6. Smart Enhancements (Role, About, Skills Categorization)
        parsed_data = self.smart_enhance(parsed_data)
        
        return parsed_data

    def group_projects(self, blocks: list) -> list:
        projects = []
        current_project = None
        
        for block in blocks:
            text = block["text"]
            is_bold = block["flags"] & 16
            
            # Detect project titles: 
            # - Bold text with Title Case
            # - Lines ending with Project, System, Application, etc.
            is_title = (is_bold and re.match(r'^[A-Z][\w\s]+$', text)) or \
                       re.search(r'(Project|System|Application|Platform|App|Module|Website|Management)$', text, re.IGNORECASE)
            
            if is_title:
                if current_project:
                    projects.append(current_project)
                current_project = {
                    "title": text,
                    "tech_stack": "",
                    "description": "",
                    "bullets": []
                }
            elif current_project:
                # Bullet detection: starts with -, •, *
                if re.match(r'^[•\-\*]\s*', text):
                    clean_bullet = re.sub(r'^[•\-\*]\s*', '', text).strip()
                    current_project["bullets"].append(clean_bullet)
                else:
                    # Append to description
                    if not current_project["description"]:
                        current_project["description"] = text
                    else:
                        current_project["description"] += " " + text
        
        if current_project:
            projects.append(current_project)
            
        print(f"DEBUG: Parsed {len(projects)} projects.")
        for i, p in enumerate(projects):
            print(f"DEBUG: Project {i+1}: {p['title']} ({len(p['bullets'])} bullets)")
            
        return projects

    def smart_enhance(self, data: dict) -> dict:
        # 1. Infer Role
        role_keywords = {
            "Full Stack Developer": r"(Full Stack|React|Node|MERN|Django|Java)",
            "Frontend Developer": r"(Frontend|React|Vue|Angular|CSS|Tailwind)",
            "Backend Developer": r"(Backend|Python|FastAPI|PostgreSQL|MySQL|Redis)",
            "Data Scientist": r"(Data Science|Machine Learning|AI|Python|Pandas)",
            "DevOps Engineer": r"(DevOps|AWS|Docker|Kubernetes|CI/CD)",
            "Android Developer": r"(Android|Kotlin|Flutter|Mobile App)"
        }
        
        all_text = " ".join([data["name"], data["summary"]] + data["skills"])
        inferred_role = "Software Engineer" # Default
        for role, pattern in role_keywords.items():
            if re.search(pattern, all_text, re.IGNORECASE):
                inferred_role = role
                break
        data["role"] = inferred_role

        # 2. Dynamic About Section
        top_skills = data["skills"][:5]
        skills_str = ", ".join(top_skills)
        about = f"As a {inferred_role}"
        if data["summary"]:
            about = data["summary"]
        else:
            about += f" skilled in {skills_str}, I am dedicated to building impactful digital solutions. "
            if data["projects"]:
                about += f"I have worked on several notable projects including {data['projects'][0]['title']}."

        data["about_generated"] = about

        # 3. Categorize Skills
        raw_skills = " ".join(data.get("skills", []))
        categorized_skills = {}
        for category, pattern in self.SKILL_CATEGORIES.items():
            matches = re.findall(pattern, raw_skills, re.IGNORECASE)
            if matches:
                categorized_skills[category] = list(set([m.capitalize() for m in matches]))
        
        if categorized_skills:
            data["skills_categorized"] = categorized_skills

        return data

