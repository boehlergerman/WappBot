// Pure JS:
"use strict";

var choice = {};
var globalTag;

document.addEventListener('DOMContentLoaded', function () {
    loadTags();
    restoreData();

    document.getElementById("chkApi").addEventListener("click", () => {
        disable();
        saveData();
    });
    document.getElementById("confirm").addEventListener("click", confirm);
    document.getElementById("formChoice").addEventListener("submit", (e) => {
        e.preventDefault();
        document.getElementById("choice").removeAttribute("tooltip");

        const message = document.getElementById("txtMessage");
        const imageUrl = document.getElementById("txtImage");
        const choiceKey = document.getElementById("txtChoiceName");



        for (const iterator of ["Initial", "Incorrect", "Choice1", "Choice2", "Choice3", "Choice4", "Choice5", "Choice6", "Choice7", "Choice8"]) {
            if (!choice[iterator]) {
                let element = {
                    text: message.value,
                    image: imageUrl.value === "" ? null : imageUrl.value,
                    keyName: choiceKey.value === "" ? iterator : choiceKey.value
                }

                if (!globalTag) {
                    var tagInput1 = new TagsInput({
                        selector: 'tag-input1',
                        duplicate: false,
                        max: 10
                    });
                    globalTag = tagInput1.addData([iterator])
                } else globalTag.addTag(iterator);

                if (iterator.includes("Choice"))
                    element.text = ' \t' + element.text;
                else element.text += ' \n';

                choice[iterator] = element;
                break;
            }
            else {
                if (choice[iterator].keyName.toUpperCase() === choiceKey.value.toUpperCase()) {
                    document.getElementById("choice").setAttribute("tooltip", 'The choice name already exists');
                    break;
                }
            }
        }

        choiceSetting();

        saveData();

        message.value = "";
        imageUrl.value = "";
        choiceKey.value = "";
    });
});


function choiceSetting() {
    if (Object.keys(choice).includes("Initial") && Object.keys(choice).includes("Incorrect")) {
        document.getElementById("divChoiceName").style.display = 'block';
        document.getElementById("txtChoiceName").required = true;
    } else {
        document.getElementById("txtChoiceName").value = "";
        document.getElementById("divChoiceName").style.display = 'none';
        document.getElementById("txtChoiceName").required = false;
    }
}

function disable() {
    const check = document.getElementById('chkApi').checked
    document.getElementById("txtMessage").disabled = check;
    document.getElementById("txtImage").disabled = check;
    document.getElementById("choice").disabled = check;
    document.getElementById("txtChoiceName").disabled = check;
}

function confirm() {
    const useApi = document.getElementById('chkApi').checked

    window.WappBot = {
        configWappBot: {
            useApi: useApi,
            uriApi: "https://wapp-bot.herokuapp.com/message",
            ignoreChat: []
        }
    }

    if (useApi) {
        chrome.storage.local.set({ WappBot: window.WappBot }, function () {
            console.log('Value is set to ' + window.WappBot);
        });
        document.getElementById("confirm").setAttribute("tooltip", 'API configuration accepted');
        return;
    }

    if (Object.keys(choice).length <= 2 || !Object.keys(choice).includes("Initial") || !Object.keys(choice).includes("Incorrect")) {
        document.getElementById("confirm").setAttribute("tooltip", 'Must contain at least 3 options (initial, incorrect and one choice)');
        return;
    }

    for (const key in choice) {
        if (choice.hasOwnProperty(key)) {
            const element = Object.assign({}, choice[key]);
            switch (key) {
                case "Initial":
                    delete element["keyName"];
                    window.WappBot.configWappBot["messageInitial"] = element;
                    break;
                case "Incorrect":
                    window.WappBot.configWappBot["messageIncorrect"] = element.text;
                    break;
                default:
                    if (!window.WappBot.configWappBot["messageOption"]) window.WappBot.configWappBot["messageOption"] = {};
                    const keyName = element.keyName; delete element["keyName"];
                    window.WappBot.configWappBot["messageOption"][keyName] = element;
                    break;
            }
        }
    }
    chrome.storage.local.set({ WappBot: window.WappBot }, function () {
        console.log('Value is set to ' + window.WappBot);
    });

    document.getElementById("confirm").setAttribute("tooltip", 'Successfully loaded configuration');
}

// Util data store

function saveData() {
    chrome.storage.local.set({ StorePopup: { "choice": choice, "useApi": document.getElementById('chkApi').checked } }, function () {
        console.log('Value is set to ' + JSON.stringify(choice));
    });
}

function restoreData() {
    chrome.storage.local.get(['StorePopup'], function (result) {
        if (!!result.StorePopup) {
            console.log(result);
            choice = result.StorePopup.choice;
            document.getElementById('chkApi').checked = result.StorePopup.useApi;
            disable();
            const keys = Object.keys(choice);
            if (keys.length > 0) {
                var tagInput1 = new TagsInput({
                    selector: 'tag-input1',
                    duplicate: false,
                    max: 10
                });
                globalTag = tagInput1.addData(keys);
                choiceSetting();
            }
        }
    });

}


// Tags


function loadTags() {
    var TagsInput = function TagsInput(opts) {
        this.options = Object.assign(TagsInput.defaults, opts);
        this.orignal_input = document.getElementById(opts.selector);
        this.arr = [];
        this.wrapper = document.createElement('div');
        // this.wrapper = document.getElementsByClassName("tags-input-wrapper")[0];
        this.input = document.createElement('input');
        buildUI(this);
        addEvents(this);
    };

    TagsInput.prototype.addTag = function (string) {
        if (this.anyErrors(string)) return;
        this.arr.push(string);
        var tagInput = this;
        var tag = document.createElement('span');
        tag.className = this.options.tagClass;
        tag.innerText = string;
        var closeIcon = document.createElement('a');
        closeIcon.innerHTML = '&times;';
        closeIcon.addEventListener('click', function (e) {
            e.preventDefault();
            var tag = this.parentNode;

            for (var i = 0; i < tagInput.wrapper.childNodes.length; i++) {
                if (tagInput.wrapper.childNodes[i] == tag) tagInput.deleteTag(tag, i);
            }
        });
        tag.appendChild(closeIcon);
        this.wrapper.insertBefore(tag, this.input);
        this.orignal_input.value = this.arr.join(',');
        return this;
    };

    TagsInput.prototype.deleteTag = function (tag, i) {
        tag.remove();
        const key = this.arr[i];
        delete choice[key];
        this.arr.splice(i, 1);
        choiceSetting();
        saveData();
        this.orignal_input.value = this.arr.join(',');
        return this;
    };

    TagsInput.prototype.anyErrors = function (string) {
        if (this.options.max != null && this.arr.length >= this.options.max) {
            console.log('max tags limit reached');
            return true;
        }

        if (!this.options.duplicate && this.arr.indexOf(string) != -1) {
            console.log('duplicate found " ' + string + ' " ');
            return true;
        }

        return false;
    };

    TagsInput.prototype.addData = function (array) {
        var plugin = this;
        array.forEach(function (string) {
            plugin.addTag(string);
        });
        return this;
    };

    TagsInput.prototype.getInputString = function () {
        return this.arr.join(',');
    }; // Private function to initialize the UI Elements


    function buildUI(tags) {
        tags.wrapper.append(tags.input);
        tags.wrapper.classList.add(tags.options.wrapperClass);
        // document.getElementById(tags.orignal_input).style.display = 'none';
        tags.orignal_input.style.display = 'none';
        tags.orignal_input.parentNode.insertBefore(tags.wrapper, tags.orignal_input);
    }

    function addEvents(tags) {
        tags.wrapper.addEventListener('click', function () {
            tags.input.focus();
        });
        tags.input.addEventListener('keydown', function (e) {
            var str = tags.input.value.trim();

            if (!!~[9, 13, 188].indexOf(e.keyCode)) {
                tags.input.value = "";
                if (str != "") tags.addTag(str);
            }
        });
    }

    TagsInput.defaults = {
        selector: '',
        wrapperClass: 'tags-input-wrapper',
        tagClass: 'tag',
        max: null,
        duplicate: false
    };
    window.TagsInput = TagsInput;
}