const fs = require('fs');
const path = require('path');
const moment = require('moment');

/**
 * Generates a string representation of the directory structure starting from the root.
 * 
 * @param {String} rootDir - The root directory path to generate the structure from.
 * @param {String} prefix - The prefix to use for each line in the structure. Defaults to an empty string.
 * @returns {String} A string representation of the directory structure starting from the root.
 */
function generateStructureFromRoot(rootDir, prefix = '') {
    const files = fs.readdirSync(rootDir);
    let structure = '';

    files.forEach((file, index) => {
        // Skip certain directories that are not relevant to the project structure
        if (file === 'node_modules' || file === '.git') return;

        const isLast = index === files.length - 1;
        const filePath = path.join(rootDir, file);
        const stats = fs.statSync(filePath);

        // Construct the line for the current file or directory
        structure += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;

        // If the current file is a directory, recursively generate its structure
        if (stats.isDirectory()) {
            structure += generateStructureFromRoot(filePath, prefix + (isLast ? '    ' : '│   '));
        }
    });

    return structure;
}

// Navigate to the root directory from the script location, going up one level
const rootDir = path.resolve(__dirname, '../');
// Generate the project structure starting from the root directory
const projectStructure = generateStructureFromRoot(rootDir);
console.log(projectStructure);

// Save the project structure to a file in the root directory with the current date and time
const fileName = `project-structure-${moment().format('YYYYMMDD-HHmmss')}.txt`;
fs.writeFileSync(path.join(rootDir, fileName), projectStructure);
console.log(`Project structure has been saved to ${fileName}`);