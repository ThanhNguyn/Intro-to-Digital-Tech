import base64
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1440,900")

driver = webdriver.Chrome(options=chrome_options)
try:
    url = "https://thanhnguyn.github.io/vnu-portfolio-25112107/"
    driver.get(url)
    time.sleep(2)
    
    # Inject CSS to disable animations, force opacity, and hide unwanted elements
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
        .theme-toggle {
            display: none !important;
        }
    `;
    document.head.append(style);
    """
    driver.execute_script(css_injection)
    time.sleep(1)
    
    print_settings = {
        "landscape": False,
        "displayHeaderFooter": False,
        "printBackground": True,
        "preferCSSPageSize": True
    }
    result = driver.execute_cdp_cmd("Page.printToPDF", print_settings)
    with open("test_injected.pdf", "wb") as f:
        f.write(base64.b64decode(result['data']))
    print("PDF printed with CSS injection successfully.")
    
finally:
    driver.quit()
