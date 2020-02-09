# WappBot

Experimental project, which allows to detect the instant in which a new message is received and to carry out an automatic answer, with the possibility of giving personalized options.
This project is based on an excellent application of an unofficial API for whatsapp, which is thanked below.
https://github.com/mukulhase/WebWhatsapp-Wrapper

The main objective is to present a simple implementation without the need for large installations.

## Getting Started

To start it is necessary to have a registered instance of whatsapp web, and then copy the code contained in the file WappBot.js (See the configuration section for more details, otherwise the code contains default settings).
Once copied and configured correctly, open your browser console <kbd>F12</kbd> and paste the code.

for more information go to the wiki - [WIKI](https://github.com/boehlergerman/WappBot/wiki)

### Prerequisites

you must have a valid whatsapp account and access to whatsapp web


### Settings

```sh
Default configuration:
 {
    useApi: false,
    uriApi: "https://wapp-bot.herokuapp.com/message",
    ignoreChat: [],
    messageInitial: {
      text: "Hello I'm WappBot send a reply \n",
      image: null
    },
    messageIncorrect: "Incorrect option entered, we remind you that the options are: \n",
    messageOption: {
      "@Date": {
        text: new Date().toLocaleDateString(),
        image: null
      },
      "@Christmas": {
        text: (() => {
          let myDate = new Date();
          let cmas = Date.parse("Dec 25, " + myDate.getFullYear())
          let today = Date.parse(myDate)

          let daysToChristmas = Math.round((cmas - today) / (1000 * 60 * 60 * 24))
          if (daysToChristmas == 0)
            return "Today is Christmas ... Merry Christmas!"
          if (daysToChristmas < 0)
            return "Christmas was " + -1 * (daysToChristmas) + " days ago.";
          if (daysToChristmas > 0)
            return "There are " + daysToChristmas + " days to Christmas!"
        })(),
        image: null
      }
  }
```
```sh
Options:
  useApi                   [Bool] [Default False], allows you to use an API for message processing,
                           see the DialogFlow-Nodejs-WappBot repository.
                           
  uriApi                   [String] URL of the api you wish to consult,
                            you can use the proposed API, it's free :)
                            [WappBot-API](https://github.com/boehlergerman/DialogFlow-Nodejs-WappBotAPI)
  
  ignoreChat               [Array] prevents repeated messages, preventing a "hello" from being sent again
                           when an incorrect option is entered
  
  messageInitial           [Object] configuration of the first message to be sent to the chat
    |                      that generated an incoming message
    |                  
    |-> text               [String | Self-Invoking Anonymous Function] Welcome text
    |
    |-> image              [String] [Default Null] [Support Base64 Full Format | URL IMAGE]
                            image to be sent together with the welcome text

  messageIncorrect         [String] reply message in case an incorrect option is entered

  messageOption            [Object] configuration of the response options that are enabled for the user
    |
    |
    |-> KeyOption          [String] identifier to be shown to the user, it is convenient to use a special
          |                 character at the beginning such as @ # $,
          |                 to avoid misinterpreting the user's message.
          |
          |-> text         [String | Self-Invoking Anonymous Function] 
          |                  Text to display when the user enters the option properly
          |
          |-> image        [String] [Default Null] [Support Base64 Full Format | URL IMAGE]
                            image to be sent together with the text of the desired option

```

## Important
URL use is limited by Content-Security-Policy

Whatsapp Web contains meta tag that avoids that from the context of the site are executed requests to the outside that are not contemplated in the header, for a security issue this header can only add more restriction and not remove it.

Therefore, the use of URLAPI or IMAGE configuration in URL format and not Base64 will lead to an error in the console when you receive an incoming message.
This problem can be solved by installing an extension in your browser that removes the security of CSP and thus be able to use the full potential of HTTPS and HTTP requests within the context of Whatsapp Web.

[Disable CSP Extension recommend](https://bit.ly/2FFEnkT)

Otherwise you should use applications such as NWJS or Electron that simulate a context above whatsapp web.

## Wappbot extension for google chrome

Wappbot also exists in extension format for google chrome that allows you to use without knowing javascript, *also add the functionality to disable CSP automatically*

> link to the chrome play store: [Play store](https://chrome.google.com/webstore/detail/wappbot/kfoipoajagcbedgamieppifonpbhnbkd)

> link to the wiki to know how to use it: [Wiki extension chrome](https://github.com/boehlergerman/WappBot/wiki/how-to-use-it-with-extension)

![_](https://camo.githubusercontent.com/0828200a8808e85d6eb7ebdc00f5782832bb6ebf/68747470733a2f2f692e6962622e636f2f3330625132314c2f57617070426f74312e706e67)


## Examples and results
 ##### starting using script in console

![ ](https://media.giphy.com/media/WpUY2bTxcC5XkCeo7w/giphy.gif)

##### starting using extension chrome, Choice Settings

[![_](https://i.ibb.co/XbBRNDW/2020-02-08-22-47-20-Screen-Recording-08-Feb-20-7-37-03-PM-wmv.png)](https://imgur.com/xtaK7hV)

##### starting using extension chrome, WappBot API with DialogFlow (Spanish)

![ ](https://media.giphy.com/media/gFb1rPzQ2UrIrvMB9b/giphy.gif)

```sh
    useApi: true,
    uriApi: "https://wapp-bot.herokuapp.com/message"
```

![ ](https://media.giphy.com/media/d563lgarun9cSispf3/giphy.gif)


##### results with image configuration, remember to disable CSP

```sh
    messageInitial: {
      text: "Hello I'm WappBot send a reply \n",
      image: "https://i.imgur.com/4ufAcMb.png"
    },
    messageIncorrect: "Incorrect option entered, we remind you that the options are: \n",
    messageOption: {
      "@Date": {
        text: new Date().toLocaleDateString(),
        image: null
      },
      "@Christmas": {
        text: "My text",
        image: "https://i.imgur.com/GJXbceA.jpg"
      }
    }
```
![ ](https://media.giphy.com/media/LoNnXqcxsvz22p64OS/giphy.gif)


## Authors

* **BoehlerGerman** - *Initial work* - [BoehlerGerman](https://github.com/boehlergerman)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Legal

This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by WhatsApp or any of its affiliates or subsidiaries. This is an independent and unofficial software. Use at your own risk.
