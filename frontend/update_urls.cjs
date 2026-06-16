const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src');

function findAndReplace(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            findAndReplace(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Step 1: Replace all 'https://panchayat-system.onrender.com/...' with '`${API_URL}/...`'
            // Need to handle both single quotes and backticks.
            content = content.replace(/'https:\/\/panchayat-system\.onrender\.com([^']*)'/g, '`${API_URL}$1`');
            content = content.replace(/`https:\/\/panchayat-system\.onrender\.com([^`]*)`/g, '`${API_URL}$1`');
            content = content.replace(/"https:\/\/panchayat-system\.onrender\.com([^"]*)"/g, '`${API_URL}$1`');

            // Step 2: Inject the API_URL constant at the top of the file if we made changes
            if (content !== originalContent) {
                const apiInjection = `const API_URL = import.meta.env.DEV ? "http://localhost:5000" : "https://panchayat-system.onrender.com";\n\n`;
                
                // Insert after the last import statement
                const importRegex = /import.*?;?\n/g;
                let lastImportIndex = 0;
                let match;
                while ((match = importRegex.exec(content)) !== null) {
                    lastImportIndex = match.index + match[0].length;
                }

                if (lastImportIndex > 0) {
                    content = content.slice(0, lastImportIndex) + "\n" + apiInjection + content.slice(lastImportIndex);
                } else {
                    content = apiInjection + content;
                }

                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

findAndReplace(directory);
console.log("Done!");
