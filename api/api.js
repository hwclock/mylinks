import http from "http"
import url from "url"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { readFile } from "fs/promises"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let data = JSON.parse(await readFile(new URL('./storage/urls.json', import.meta.url)));
const PORT = 3000

http.createServer( (req, res) => {

    res.writeHead(200, {"Access-Control-Allow-Origin": "*"})
    const { name, content, del } = url.parse(req.url, true).query

    // rota '/show'
    if (!name || !content) {
        return res.end(JSON.stringify(data))
    }

    // rota  'deletar registro'
    if (del) {

        for (let i in data.urls){
            if (data.urls[i].content == content){
                console.log(data.urls[i])
            }
        }

        data.urls = data.urls.filter(item => String(item.content) != String(content))
        console.log(data.urls)
        return writeJsonFile('deleted', (message) => res.end(message))
    }

    // rota 'adicionar registro'
    data.urls.push({name, content})
    return writeJsonFile('created', (message) => res.end(message))

}).listen(PORT, () => console.log(`API running at port ${PORT}....`))

function writeJsonFile(message, callback) {
    fs.writeFile(
        path.join(__dirname, 'storage', 'urls.json'),
        JSON.stringify(data, null, 2),
        (err) => {
            if (err) throw err
            callback(JSON.stringify({message: `${message}`}))
        }
    )
}