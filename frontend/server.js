import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

http.createServer( (req, res) => {
    
    const file = req.url === '/' ? 'index.html' : req.url
    const filePath = path.join(__dirname, 'public', file)
    const extname = path.extname(filePath)
    
    const alloweFileType = ['.html', '.css', '.js']
    const allowed = alloweFileType.find(item => item == extname)

    if (!allowed) return
    
    fs.readFile(
        filePath,
        (err, content) => {
            if (err) throw err
    
            res.end(content)
        }
    )
    
}).listen(5000, () => console.log('Server rodando na porta 5000....'))