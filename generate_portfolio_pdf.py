import base64
import time
import os
import sys
import fitz  # PyMuPDF
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Reconfigure stdout to support UTF-8 characters on Windows console
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Configuration
URL = "https://thanhnguyn.github.io/vnu-portfolio-25112107/"
OUTPUT_PDF = "Minh_Chung_Portfolio_25112107.pdf"

print("Setting up Headless Chrome options...")
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1440,900")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# PDF Print settings
print_settings = {
    "landscape": False,
    "displayHeaderFooter": False,
    "printBackground": True,
    "preferCSSPageSize": True
}

temp_files = []

print("Initializing Selenium Webdriver...")
driver = webdriver.Chrome(options=chrome_options)

try:
    # 1. Print Homepage
    print(f"Loading homepage: {URL}")
    driver.get(URL)
    time.sleep(3)  # Wait for animations and fonts to load
    
    home_pdf_path = "temp_home.pdf"
    print("Printing homepage to PDF...")
    result = driver.execute_cdp_cmd("Page.printToPDF", print_settings)
    with open(home_pdf_path, "wb") as f:
        f.write(base64.b64decode(result['data']))
    temp_files.append(home_pdf_path)
    print("Homepage printed successfully.")

    # 2. Print each project case study
    for i in range(6):
        week_num = i + 1
        print(f"\nProcessing Week {week_num:02d}...")
        
        # Load homepage fresh to reset state
        driver.get(URL)
        time.sleep(2)
        
        # Find all detail buttons
        buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Xem chi tiết')]")
        if len(buttons) <= i:
            print(f"Error: Could not find button for project index {i}")
            continue
            
        # Click the i-th button
        btn = buttons[i]
        print(f"Clicking 'Xem chi tiết' button for project index {i}...")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn)
        time.sleep(0.5)
        btn.click()
        
        # Wait for Framer Motion transition animation
        time.sleep(2.5)
        
        # Print project page to PDF
        proj_pdf_path = f"temp_week_{week_num:02d}.pdf"
        print(f"Printing Week {week_num:02d} details to PDF...")
        result = driver.execute_cdp_cmd("Page.printToPDF", print_settings)
        with open(proj_pdf_path, "wb") as f:
            f.write(base64.b64decode(result['data']))
        temp_files.append(proj_pdf_path)
        print(f"Week {week_num:02d} printed successfully.")

    # 3. Merge all PDFs
    print("\nMerging all PDFs using PyMuPDF...")
    combined_doc = fitz.open()
    
    for temp_file in temp_files:
        if os.path.exists(temp_file):
            print(f"Appending {temp_file}...")
            doc = fitz.open(temp_file)
            combined_doc.insert_pdf(doc)
            doc.close()
            
    combined_doc.save(OUTPUT_PDF)
    combined_doc.close()
    print(f"\nSaved combined PDF to {os.path.abspath(OUTPUT_PDF)}")
    
    # 4. Clean up temp files
    print("Cleaning up temporary PDF files...")
    for temp_file in temp_files:
        if os.path.exists(temp_file):
            os.remove(temp_file)
            print(f"Removed {temp_file}")
            
    print("\nAll tasks completed successfully!")

except Exception as e:
    print(f"An error occurred: {e}")
finally:
    driver.quit()
