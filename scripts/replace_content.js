import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target blog content directory
const targetDir = path.resolve(__dirname, '../src/content/blog');

function replaceEmDashInDir(dir) {
    if (!fs.existsSync(dir)) {
        console.error(`Directory not found: ${dir}`);
        return;
    }
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            replaceEmDashInDir(filePath);
        } else if (filePath.endsWith('.md')) {
            let content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('—')) {
                console.log(`Replacing em-dashes in: ${filePath}`);
                const updatedContent = content.replaceAll('—', '-');
                fs.writeFileSync(filePath, updatedContent, 'utf8');
            }
        }
    });
}

replaceEmDashInDir(targetDir);
console.log('Replacement complete!');
