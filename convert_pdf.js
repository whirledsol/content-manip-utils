/*
    convert_pdf.js
        * Requires docker api running: 
            ```docker pull thecodingmachine/gotenberg```
            ```docker run --rm -p 3000:3000 thecodingmachine/gotenberg```
*/
const { pipe, gotenberg, convert, office, please } = require('gotenberg-js-client');
const fs = require('fs');
const path = require('path');
const { ArgumentParser } = require('argparse');

//parser
const parser = new ArgumentParser({
    description: 'handlebars compile'
  });

parser.add_argument('-d', '--directory', { help:'directory path', required:true });


//helpers
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
  


/*******************************************
 * MAIN
 ******************************************/
const start = async () =>{
    let {directory} = parser.parse_args();
    directory = path.resolve(__dirname,directory);
    const files = getFiles(directory)
    for(let file of files){
        file = path.join(directory,file);
        console.log(`\nWorking on ${file}\n`);
        
        const ext = path.extname(file);
        const basename = path.basename(file,ext);
        const newfile = path.join(directory,`${basename}.pdf`);

        const pdf = await toPDF(fs.createReadStream(file));
        pdf.pipe(fs.createWriteStream(newfile));
    }
};

start();
