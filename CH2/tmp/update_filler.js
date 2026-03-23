const fs = require('fs');
const path = require('path');

const pagesDir = path.join('C:', 'CH', 'frontend', 'src', 'pages');
const pages = ['QA.jsx', 'Deadlines.jsx', 'Events.jsx', 'Placements.jsx', 'Faculty.jsx'];

pages.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add useAuth import if not present
  if (!content.includes('useAuth')) {
    content = content.replace("from 'react';", "from 'react';\nimport { useAuth } from '../context/AuthContext';");
  }

  // Inject useAuth hook and conditional data
  content = content.replace(/(const \w+Data = \[)([\s\S]*?)(\];)/, (match, p1, p2, p3) => {
    return `const { user } = useAuth();\n  let ${p1.split(' ')[1]} = [];\n  if (user?.email === 'teja@gmail.com') {\n    ${p1.split(' ')[1]} = [\n${p2}\n    ];\n  }`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
});

// Update Polls.jsx separately since it's an object not an array
let pollsContent = fs.readFileSync(path.join(pagesDir, 'Polls.jsx'), 'utf8');
if (!pollsContent.includes('useAuth')) {
  pollsContent = pollsContent.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useAuth } from '../context/AuthContext';");
}
pollsContent = pollsContent.replace(/const pollData = \{([\s\S]*?)\};/, (m, p1) => {
  return `const { user } = useAuth();\n  const isTeja = user?.email === 'teja@gmail.com';\n  const pollData = isTeja ? {${p1}} : { question: 'No active polls.', totalVotes: 0, options: [] };`;
});
fs.writeFileSync(path.join(pagesDir, 'Polls.jsx'), pollsContent, 'utf8');

console.log('Successfully updated component files with teja validation!');
