const http = require('http');
const path = require('path');
const fs = require('fs');
const data = require('./urls.json');

http.createServer((req, res) => {
    const baseURL = 'http://' + req.headers.host + '/';
    const allURL = new URL(req.url, baseURL);
    if (allURL.pathname === '/favicon.ico') {
        return;
    }
    res.writeHead(200, { 'Access-Control-Allow-Origin': "*" });
    const { name, url, del } = paramsToObject(allURL.searchParams.entries());
    if (!name || !url) {
        return res.end(JSON.stringify(data));
    }

    if (del) {
        data.urls = data.urls.filter(item => String(item.url) !== String(url));
        return writeFile((message) => res.end(message));
    }

    data.urls.push({ name, url });

    return writeFile((message) => res.end(message));
}).listen(3000, () => console.log('Server is running'));


function paramsToObject(entries) {
    const result = {};
    for (const [key, value] of entries) {
        result[key] = value;
    }
    return result;
}

function writeFile(cb) {
    fs.writeFile(path.join(__dirname, "urls.json"),
        JSON.stringify(data, null, 2),
        err => {
            if (err) throw err;

            cb(JSON.stringify({ message: "ok" }));
        });
}