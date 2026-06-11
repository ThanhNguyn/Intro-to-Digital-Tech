import fitz  # PyMuPDF
import os

input_pdf = "Minh_Chung_Portfolio_25112107.pdf"
output_pdf = "Minh_Chung_Portfolio_25112107_Compressed.pdf"

print(f"Loading original PDF: {input_pdf}")
src_doc = fitz.open(input_pdf)
dest_doc = fitz.open()

total_pages = len(src_doc)
print(f"Total pages to compress: {total_pages}")

for i in range(total_pages):
    page = src_doc[i]
    print(f"Rendering page {i+1}/{total_pages}...")
    
    # Render page at 150 DPI (zoom factor 150/72 = 2.0833)
    zoom = 150 / 72
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    
    # Save rendering as compressed JPEG bytes
    jpeg_bytes = pix.tobytes("jpg", jpg_quality=70)
    
    # Create a new page in the destination document with the same dimensions
    rect = page.rect
    new_page = dest_doc.new_page(width=rect.width, height=rect.height)
    
    # Insert the compressed JPEG image into the page
    new_page.insert_image(rect, stream=jpeg_bytes)

print("Saving compressed PDF...")
dest_doc.save(output_pdf, garbage=4, deflate=True)
dest_doc.close()
src_doc.close()

original_size = os.path.getsize(input_pdf) / (1024 * 1024)
compressed_size = os.path.getsize(output_pdf) / (1024 * 1024)
print(f"\nCompression complete!")
print(f"Original size: {original_size:.2f} MB")
print(f"Compressed size: {compressed_size:.2f} MB")
