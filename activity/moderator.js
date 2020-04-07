let fs = require("fs");
let cd = require("chromedriver");
let sd = require("selenium-webdriver");
let builder = new sd.Builder();
let driver = builder.forBrowser('chrome').build();

let cfile = process.argv[2];
let userToAdd = process.argv[3];
 

(async function(){
    //Reading the cfile content through async await
    let contents = await fs.promises.readFile(cfile,"utf-8");
    let credentials = JSON.parse(content);
    let user = credentials.user;
    let pwd = credentials.pwd;
    let url = credentials.url;
})();