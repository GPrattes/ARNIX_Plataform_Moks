const fs = require('fs');
const path = require('path');
const dir = 'web';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newSidebarLogic = `function initMobileSidebar() {
      const toggleBtn = document.getElementById('sidebar-toggle');
      const sidebar = document.getElementById('sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');

      if (toggleBtn) {
        toggleBtn.removeAttribute('onclick');
        toggleBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          toggleMobileSidebar();
        });
      }

      if (backdrop) {
        backdrop.removeAttribute('onclick');
        backdrop.addEventListener('click', function(e) {
          e.preventDefault();
          toggleMobileSidebar(false);
        });
      }

      if (sidebar) {
        sidebar.querySelectorAll('.sidebar-link').forEach(link => {
          link.addEventListener('click', function() {
            toggleMobileSidebar(false);
          });
        });
      }
    }`;

files.forEach(file => {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  let jsCode = '';
  let isObfuscated = false;

  const match = content.match(/_0x1a84\('([^']+)'\)/);
  if (match) {
    jsCode = Buffer.from(match[1], 'base64').toString('utf8');
    isObfuscated = true;
  } else {
    jsCode = content;
  }

  // Replace initMobileSidebar
  const oldFuncRegex = /function initMobileSidebar\(\) \{[\s\S]*?(?=function|let |const |var |\/\/|window\.)/m;
  if (oldFuncRegex.test(jsCode)) {
    jsCode = jsCode.replace(oldFuncRegex, newSidebarLogic + '\n\n    ');
  }

  if (isObfuscated) {
    // Remove the bottom exports
    jsCode = jsCode.replace(/if \(typeof[\s\S]*$/g, '');
    const toReplaceRegex = /\/\* ARNIX Executive Runtime[\s\S]*?\}\)\(window, document\);/m;
    content = content.replace(toReplaceRegex, jsCode.trim());
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Decoded and updated ' + file);
  } else if (file === 'index.html' || file === 'sobre.html' || file === 'ceo.html' || file === 'lg.html') {
    // If not obfuscated, replace in the HTML content directly
    content = content.replace(oldFuncRegex, newSidebarLogic + '\n\n    ');
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Updated ' + file);
  }
});
