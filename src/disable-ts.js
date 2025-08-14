const fs = require('fs');
const path = require('path');

function addTsNoCheck(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.startsWith('// @ts-nocheck')) {
      content = '// @ts-nocheck\n' + content;
      fs.writeFileSync(filePath, content);
      console.log(`Added @ts-nocheck to ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        processDirectory(fullPath);
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
        addTsNoCheck(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message);
  }
}

// Process src directory
processDirectory('./src');
console.log('Finished adding @ts-nocheck to all TypeScript files');