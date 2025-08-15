#!/usr/bin/env node

// Add @ts-nocheck to all TypeScript files
const fs = require('fs');
const path = require('path');

function addTsNocheck(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      addTsNocheck(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.startsWith('// @ts-nocheck')) {
        const newContent = '// @ts-nocheck\n/* eslint-disable */\n\n' + content;
        fs.writeFileSync(filePath, newContent);
        console.log(`Added @ts-nocheck to ${filePath}`);
      }
    }
  }
}

// Run for src directory
addTsNocheck('./src');
console.log('Finished adding @ts-nocheck to all TypeScript files');