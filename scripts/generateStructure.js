const fs = require('fs');
const path = require('path');

/**
 * Generates a string representation of the directory structure.
 * 
 * @param {String} dir - The directory path to generate the structure for.
 * @param {String} prefix - The prefix to use for each line in the structure. Defaults to an empty string.
 * @returns {String} A string representation of the directory structure.
 */
function generateStructure(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    let structure = '';

    files.forEach((file, index) => {
        // Skip certain directories that are not relevant to the project structure
        if (file === 'node_modules' || file === '.git') return;

        const isLast = index === files.length - 1;
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        // Construct the line for the current file or directory
        structure += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;

        // If the current file is a directory, recursively generate its structure
        if (stats.isDirectory()) {
            structure += generateStructure(filePath, prefix + (isLast ? '    ' : '│   '));
        }
    });

    return structure;
}

// Generate the project structure starting from the current directory
const projectStructure = generateStructure('.');
console.log(projectStructure);

// Save the project structure to a file
fs.writeFileSync('project-structure.txt', projectStructure);
console.log('Project structure has been saved to project-structure.txt');