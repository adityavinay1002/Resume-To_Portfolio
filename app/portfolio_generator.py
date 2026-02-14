from xhtml2pdf import pisa
from jinja2 import Environment, FileSystemLoader
import io
import os

class PortfolioGenerator:
    def __init__(self, template_dir: str = "app/templates"):
        # Ensure template directory exists
        if not os.path.exists(template_dir):
            os.makedirs(template_dir)
        self.env = Environment(loader=FileSystemLoader(template_dir))

    def generate_html(self, data: dict, template_name: str = "portfolio_template.html") -> str:
        """Generates HTML content from structured resume data."""
        try:
            template = self.env.get_template(template_name)
            return template.render(data=data)
        except Exception:
            # Fallback simple string template
            return f"<html><body><h1>{data.get('name', 'Portfolio')}</h1></body></html>"

    def generate_pdf(self, html_content: str, output_path: str) -> bool:
        """Converts HTML to PDF and saves to disk."""
        try:
            with open(output_path, "wb") as f:
                pisa_status = pisa.CreatePDF(html_content, dest=f)
            return not pisa_status.err
        except Exception as e:
            print(f"PDF Prep Error: {e}")
            return False
    
    def generate_json_for_frontend(self, data: dict) -> dict:
        """Formats data for the React frontend."""
        # Ensure fields are lists if expected
        for key in ["skills", "experience", "education", "projects"]:
            if key in data and isinstance(data[key], str):
                data[key] = [data[key]]
        return data
