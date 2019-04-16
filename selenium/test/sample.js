var webdriver = require('selenium-webdriver');
var request = require('request');
var assert = require('chai').assert;

var remoteHub = 'http://localhost:4444/wd/hub';

describe("Subscribe", function(){
    // set the timeout for each test in this block to 5 minutes
    // this is generally how long Selenium will let a test run for before giving up
    this.timeout(5 * 10000 * 60);

    // Create the webdriver object on the block level so that it can be accessed by the tests below
    var driver = new webdriver.Builder()
        .usingServer(remoteHub)
        .forBrowser('chrome')
        .build();

    ///////////////////////////////////////

    beforeEach(function setupWebdriver(done){
        driver.get("https://barkboxdev.com") //load a specific URL, in this case google
        .then( done ) //pass off to the tests
    });

// Each "it" block describes one test scenario
// The first argument is documentation for the test

    /////// TEST: HOMEPAGE CLAIM OFFER BUTTON
    it("click claim offer", function(done){
        // Click Claim Offer
            driver.findElement(webdriver.By.css('#home-container > section.hero > div > div.hero-text > a:nth-child(3) > button')).click()

            // CHECK that we did a click
            .then(function(){
                driver.wait(function() { // wait for the URL to change
                    return driver.getCurrentUrl().then(function(url) {
                        return url; // once it does pass that data back up so we can compare url
                    });
                }, 10000); // wait some time
            })
            .then(function(url){
                assert('`https://barkboxdev.com/subscribe/name`',url);//gimi a green check if matches
            })
          

        // make sure next page is loaded fully by looking for an element
            .then(function(){
                return driver.wait(webdriver.until.elementLocated(webdriver.By.css("#edit_subscription_dog_name")),200)   
            })     
        // enter dog name in input    
            .then(function(){
                var dogNameInput = driver.findElement(webdriver.By.css('#subscription_dog_name_dog_name'));
                dogNameInput.click();
                dogNameInput.sendKeys('Dog name yo!').then(function(){
                    dogNameInput.sendKeys(webdriver.Key.ENTER)
                });
                
            })
        
        // CHECK that we entered dog name by waiting to find element on next page
           .then(function(){ 
                return driver.wait(webdriver.until.elementLocated(webdriver.By.css("#subscription-size-selection")),2000) 
            })

        // select small dog size
            .then(function(){
                var sizeSmall = driver.findElement(webdriver.By.css("#subscription-size-selection > div > button:nth-child(1)"));
                sizeSmall.click();
            })
            
        // wait for allergy page to load
            .then(function(){
                return driver.wait(webdriver.until.elementLocated(webdriver.By.css("#subscription-allergies-view")),2000)
            })

        // select no allergies
            .then(function(){
                var noAllergies = driver.findElement(webdriver.By.css("#edit_subscription_cart > div.onboarding-button-group > button:nth-child(2)"))
                noAllergies.click();
            })

        // wait for plan page to load
            .then(function(){
                return driver.wait(webdriver.until.elementLocated(webdriver.By.css("#subscription-plan-selection-view")),2000)
            })

        // select 12 month plan
            .then(function(){
               // List<WebElement> methods = driver.findElements(By.cssSelector("input[name='shipping_method']"));
                //    methods.get(0).click(); // clicks the first element, Standard Shipping
                var twelveMobi = driver.findElement(webdriver.By.css('div[data-billing-cycle="monthly-12"]'))
                twelveMobi.click();
            })

        // wait for extra toy page to load
            .then(function(){
                return driver.wait(webdriver.until.elementLocated(webdriver.By.css("#subscription-extra-toy-selection")),2000)
            })

        // select no extra toy
            .then(function(){
                var noExtraToy = driver.findElement(webdriver.By.css("button[value='no']"))
                noExtraToy.click();
            })

        // wait for checkout page to load
            .then(function(){
                return driver.wait(webdriver.until.elementLocated(webdriver.By.css("#subscription_express_checkout_address_attributes_first_name")),2000)
            })
        
        // enter first name
            .then(function(){
                var firstName = driver.findElement(webdriver.By.css("#subscription_express_checkout_address_attributes_first_name"))
                firstName.click();
                firstName.sendKeys('Jackie').then(function(){
                    firstName.sendKeys(webdriver.Key.TAB)
                });
            })

    
            
            

        .then(done);

    }); //closes the it block


    // The after block is run after all "it" blocks finish.
    // If driver.quit() isn't called, the session will remain open until the default 10 minute timeout is reached.
    after(function quitWebdriver(done){
        //driver.quit()
        //.then(done);
    });
});
