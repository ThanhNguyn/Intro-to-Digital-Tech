import time
import os
import sys
import fitz  # PyMuPDF
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

URL = "https://thanhnguyn.github.io/vnu-portfolio-25112107/"
TARGET_DIR = r"d:\25112107_NguyenTuanThanh\vnu-portfolio-25112107"
FINAL_PDF_NAME = "25112107 - Nguyễn Tuấn Thành.pdf"
FINAL_PATH = os.path.join(TARGET_DIR, FINAL_PDF_NAME)

print("Setting up Chrome Options...")
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
# Set a default window size
chrome_options.add_argument("--window-size=1440,1080")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--hide-scrollbars")

# CSS to clean up UI for presentation screenshot
css_injection = """
const style = document.createElement('style');
style.textContent = `
    *, *::before, *::after {
        transition: none !important;
        animation: none !important;
        transition-delay: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        animation-duration: 0s !important;
        transform: none !important;
        opacity: 1 !important;
    }
    nav[aria-label="Mobile navigation"],
    .pointer-events-none.fixed,
    header button,
    .theme-toggle,
    .command-palette-trigger {
        display: none !important;
    }
    html, body {
        overflow: visible !important;
        height: auto !important;
    }
`;
document.head.append(style);
"""

temp_images = []

print("Launching Headless Chrome...")
driver = webdriver.Chrome(options=chrome_options)

def capture_current_page(filename_prefix):
    # Apply CSS
    driver.execute_script(css_injection)
    time.sleep(1.5)
    
    # Get actual scroll height of the page
    scroll_height = driver.execute_script(
        "return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight);"
    )
    print(f"Detected page scroll height: {scroll_height}px")
    
    # Resize window to fit the entire page height (add 200px buffer to prevent viewport cutoff)
    driver.set_window_size(1440, scroll_height + 200)
    time.sleep(1)
    
    # Take screenshot
    img_path = f"{filename_prefix}.png"
    driver.save_screenshot(img_path)
    print(f"Captured screenshot: {img_path}")
    return img_path

try:
    # 1. Capture Homepage
    print(f"Loading homepage: {URL}")
    driver.get(URL)
    time.sleep(3)
    img_home = capture_current_page("temp_screenshot_home")
    temp_images.append(img_home)
    
    # 2. Capture each week's details page
    for i in range(6):
        week_num = i + 1
        print(f"\nProcessing Week {week_num:02d}...")
        
        # Load homepage to reset state
        driver.get(URL)
        time.sleep(2)
        
        # Find detail buttons
        buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Xem chi tiết')]")
        if len(buttons) <= i:
            print(f"Error: Could not find button for project index {i}")
            continue
            
        btn = buttons[i]
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn)
        time.sleep(0.5)
        btn.click()
        time.sleep(2.5) # wait for transitions
        
        img_week = capture_current_page(f"temp_screenshot_week_{week_num:02d}")
        temp_images.append(img_week)

    # 3. Create PDF from screenshots
    print("\nMerging screenshots into PDF...")
    doc = fitz.open()
    
    for img_path in temp_images:
        if os.path.exists(img_path):
            print(f"Adding page from {img_path}...")
            # Open image with PIL to check dimensions
            img = Image.open(img_path)
            width, height = img.size
            img.close()
            
            # Create a new page with the exact dimensions of the image
            # fitz expects points. 1 px = 72/96 points or we can just insert it 1:1
            # Actually, standard PDF units are points (1 inch = 72 points).
            # If we make page size match width and height, it maps 1:1.
            page = doc.new_page(width=width, height=height)
            rect = fitz.Rect(0, 0, width, height)
            
            # Compress image to JPEG bytes to keep file size small
            # (Quality=75 gives a massive file size reduction with near-zero quality loss)
            pix = fitz.Pixmap(img_path)
            jpeg_bytes = pix.tobytes("jpg", jpg_quality=75)
            
            page.insert_image(rect, stream=jpeg_bytes)
            pix = None # free memory
            
    print(f"Saving PDF to {FINAL_PATH}...")
    os.makedirs(TARGET_DIR, exist_ok=True)
    doc.save(FINAL_PATH, garbage=4, deflate=True)
    doc.close()
    
    # 4. Clean up temp images
    print("Cleaning up temporary images...")
    for img_path in temp_images:
        if os.path.exists(img_path):
            os.remove(img_path)
            
    print("\nSuccess! The final PDF has been created.")
    print(f"Location: {FINAL_PATH}")
    print(f"Size: {os.path.getsize(FINAL_PATH)/(1024*1024):.2f} MB")

except Exception as e:
    print(f"An error occurred: {e}")
finally:
    driver.quit()
