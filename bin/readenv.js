const fs = require("fs-extra");
require('dotenv').config();

const contentConfigAPI = `// this is an auto generated file from ENV Variables
export const APIHOST = '${process.env.APIHOST ? process.env.APIHOST : 'localhost'}';
export const APIPORT = '${process.env.APIPORT ? process.env.APIPORT : '3000'}';
export const APIPROTOCOL = '${process.env.APIPROTOCOL ? process.env.APIPROTOCOL : 'http'}';
`;
fs.writeFile('src/config/env.ts', contentConfigAPI, 'utf8', (error) => {
  if (error) throw error;
  console.log(`API Config Environtment rewrited!`);
});