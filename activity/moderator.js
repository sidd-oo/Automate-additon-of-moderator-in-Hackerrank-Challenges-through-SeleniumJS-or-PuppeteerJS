let fs = require("fs");
let cd = require("chromedriver");
let sd = require("selenium-webdriver");
let builder = new sd.Builder();
let driver = builder.forBrowser('chrome').build();

let cfile = process.argv[2];
let userToAdd = process.argv[3];

