const handlebars = require('handlebars'),
fs = require('fs'),
path = require('path'),
csvtojson=require("csvtojson"),
{ ArgumentParser } = require('argparse');

//parser
const parser = new ArgumentParser({
    description: 'handlebars compile'
  });

parser.add_argument('-t', '--template', { help:'template path' });
parser.add_argument('-d', '--data', { help: 'data path (json or csv)' });
parser.add_argument('-o', '--output', { help: 'output path' });

//helpers
const isExt = (path,ext)=>new RegExp(`/\.${ext}$/`).test(path);

const ConvertDataToJson = async (path,data) =>{
    
    if(isExt('json')){return JSON.parse(data);}
    if(isExt('csv')){
        return await csvtojson.fromString(data)
    }
    throw 'data format not yet supported';
}


/*******************************************
 * MAIN
 ******************************************/
let {template:TEMPLATE_PATH,data:DATA_PATH,output:RESULT_PATH} = parser.parse_args();
TEMPLATE_PATH = path.resolve(TEMPLATE_PATH);
DATA_PATH = path.resolve(DATA_PATH);
RESULT_PATH = path.resolve(RESULT_PATH);

//read template
const html = fs.readFileSync(TEMPLATE_PATH,'utf-8').toString();
var template = handlebars.compile(html);

//parse data
const data = fs.readFileSync(DATA_PATH);
const json = await ConvertDataToJson(DATA_PATH,data);
console.write('using json',json);

//merge and output
const result = template(json);
fs.writeFileSync(RESULT_PATH,result, 'utf-8');
console.log('Created final doc.')

