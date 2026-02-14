# Resume2Portfolio Project Guide

## Project Overview
Resume2Portfolio is a full-stack AI application that converts static resumes (PDF/Images) into dynamic, responsive portfolio websites. It uses robust document parsing techniques to extract structured data and generates a React-based preview and a downloadable static HTML site.

## Architecture

### Backend (FastAPI)
- **Framework**: FastAPI for high-performance Async API.
- **OCR/Parsing**: `PyMuPDF` (fitz) for text and layout extraction.
- **Logic**: Rule-based heuristics in `resume_parser.py` identify sections like Skills, Experience, and Projects based on font size, keywords, and layout.
- **Generation**: `jinja2` templating engine generates the downloadable HTML portfolio.

### Frontend (React + Vite)
- **Framework**: React 18 with Vite for fast tooling.
- **Styling**: Tailwind CSS for modern, responsive UI.
- **Interaction**: Axios for API communication, Drag-and-Drop file upload.
- **Structure**: Modular components (`FileUploader`, `PortfolioPreview`).

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+

### 1. Backend Setup
Navigate to the project root:
```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn app.main:app --reload

# Alternative (if above fails):
# python run_server.py
```
The API will be available at `http://localhost:8080`.
Swagger docs at `http://localhost:8080/docs`.

### 2. Frontend Setup
Open a new terminal in the project root:
```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```
The application will run at `http://localhost:5173`.

## Usage
1. Open the frontend URL.
2. Drag and drop a Resume PDF.
3. Wait for the "Analyzing Document Structure..." process.
4. Preview the generated portfolio.
5. Click **Download ZIP** to get the deployment-ready HTML files.

## Document Layout Logic
The parsing logic (`app/resume_parser.py`) uses a "Visual-Semantic" approach:
1. **Block Extraction**: Extracts text blocks with bounding box coordinates and font sizes.
2. **Header Detection**: Identifies headers by comparing font sizes to the document average (headers are usually larger/bold).
3. **Section Classification**: Matches header text against a dictionary of keywords (e.g., "Skills", "Education") using Regex.
4. **Content Association**: Groups subsequent text blocks under the identified header until a new header is found.
 This allows handles multi-column layouts better than simple text stream reading.
