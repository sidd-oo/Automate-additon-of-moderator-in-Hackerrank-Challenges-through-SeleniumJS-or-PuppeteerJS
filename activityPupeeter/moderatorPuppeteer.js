let fs = require("fs");
let puppeteer = require("puppeteer");

(async function(){
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport : null,
        slowMo :100,
        args:['--start-maximized', '--disable-notifications']
    });

    let contents = await fs.promises.readFile(cfile,"utf-8");
    let credentials = JSON.parse(contents);
    let user  = credentials.user;
    let pwd = credentials.pwd;
    let url = credentials.url;

    let pages = await browser.pages();
    let page = pages[0];
    page.goto(url, {
        waitUntil:'networkile0'
    });
    

})();