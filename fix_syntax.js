const fs = require('fs');
const path = require('path');
const dir = 'web';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');

  // We want to remove the orphaned code block:
  const toRemove = `const toggleBtn = document.getElementById('sidebar-toggle');
      const sidebar = document.getElementById('sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (!toggleBtn || !sidebar || !backdrop) return;

      toggleBtn.onclick = function(e) {
        e.stopPropagation();
        toggleMobileSidebar();
      };

      backdrop.onclick = function() {
        toggleMobileSidebar(false);
      };

      sidebar.querySelectorAll('.sidebar-link').forEach(link => {
        link.onclick = function() {
          toggleMobileSidebar(false);
        };
      });`;
  
  // Create a regex to match it flexibly with whitespaces
  const regexStr = toRemove.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
  const regex = new RegExp(regexStr, 'g');
  
  if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Fixed ' + file);
  } else {
    // Maybe try a slightly different match, or the 'let currentUrgencyMultiplier' is mixed in
    console.log('Did not match in ' + file);
  }
});
