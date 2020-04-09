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
        let admistrationElement = await driver.findElement(sd.By.css("a[data-analytics=NavBarProfileDropDownAdministration]"));
        let admistrationElementurl = await admistrationElement.getAttribute("href");
        await driver.get(admistrationElementurl);

        //Getting into manage challenges tab
        let manageTabsElement = await driver.findElement(sd.By.css(".nav-tabs.nav.admin-tabbed-nav li a[href='/administration/challenges']"));
        let manageTabsElementURL = await manageTabsElement.getAttribute('href');
        await driver.get(manageTabsElementURL);
        let currenturl = await driver.getCurrentUrl();

        //Check whether the next question exits or not: If next question exist we will proceed or if not exist we will return undefined and quit handling the question.
        let questionIndex = 0;
        let questionElement = await getQuestionElement(currenturl, questionIndex);
        while (questionElement !== undefined) {
            await handleQuestion(questionElement);
            questionIndex++;
            questionElement = await getQuestionElement(currenturl, questionIndex);
        }
    } catch (err) {
        console.log(err);
    }
})();

//Get Question Element
async function getQuestionElement(currenturl, questionIndex) {

    (await driver).get(currenturl);
    //Finding the PageIndex and questionIndex on the the current page
    let pageIndex = parseInt(questionIndex / 10);
    questionIndex = questionIndex % 10;

    //Finding nextpageButtonElement : Navigating through the pages to reach the questionElement
    let paginationButtons = await driver.findElements(sd.By.css(".pagination li"));
    let nextPageButton = paginationButtons[paginationButtons.length - 2];
    let classOnNextPageButton = await nextPageButton.getAttribute("class");

    //Clicking the NextPage Button to reach the Question Page
    for (let i = 0; i < pageIndex; i++) {
        if (classOnNextPage !== "disabled") {
            //Clicking nextPage Button
            await nextPageButton.click();
            // Finding current page nextpageButtonElement and classOnNextPage
            paginationButtons = await driver.findElements(sd.By.css(".pagination li"));
            nextPageButton = paginationButtons[paginationButtons.length - 2];
            classOnNextPageButton = await nextPageButton.getAttribute("class");
        } else {
            return undefined;
        }
    }

    //Finding the question element
    let questionElements = await driver.findElements(sd.By.css(".backbone.block-center"));
    if (questionIndex < questionElements.length) {
        return questionElements[questionIndex];
    } else {
        return undefined;
    }

}

//Handle Question to add the moderator
async function handleQuestion(questionElement) {
    let questionurl = await questionElement.getAttribute('href');
    await questionElement.click();

    //Waiting till the last tag to load
    await driver.wait(sd.until.elementLocated(sd.By.css('span.tag')));
    //Finding and navigating to the moderatorTab
    let moderatorTab = await driver.findElement(sd.By.css('li[data-tab=moderators]'));
    await moderatorTab.click();

    //Finding the moderatorTextBox Element and sending the keys
    let moderatorTextBox = (await driver).findElement(sd.By.css('#moderator'));
    await moderatorTextBox.sendKeys(userToAdd);
    console.log("*********************Enter***************************8")
    await moderatorTextBox.sendKeys(sd.Key.ENTER);

    //Saving the changes done
    console.log("*********************Save button**************************")
    let saveButton = (await driver).findElement(sd.By.css('.save-challenge'));
    console.log("*********************Save button click**************************")
    (await saveButton).click();
    console.log("*********************Save button clicked**************************")
    

}