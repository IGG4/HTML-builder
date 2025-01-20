const fs = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsSrc = path.join(__dirname, 'assets');
const assetsDest = path.join(projectDist, 'assets');
const outputHtml = path.join(projectDist, 'index.html');
const outputCss = path.join(projectDist, 'style.css');

async function createProjectDist() {
    await fs.mkdir(projectDist, { recursive: true });
}

async function generateHtml() {
    let template = await fs.readFile(templatePath, 'utf-8');

    const tags = template.match(/{{\s*[\w-]+\s*}}/g);
    if (tags) {
        for (const tag of tags) {
            const componentName = tag.replace(/{{\s*|\s*}}/g, '');
            const componentPath = path.join(componentsPath, `${componentName}.html`);

            try {
                const componentContent = await fs.readFile(componentPath, 'utf-8');
                template = template.replace(tag, componentContent);
            } catch {
                console.warn(`Component ${componentName} not found. Skipping.`);
            }
        }
    }

    await fs.writeFile(outputHtml, template);
    console.log('index.html is created.');
}

async function mergeStyles() {
    const files = await fs.readdir(stylesPath, { withFileTypes: true });

    const stylesArray = [];
    for (const file of files) {
        const ext = path.extname(file.name);
        if (file.isFile() && ext === '.css') {
            const filePath = path.join(stylesPath, file.name);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            stylesArray.push(fileContent);
        }
    }

    await fs.writeFile(outputCss, stylesArray.join('\n'));
    console.log('style.css is created.');
}

async function copyAssets(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const items = await fs.readdir(src, { withFileTypes: true });

    for (const item of items) {
        const srcPath = path.join(src, item.name);
        const destPath = path.join(dest, item.name);

        if (item.isDirectory()) {
            await copyAssets(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
    console.log(`Folder assets is created in ${dest}`);
}

async function buildPage() {
    try {
        await createProjectDist();

        await generateHtml();

        await mergeStyles();

        await copyAssets(assetsSrc, assetsDest);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

buildPage();
