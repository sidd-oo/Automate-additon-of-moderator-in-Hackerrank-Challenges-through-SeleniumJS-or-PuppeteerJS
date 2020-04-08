let fs = require("fs");
let cd = require("chromedriver");
let sd = require("selenium-webdriver");
let builder = new sd.Builder();
let driver = builder.forBrowser('chrome').build();

let cfile = process.argv[2];
let userToAdd = process.argv[3];

//IIFE - Immedietly invoked function execution
(async function () {
    try {
        //This prevents from getting immediate error. It waits till the whole pages loads.
        //It identify performance issues and finds when a webpage takes too much time to load and catch it in your test.
        //ImplicitWait ::: Using Implicit Wait, we can tell WebDriver to wait for a certain amount of time when trying to
        //element(s) on the page.Any search for elements on the page could take the time the implicit wait is set for 
        //i.e.for the entire time the browser is open.The default value is 0. We can use Implicit Wait as follows:

        await driver.manage().setTimeouts({
            implicit: 10000,
            pageLoad: 10000
        });

        //Reading the cfile content through async await
        let contents = await fs.promises.readFile(cfile, "utf-8");
        let credentials = JSON.parse(contents);
        let user = credentials.user;
        let pwd = credentials.pwd;
        let url = credentials.url;

        //Opening the Hackerrank's url
        await driver.get(url);
        let usernameElement = await driver.findElement(sd.By.css('#input-1'));
        let passwordElement = await driver.findElement(sd.By.css('#input-2'));

        //Passing of keys into username and password text fields
        await usernameElement.sendKeys(user);
        await passwordElement.sendKeys(pwd);

        //Trying to hit login button
        let loginButtonElement = await driver.findElement(sd.By.css('.auth-button'));
        await loginButtonElement.click();

        //Extracting the href of Admistration page from top-right dropdown menu
        let admistrationElement = (await driver).findElement(sd.By.css("a[data-analytics=NavBarProfileDropDownAdministration]"));
        let admistrationElementurl = await admistrationElement.getAttribute("href");
        await driver.get(admistrationElementurl);

        //Getting into manage challenges tab
        let manageTabsElement = await driver.findElements(sd.By.css(".nav-tabs.nav.admin-tabbed-nav li"));
        await manageTabsElement[1].click();
        let currenturl = await driver.getCurrentUrl();



    } catch (err) {
        console.log(err);
    }
})();