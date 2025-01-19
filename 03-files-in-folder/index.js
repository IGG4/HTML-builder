const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function listFolderContents() {
    try {
        const entries = await fs.readdir(folderPath, { withFileTypes: true });

        if (entries.length === 0) {
            console.log('Folder is empty.');
            return;
        }

        for (const entry of entries) {
            const entryPath = path.join(folderPath, entry.name);

            if (entry.isFile()) {
                const fileStats = await fs.stat(entryPath);
                const fileName = path.basename(entry.name, path.extname(entry.name));
                const fileExtension = path.extname(entry.name).slice(1);
                const fileSize = (fileStats.size / 1024).toFixed(3);

                console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
            } else if (entry.isDirectory()) {
                console.log(`${entry.name} - folder`);
            } else {
                console.log(`Unknown object: ${entry.name}`);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

listFolderContents();



