(function() {
  // CONFIGURATION FOR THIS WEBSITE
  const ACCENT_COLOR = '#e8a838';
  const PROJECT_TITLE = 'Week 01 - Thao tác Windows';
  const FILES = [
    { name: 'index.html', path: 'index.html', type: 'file' },
    { name: 'styles.css', path: 'styles.css', type: 'file' },
    { name: 'script.js', path: 'script.js', type: 'file' },
    { name: 'README.md', path: 'README.md', type: 'file' },
    { name: 'compress_pdf.py', path: 'compress_pdf.py', type: 'file' },
    { name: 'generate_portfolio_pdf.py', path: 'generate_portfolio_pdf.py', type: 'file' },
    { name: 'generate_screenshot_pdf.py', path: 'generate_screenshot_pdf.py', type: 'file' },
    { name: 'test_injected.py', path: 'test_injected.py', type: 'file' }
  ];

  // Load PrismJS Assets dynamically
  function loadPrism(callback) {
    if (window.Prism) {
      callback();
      return;
    }
    
    // Injected CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
    document.head.appendChild(link);
    
    // Injected Script
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
    script.onload = () => {
      // Load languages
      const langs = ['markup', 'css', 'javascript', 'python'];
      let loaded = 0;
      langs.forEach(lang => {
        const langScript = document.createElement('script');
        langScript.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;
        langScript.onload = () => {
          loaded++;
          if (loaded === langs.length) callback();
        };
        document.body.appendChild(langScript);
      });
    };
    document.body.appendChild(script);
  }

  // Create UI
  function init() {
    // Injected CSS Styles
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --ce-accent: ${ACCENT_COLOR};
        --ce-bg: #0c0f16;
        --ce-sidebar-bg: #080b10;
        --ce-border: rgba(255,255,255,0.08);
        --ce-text: #c9d1d9;
      }
      
      /* Floating Button */
      .ce-trigger {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999;
        background: #111;
        color: #fff;
        border: 1px solid var(--ce-border);
        padding: 12px 18px;
        border-radius: 50px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 10px rgba(232, 168, 56, 0.2);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      }
      .ce-trigger:hover {
        transform: translateY(-2px);
        border-color: var(--ce-accent);
        box-shadow: 0 6px 24px rgba(0,0,0,0.6), 0 0 15px rgba(232, 168, 56, 0.4);
      }
      .ce-trigger svg {
        width: 15px;
        height: 15px;
        stroke: var(--ce-accent);
      }

      /* Modal Overlay */
      .ce-modal {
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .ce-modal.active {
        display: flex;
      }
      
      /* Modal Container */
      .ce-container {
        width: 100%;
        max-width: 1200px;
        height: 85vh;
        background: var(--ce-bg);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 50px rgba(0,0,0,0.7), 10px 10px 0 0 #1c140d;
        color: var(--ce-text);
      }
      
      /* Header */
      .ce-header {
        height: 50px;
        background: var(--ce-sidebar-bg);
        border-b: 1px solid var(--ce-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        border-bottom: 1px solid var(--ce-border);
      }
      .ce-header-title {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.85rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #fff;
      }
      .ce-header-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .ce-close {
        background: transparent;
        border: none;
        color: #888;
        cursor: pointer;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
      }
      .ce-close:hover {
        background: #e81123;
        color: white;
      }

      /* Body Layout */
      .ce-body {
        flex: 1;
        display: flex;
        overflow: hidden;
      }
      
      /* Sidebar */
      .ce-sidebar {
        width: 220px;
        background: var(--ce-sidebar-bg);
        border-right: 1px solid var(--ce-border);
        overflow-y: auto;
        padding: 10px 0;
      }
      .ce-sidebar-title {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: #555;
        padding: 0 15px 10px;
        font-weight: 700;
      }
      
      /* File tree items */
      .ce-tree-file, .ce-tree-dir {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 15px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        cursor: pointer;
        transition: background 0.2s;
        color: #888;
        width: 100%;
        text-align: left;
        border: none;
        background: transparent;
      }
      .ce-tree-file:hover, .ce-tree-dir:hover {
        background: rgba(255,255,255,0.04);
        color: #fff;
      }
      .ce-tree-file.active {
        background: rgba(232, 168, 56, 0.1);
        color: #fff;
        border-left: 2px solid var(--ce-accent);
      }
      .ce-tree-file svg {
        width: 13px;
        height: 13px;
        stroke: #e8a838;
      }
      .ce-tree-file.html svg { stroke: #e34f26; }
      .ce-tree-file.css svg { stroke: #1572b6; }
      .ce-tree-file.js svg { stroke: #f7df1e; }

      /* Main Editor Pane */
      .ce-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: var(--ce-bg);
        overflow: hidden;
      }
      
      /* Tabs */
      .ce-tabs {
        height: 35px;
        background: var(--ce-sidebar-bg);
        border-bottom: 1px solid var(--ce-border);
        display: flex;
        overflow-x: auto;
      }
      .ce-tab {
        height: 100%;
        padding: 0 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.72rem;
        color: #555;
        border-right: 1px solid var(--ce-border);
        cursor: pointer;
        transition: all 0.2s;
      }
      .ce-tab.active {
        background: var(--ce-bg);
        color: var(--ce-accent);
        border-top: 1px solid var(--ce-accent);
      }
      .ce-tab-close {
        font-size: 0.75rem;
        color: #444;
        border-radius: 50%;
        padding: 1px 4px;
        transition: background 0.2s;
      }
      .ce-tab-close:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
      }

      /* Editor container */
      .ce-editor-container {
        flex: 1;
        overflow: auto;
        display: flex;
        padding: 15px;
        position: relative;
      }
      .ce-line-numbers {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        line-height: 1.5;
        color: #444;
        text-align: right;
        padding-right: 15px;
        border-right: 1px solid rgba(255,255,255,0.05);
        user-select: none;
        margin-right: 15px;
      }
      .ce-editor-container pre {
        margin: 0;
        padding: 0;
        flex: 1;
        background: transparent !important;
        overflow: visible;
      }
      .ce-editor-container code {
        font-family: 'JetBrains Mono', monospace !important;
        font-size: 0.75rem !important;
        line-height: 1.5 !important;
        background: transparent !important;
        padding: 0 !important;
      }
      
      /* Image Rendering */
      .ce-img-preview {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.2);
        padding: 20px;
      }
      .ce-img-card {
        background: var(--ce-sidebar-bg);
        padding: 20px;
        border-radius: 12px;
        border: 1px solid var(--ce-border);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      }
      .ce-img-card img {
        max-width: 70vw;
        max-height: 50vh;
        object-contain;
        border-radius: 6px;
        border: 1px solid #000;
        background-image: linear-gradient(45deg, #151b26 25%, transparent 25%), linear-gradient(-45deg, #151b26 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #151b26 75%), linear-gradient(-45deg, transparent 75%, #151b26 75%);
        background-size: 16px 16px;
        background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
      }
      .ce-img-info {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #555;
      }

      /* Copy Button */
      .ce-copy-btn {
        background: rgba(255,255,255,0.04);
        border: 1px solid var(--ce-border);
        color: #888;
        padding: 6px 12px;
        border-radius: 6px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 0.75rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
      }
      .ce-copy-btn:hover {
        border-color: var(--ce-accent);
        color: #fff;
      }

      .ce-loading {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        color: #555;
      }
      
      @media (max-width: 640px) {
        .ce-sidebar {
          display: none;
        }
        .ce-container {
          height: 90vh;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
      }
    `;
    document.head.appendChild(style);

    // Create Trigger Button
    const trigger = document.createElement('button');
    trigger.className = 'ce-trigger';
    trigger.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
      <span>Mã nguồn</span>
    `;
    document.body.appendChild(trigger);

    // Create Modal Element
    const modal = document.createElement('div');
    modal.className = 'ce-modal';
    modal.innerHTML = `
      <div class="ce-container">
        <div class="ce-header">
          <div class="ce-header-title">
            <span>💻</span> <span>${PROJECT_TITLE}</span>
          </div>
          <div class="ce-header-actions">
            <button class="ce-copy-btn">Copy code</button>
            <button class="ce-close">✕</button>
          </div>
        </div>
        <div class="ce-body">
          <div class="ce-sidebar">
            <div class="ce-sidebar-title">Explorer</div>
            <div class="ce-tree-container"></div>
          </div>
          <div class="ce-main">
            <div class="ce-tabs"></div>
            <div class="ce-editor-container">
              <div class="ce-loading" style="display:none;">Tải mã...</div>
              <div class="ce-line-numbers"></div>
              <pre><code class="ce-code"></code></pre>
              <div class="ce-img-container" style="display:none;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // References
    const treeContainer = modal.querySelector('.ce-tree-container');
    const tabsContainer = modal.querySelector('.ce-tabs');
    const codeEl = modal.querySelector('.ce-code');
    const lineNumbers = modal.querySelector('.ce-line-numbers');
    const copyBtn = modal.querySelector('.ce-copy-btn');
    const closeBtn = modal.querySelector('.ce-close');
    const loadingEl = modal.querySelector('.ce-loading');
    const imgContainer = modal.querySelector('.ce-img-container');
    const preEl = modal.querySelector('.ce-editor-container pre');

    let openTabs = [];
    let activeFile = '';
    let fileCache = {};

    // Build Explorer Tree
    function renderExplorer(items, container, depth = 0) {
      items.forEach(node => {
        if (node.type === 'directory') {
          const dirBtn = document.createElement('button');
          dirBtn.className = 'ce-tree-dir';
          dirBtn.style.paddingLeft = `${depth * 12 + 15}px`;
          dirBtn.innerHTML = `📁 ${node.name}`;
          
          const childContainer = document.createElement('div');
          childContainer.style.display = 'block';
          
          dirBtn.onclick = () => {
            const isOpen = childContainer.style.display === 'block';
            childContainer.style.display = isOpen ? 'none' : 'block';
            dirBtn.innerHTML = isOpen ? `📁 ${node.name}` : `📂 ${node.name}`;
          };
          
          container.appendChild(dirBtn);
          container.appendChild(childContainer);
          renderExplorer(node.children, childContainer, depth + 1);
        } else {
          const fileBtn = document.createElement('button');
          const ext = node.name.split('.').pop();
          fileBtn.className = `ce-tree-file ${ext}`;
          fileBtn.style.paddingLeft = `${depth * 12 + 15}px`;
          
          // Custom SVG file icon
          let svgIcon = `
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          `;
          
          fileBtn.innerHTML = `${svgIcon} <span>${node.name}</span>`;
          fileBtn.onclick = () => selectFile(node.path);
          container.appendChild(fileBtn);
        }
      });
    }

    renderExplorer(FILES, treeContainer);

    // File Selection
    function selectFile(path) {
      activeFile = path;
      
      // Update tree selection styles
      modal.querySelectorAll('.ce-tree-file').forEach(btn => {
        const spanText = btn.querySelector('span').innerText;
        const fileObj = FILES.find(f => f.path === path);
        if (fileObj && fileObj.name === spanText) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Add tab if not present
      if (!openTabs.includes(path)) {
        openTabs.push(path);
      }
      
      renderTabs();
      loadFile(path);
    }

    // Tabs rendering
    function renderTabs() {
      tabsContainer.innerHTML = '';
      openTabs.forEach(path => {
        const name = path.split('/').pop();
        const tab = document.createElement('div');
        tab.className = `ce-tab ${activeFile === path ? 'active' : ''}`;
        tab.innerHTML = `
          <span>${name}</span>
          <span class="ce-tab-close">✕</span>
        `;
        tab.onclick = () => selectFile(path);
        
        tab.querySelector('.ce-tab-close').onclick = (e) => {
          e.stopPropagation();
          openTabs = openTabs.filter(t => t !== path);
          if (activeFile === path) {
            if (openTabs.length > 0) {
              selectFile(openTabs[openTabs.length - 1]);
            } else {
              activeFile = '';
              codeEl.innerText = '';
              lineNumbers.innerHTML = '';
              imgContainer.style.display = 'none';
              preEl.style.display = 'block';
              lineNumbers.style.display = 'block';
            }
          }
          renderTabs();
        };
        tabsContainer.appendChild(tab);
      });
    }

    // Fetch and display file
    function loadFile(path) {
      const ext = path.split('.').pop()?.toLowerCase();
      const isImg = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext);

      if (isImg) {
        preEl.style.display = 'none';
        lineNumbers.style.display = 'none';
        imgContainer.style.display = 'flex';
        imgContainer.innerHTML = `
          <div class="ce-img-preview">
            <div class="ce-img-card">
              <img src="${path}" alt="${path}">
              <div class="ce-img-info">${path}</div>
            </div>
          </div>
        `;
        return;
      }

      preEl.style.display = 'block';
      lineNumbers.style.display = 'block';
      imgContainer.style.display = 'none';

      if (fileCache[path]) {
        displayCode(fileCache[path], ext);
        return;
      }

      loadingEl.style.display = 'flex';
      codeEl.innerText = '';
      lineNumbers.innerHTML = '';

      fetch(path)
        .then(res => {
          if (!res.ok) throw new Error();
          return res.text();
        })
        .then(text => {
          fileCache[path] = text;
          loadingEl.style.display = 'none';
          displayCode(text, ext);
        })
        .catch(() => {
          loadingEl.style.display = 'none';
          codeEl.innerText = 'Lỗi khi tải tệp...';
        });
    }

    // Highlight code using Prism
    function displayCode(code, ext) {
      const langClass = ext === 'html' ? 'markup' : (ext === 'py' ? 'python' : ext);
      codeEl.className = `ce-code language-${langClass}`;
      codeEl.innerText = code;
      
      // Render line numbers
      const lines = code.split('\n');
      lineNumbers.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
      
      loadPrism(() => {
        if (window.Prism) {
          window.Prism.highlightElement(codeEl);
        }
      });
    }

    // Modal Control
    function openExplorer() {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (!activeFile && FILES.length > 0) {
        selectFile(FILES[0].path);
      }
    }

    function closeExplorer() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    trigger.onclick = openExplorer;
    closeBtn.onclick = closeExplorer;
    
    modal.onclick = (e) => {
      if (e.target === modal) closeExplorer();
    };

    // Copy to Clipboard
    copyBtn.onclick = () => {
      const content = fileCache[activeFile] || codeEl.innerText;
      navigator.clipboard.writeText(content).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        setTimeout(() => copyBtn.innerText = originalText, 1500);
      });
    };

    // URL Check (?code=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code') === 'true' || window.location.hash === '#code') {
      openExplorer();
    }
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
