const fs = require('fs/promises');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

async function copyDir() {
    try {
        await fs.mkdir(destinationDir, { recursive: true });

        const existingFiles = await fs.readdir(destinationDir, { withFileTypes: true });
        for (const file of existingFiles) {
            const filePath = path.join(destinationDir, file.name);
            await fs.rm(filePath, { recursive: true, force: true }); 
        }

        const files = await fs.readdir(sourceDir, { withFileTypes: true });

        for (const file of files) {
            const sourcePath = path.join(sourceDir, file.name);
            const destinationPath = path.join(destinationDir, file.name);

            if (file.isFile()) {
                await fs.copyFile(sourcePath, destinationPath);
            } else if (file.isDirectory()) {
                await copyNestedDir(sourcePath, destinationPath);
            }
        }

        console.log('Finish');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function copyNestedDir(source, destination) {
    try {
        await fs.mkdir(destination, { recursive: true });
        const nestedFiles = await fs.readdir(source, { withFileTypes: true });

        for (const nestedFile of nestedFiles) {
            const nestedSourcePath = path.join(source, nestedFile.name);
            const nestedDestinationPath = path.join(destination, nestedFile.name);

            if (nestedFile.isFile()) {
                await fs.copyFile(nestedSourcePath, nestedDestinationPath);
            } else if (nestedFile.isDirectory()) {
                await copyNestedDir(nestedSourcePath, nestedDestinationPath);
            }
        }
    } catch (error) {
        console.error('Error sub-folder:', error.message);
    }
}

copyDir();
