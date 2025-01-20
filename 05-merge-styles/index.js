const fs = require('fs/promises');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const bundlePath = path.join(outputDir, 'bundle.css');
async function mergeStyles() {
    try {
        await fs.mkdir(outputDir, { recursive: true });

        const files = await fs.readdir(stylesDir, { withFileTypes: true });

        const cssFiles = files.filter(
            (file) => file.isFile() && path.extname(file.name) === '.css'
        );

        const stylesArray = [];
        for (const file of cssFiles) {
            const filePath = path.join(stylesDir, file.name);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            stylesArray.push(fileContent);
        }

        await fs.writeFile(bundlePath, stylesArray.join('\n'));

        console.log('bundle.css is created');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

mergeStyles();
