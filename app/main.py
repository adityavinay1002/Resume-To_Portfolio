from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import os
import shutil
import uuid
from app.resume_parser import ResumeParser
from app.portfolio_generator import PortfolioGenerator

app = FastAPI(title="Resume2Portfolio API", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    print("SERVER STARTED - ROUTES LOADED")


# CORS Setup - More permissive for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local dev ease
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

parser = ResumeParser()
generator = PortfolioGenerator()

@app.get("/")
def read_root():
    return {"message": "Resume2Portfolio API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf", ".png", ".jpg", ".jpeg")):
         raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and Images are supported.")
    
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # 1. Parse Resume
        parsed_data = parser.parse(file_path)
        
        # 2. Generate Portfolio Content
        html_content = generator.generate_html(parsed_data)
        
        # 3. Save Output for Download (HTML)
        output_folder = os.path.join(OUTPUT_DIR, file_id)
        os.makedirs(output_folder, exist_ok=True)
        
        index_path = os.path.join(output_folder, "index.html")
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        # 4. Generate PDF
        pdf_path = os.path.join(output_folder, "portfolio.pdf")
        generator.generate_pdf(html_content, pdf_path)

        # Return structured data for Frontend Preview
        return JSONResponse(content={
            "file_id": file_id,
            "data": generator.generate_json_for_frontend(parsed_data)
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.get("/api/download/{file_id}")
async def download_portfolio(file_id: str):
    folder_path = os.path.join(OUTPUT_DIR, file_id)
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Create valid zip execution
    zip_filename = f"portfolio_{file_id}"
    zip_path = os.path.join(OUTPUT_DIR, zip_filename) # without .zip extension for make_archive
    
    shutil.make_archive(zip_path, 'zip', folder_path)
    
    return FileResponse(path=f"{zip_path}.zip", filename="portfolio.zip", media_type='application/zip')

@app.get("/api/download/pdf/{file_id}")
async def download_pdf(file_id: str):
    pdf_path = os.path.join(OUTPUT_DIR, file_id, "portfolio.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found")
    
    return FileResponse(path=pdf_path, filename="portfolio.pdf", media_type='application/pdf')

