const express = require('express');
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
            return file_name.match(/\[[a-zA-Z0-9]+\]/)
        })
        if(!file_name) {
            return false
        }
        // Extract parameter name from [param].js format
        const param = file_name.replace(/\[|\]|\.js/g, "")
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
    let file_uri = (ROOT_PATH + req.url).replace(/\/\//g, "/");
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
