const { info } = require('console');
const fs = require('fs');

function leerJSON(path){
    const data = fs.readFileSync(path);
    const pcs = JSON.parse(data).pcs;
    return pcs;
}

function escribirJSON(path, info){
    const data = JSON.stringify({'pcs': info});
    fs.writeFileSync(path, data);
}


module.exports = {
    leerJSON,
    escribirJSON
}