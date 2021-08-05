/*
    convert_pdf.js
        * Requires docker api running: 
            ```docker pull thecodingmachine/gotenberg```
            ```docker run --rm -p 3000:3000 thecodingmachine/gotenberg```
*/
const { pipe, gotenberg, convert, office, please } = require('gotenberg-js-client');
const fs = require('fs');
const path = require('path');

const getFiles = (dir) => {
    console.log(`\nreading ${dir}\n`);
    return fs.readdirSync(dir)
};

const toPDF = pipe(
    gotenberg('http://localhost:3000'),
    convert,
    office,
    please
);
  
const start = async () =>{
    let dir = '...';
    dir = path.resolve(__dirname,dir);
    const files = getFiles(dir)
    for(let file of files){
        file = path.join(dir,file);
        console.log(`\nWorking on ${file}\n`);
        
        const ext = path.extname(file);
        const basename = path.basename(file,ext);
        const newfile = path.join(dir,`${basename}.pdf`);

        const pdf = await toPDF(fs.createReadStream(file));
        pdf.pipe(fs.createWriteStream(newfile));
    }
};

start();
