const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function init() {
    const currentDir = process.cwd();
    
    // Check if directory is empty (except for node_modules, .git, etc.)
    const files = fs.readdirSync(currentDir).filter(file => 
        !file.startsWith('.') && file !== 'node_modules'
    );
    
    if (files.length > 0) {
        console.log('⚠️  Warning: Current directory is not empty.');
        console.log('This will create files in the current directory.');
        console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
        
        // Wait 3 seconds
        const start = Date.now();
        while (Date.now() - start < 3000) {
            // Wait
        }
    }
    
    console.log('🚀 Initializing API Starter project...\n');
    
    // Create api directory
    const apiDir = path.join(currentDir, 'api');
    if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir, { recursive: true });
    }
    
    // Create index.js (server file)
    const serverFile = path.join(currentDir, 'index.js');
    if (!fs.existsSync(serverFile)) {
        fs.writeFileSync(serverFile, getServerTemplate());
        console.log('✅ Created index.js');
    } else {
        console.log('⚠️  index.js already exists, skipping...');
    }
    
    // Create api/index.js
    const apiIndexFile = path.join(apiDir, 'index.js');
    if (!fs.existsSync(apiIndexFile)) {
        fs.writeFileSync(apiIndexFile, getApiIndexTemplate());
        console.log('✅ Created api/index.js');
    } else {
        console.log('⚠️  api/index.js already exists, skipping...');
    }
    
    // Create .env file
    const envFile = path.join(currentDir, '.env');
    if (!fs.existsSync(envFile)) {
        fs.writeFileSync(envFile, 'PORT=3000\n');
        console.log('✅ Created .env');
    } else {
        console.log('⚠️  .env already exists, skipping...');
    }
    
    // Create .gitignore
    const gitignoreFile = path.join(currentDir, '.gitignore');
    if (!fs.existsSync(gitignoreFile)) {
        fs.writeFileSync(gitignoreFile, getGitignoreTemplate());
        console.log('✅ Created .gitignore');
    } else {
        console.log('⚠️  .gitignore already exists, skipping...');
    }
    
    // Create package.json if it doesn't exist
    const packageJsonFile = path.join(currentDir, 'package.json');
    if (!fs.existsSync(packageJsonFile)) {
        fs.writeFileSync(packageJsonFile, JSON.stringify(getPackageJsonTemplate(), null, 2));
        console.log('✅ Created package.json');
    } else {
        console.log('⚠️  package.json already exists, updating dependencies...');
        try {
            const existingPackage = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
            existingPackage.dependencies = existingPackage.dependencies || {};
            existingPackage.dependencies.express = existingPackage.dependencies.express || '^4.18.2';
            existingPackage.dependencies.dotenv = existingPackage.dependencies.dotenv || '^17.2.3';
            existingPackage.scripts = existingPackage.scripts || {};
            existingPackage.scripts.start = existingPackage.scripts.start || 'node index.js';
            existingPackage.scripts.dev = existingPackage.scripts.dev || 'nodemon index.js';
            fs.writeFileSync(packageJsonFile, JSON.stringify(existingPackage, null, 2));
        } catch (e) {
            console.log('⚠️  Could not update package.json');
        }
    }
    
    console.log('\n📦 Installing dependencies...');
    try {
        execSync('npm install', { stdio: 'inherit', cwd: currentDir });
        console.log('\n✅ Dependencies installed successfully!');
    } catch (error) {
        console.log('\n⚠️  Failed to install dependencies. Please run "npm install" manually.');
    }
    
    console.log('\n🎉 Project initialized successfully!');
    console.log('\nNext steps:');
    console.log('  1. Run "npm start" to start the server');
    console.log('  2. Run "npm run dev" for development with auto-reload');
    console.log('  3. Create your API routes in the "api" directory');
    console.log('\nExample: Create api/user/index.js for GET /user');
}

function getServerTemplate() {
    return `const express = require('express');
const app = express();
const fs = require("fs");
const path = require('path');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ROOT_PATH = './api/';
async function handle_routes(file_uri, req, res) {
    try {
        // Check if file exists
        if(!fs.existsSync(file_uri)) {
            return false;
        }
        
        // Use require for CommonJS modules (since route files use module.exports)
        // Convert relative path to absolute for require.resolve
        const absolutePath = path.resolve(file_uri);
        const resolvedPath = require.resolve(absolutePath);
        // Clear cache for hot-reloading during development
        if(require.cache[resolvedPath]) {
            delete require.cache[resolvedPath];
        }
        const module = require(absolutePath);
        let data = null;
        
        if(module[req.method]) {
            data = await module[req.method](req, res);
        } else if(module.handler) {
            data = await module.handler(req, res);
        } else if(module.default) {
            data = await module.default(req, res);
        } else {
            return false;
        }
        return data;
    } catch (error) {
        console.log('Route handler error:', error);
        return false;
    }
}

async function handle_dynamic_routes(folder) {
    try {
        const files = await fs.promises.readdir(folder)
        const file_name = files.find(file_name => {
            return file_name.match(/\\[[a-zA-Z0-9]+\\]/)
        })
        if(!file_name) {
            return false
        }
        // Extract parameter name from [param].js format
        const param = file_name.replace(/\\[|\\]|\\.js/g, "")
        return {
            file_name,
            param: param
        }
    } catch (error) {
        console.log(error)
        return false
    }
}


app.all("/*", async (req, res) => {
    let file_uri = (ROOT_PATH + req.url).replace(/\\/\\//g, "/");
    let file_exists = fs.existsSync(file_uri + '.js');
    
    if(!file_exists) {
        const dir_path = file_uri;
        if(fs.existsSync(dir_path + '/index.js')) {
            file_uri = dir_path + '/index.js';
        } else {
            // Check parent directory for dynamic routes
            const parent_dir = path.dirname(dir_path);
            const dynamic_route = await handle_dynamic_routes(parent_dir);
            if(dynamic_route) {
                file_uri = parent_dir + '/' + dynamic_route.file_name;
                const pathParts = req.url.split('/').filter(p => p);
                const lastPart = pathParts[pathParts.length - 1];
                if(!req.params) req.params = {};
                req.params[dynamic_route.param] = lastPart;
            } else {
                res.status(404).json({ error: 'Route not found' });
                return;
            }
        }
    } else {
        file_uri += '.js'
    }

    let result = await handle_routes(file_uri, req, res)
    if(result === false) {
        res.status(404).json({ error: 'Route not found' });
    } else {
        return result
    }
});

app.listen(process.env.PORT, () => {
  console.log("server is running...");
});
`;
}

function getApiIndexTemplate() {
    return `exports.handler = (req, res) => {
    return res.json({
        status: 200,
        message: \`Index route handler\`,
        data: {
            message: 'Hello World'
        }
    });
};
`;
}

function getGitignoreTemplate() {
    return `node_modules/
.env
.DS_Store
*.log
`;
}

function getPackageJsonTemplate() {
    return {
        name: 'my-api-starter',
        version: '1.0.0',
        description: 'API Starter project',
        main: 'index.js',
        scripts: {
            start: 'node index.js',
            dev: 'nodemon index.js'
        },
        keywords: ['api', 'express', 'starter'],
        author: '',
        license: 'ISC',
        dependencies: {
            express: '^4.18.2',
            dotenv: '^17.2.3'
        },
        devDependencies: {
            nodemon: '^3.1.11'
        }
    };
}

module.exports = { init };
