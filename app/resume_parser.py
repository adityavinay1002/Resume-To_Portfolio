import fitz  # PyMuPDF
import re

class ResumeParser:
    def __init__(self):
        # Regex patterns for common resume sections
        self.SECTION_PATTERNS = {
            "contact": r"(email|phone|address|linkedin|github|contact)",
            "skills": r"(skills|technologies|technical skills|core competencies)",
            "experience": r"(experience|work experience|employment|history|professional experience)",
            "education": r"(education|academic|qualifications|degrees)",
            "projects": r"(projects|personal projects|academic projects)",
            "summary": r"(summary|profile|about|objective)",
        }
        
        # Skill categories for smart detection
        self.SKILL_CATEGORIES = {
            "Languages": r"(python|javascript|java|cpp|c\+\+|sql|typescript|rust|go|swift|ruby|php|html|css)",
            "Frameworks": r"(react|angular|vue|django|flask|fastapi|spring|bootstrap|tailwind|express|laravel|flutter)",
            "Tools/DB": r"(git|docker|kubernetes|aws|azure|gcp|mongodb|postgresql|mysql|redis|linux|jenkins)",
            "Soft Skills": r"(leadership|management|communication|teamwork|problem solving|agile)",
        }
        
        # Action/Impact keywords to highlight
        self.IMPACT_KEYWORDS = r"\b(improved|developed|optimized|managed|led|increased|decreased|designed|implemented|created|automated|mentored)\b"


    def extract_text_with_layout(self, file_path: str) -> list:
        """Extracts text blocks with coordinates from PDF."""
        doc = fitz.open(file_path)
        blocks = []
        for page in doc:
            # get_text("dict") returns structured data with coordinates
            page_dict = page.get_text("dict")
            for block in page_dict.get("blocks", []):
                if block["type"] == 0:  # Text block
                    for line in block["lines"]:
                        for span in line["spans"]:
                            blocks.append({
                                "text": span["text"].strip(),
                                "size": span["size"],
                                "flags": span["flags"],  # Font flags (bold, etc.)
                                "bbox": span["bbox"],     # (x0, y0, x1, y1)
                                "font": span["font"]
                            })
        return blocks

    def clean_text(self, text: str) -> str:
        return re.sub(r'\s+', ' ', text).strip()

    def detect_sections(self, blocks: list) -> dict:
        """
        Heuristic-based section detection using font size and keywords.
        """
        parsed_data = {
            "name": "",
            "contact": [],
            "skills": [],
            "experience": [],
            "education": [],
            "projects": [],
            "summary": []
        }
        
        current_section = None
        
        # Calculate average font size to detect headers (usually larger)
        font_sizes = [b["size"] for b in blocks if b["text"]]
        avg_font_size = sum(font_sizes) / len(font_sizes) if font_sizes else 10
        header_threshold = avg_font_size * 1.1

        # Simple name detection: First block with large font is likely the name
        for block in blocks:
            text = block["text"]
            if not text:
                continue
            
            # Name detection strategy: First significant text that is larger than average
            if not parsed_data["name"] and block["size"] > header_threshold and len(text.split()) < 5:
                parsed_data["name"] = text
                continue

            # Section Header Detection
            is_header = False
            for section, pattern in self.SECTION_PATTERNS.items():
                if re.search(pattern, text, re.IGNORECASE) and (block["size"] > header_threshold or block["flags"] & 16): # 16 is bold usually
                    current_section = section
                    is_header = True
                    break
            
            if is_header:
                continue

            # Content Extraction
            if current_section and text:
                parsed_data[current_section].append(text)
            elif not current_section and text:
                 # Assume it's catch-all or summary if at top
                 pass

        # Post-processing to join lists into strings or keep structure
        parsed_data = self.smart_enhance(parsed_data)
        return parsed_data

    def smart_enhance(self, data: dict) -> dict:
        """
        Enhances the parsed data by categorizing skills and cleaning text.
        """
        # 1. Categorize Skills
        raw_skills = " ".join(data.get("skills", []))
        categorized_skills = {}
        
        for category, pattern in self.SKILL_CATEGORIES.items():
            matches = re.findall(pattern, raw_skills, re.IGNORECASE)
            if matches:
                categorized_skills[category] = list(set([m.capitalize() for m in matches]))
        
        if categorized_skills:
            data["skills_categorized"] = categorized_skills
        
        # 2. Clean bullet points and highlight impact in experience
        enhanced_exp = []
        for exp in data.get("experience", []):
            # Clean formatting
            clean_exp = re.sub(r'^[•\-\*]\s*', '', exp).strip()
            # Highlight impact keywords (placeholder logic for frontend)
            # In a real scenario, we might wrap them in tags, but here we just ensure clean text
            enhanced_exp.append(clean_exp)
        data["experience"] = enhanced_exp
        
        return data

    def parse(self, file_path: str) -> dict:
        blocks = self.extract_text_with_layout(file_path)
        parsed_data = self.detect_sections(blocks)
        return parsed_data

