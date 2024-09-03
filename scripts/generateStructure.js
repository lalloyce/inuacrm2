const fs = require('fs');
const path = require('path');

function generateStructure(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    let structure = '';

    files.forEach((file, index) => {
        if (file === 'node_modules' || file === '.git') return;

        const isLast = index === files.length - 1;
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        structure += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;

        if (stats.isDirectory()) {
            structure += generateStructure(filePath, prefix + (isLast ? '    ' : '│   '));
        }
    });

    return structure;
}

const projectStructure = generateStructure('.');
console.log(projectStructure);

fs.writeFileSync('project-structure.txt', projectStructure);
console.log('Project structure has been saved to project-structure.txt');