# Document Layout Detection Logic

Our approach moves beyond simple text extraction by incorporating layout information (bounding boxes and font styles) to accurately parse resumes.

## 1. Text Block Extraction
We use `PyMuPDF` (`fitz`) to extract text in "blocks" rather than a single stream.
- **Function**: `page.get_text("dict")`
- **Data extracted**:
  - `text`: The string content.
  - `bbox`: (x0, y0, x1, y1) coordinates.
  - `size`: Font size.
  - `flags`: Font characteristics (bold, italic).

## 2. Dynamic Header Detection
Instead of hardcoded section order, we detect headers dynamically:
- **Average Font Size Calculation**: We compute the average font size of the document.
- **Thresholding**: Text blocks significantly larger (`> 1.1x average`) or bolded are candidates for headers.
- **Regex Matching**: Candidates are checked against a comprehensive list of standard resume keywords (e.g., "Experience", "Work History", "Project", "Skills").

## 3. Section Segmentation
Once a header is identified:
- It becomes the `current_section`.
- All subsequent text blocks are appended to this section's list.
- This continues until a new header pattern is detected.
- This logic effectively handles:
  - Single column layouts.
  - Simple multi-page documents.

## 4. robustness
- **Clean up**: Excess whitespace is normalized.
- **Fallbacks**: If no headers are found, text is preserved in a generic bucket, preventing data loss.
