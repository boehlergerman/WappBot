// Pure JS:
"use strict";

var choice = [];
var choiceNumber = 0;
var globalTag;

document.addEventListener('DOMContentLoaded', function () {
    loadTags();

    document.getElementById("chkApi").addEventListener("click", disable);
    document.getElementById("confirm").addEventListener("click", confirm);
    document.getElementById("choice").addEventListener("click", addChoice);
});

function addChoice() {
    const message = document.getElementById("txtMessage").value;
    const imageUrl = document.getElementById("txtImage").value;

    let element = {
        text: message,
        image: imageUrl === "" ? null : imageUrl
    }

    for (const iterator of ["Initial", "Incorrect", `@Choice${choiceNumber + 1}`]) {
        if (!choice[iterator]) {

            switch (iterator) {
                case "Initial":
                    element.text += ' \n';
                    var tagInput1 = new TagsInput({
                        selector: 'tag-input1',
                        duplicate: false,
                        max: 10
                    });
                    globalTag = tagInput1.addData([iterator])
                    break;
                case "Incorrect":
                    globalTag.addTag(iterator);
                    break;
                default:
                    globalTag.addTag(iterator);
                    element.text = ' \t' + element.text;
                    break;
            }
            choice[iterator] = element;
            break;
        }
    }
}

function disable() {
    const check = document.getElementById('chkApi').checked
    document.getElementById("txtMessage").disabled = check;
    document.getElementById("txtImage").disabled = check;
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

    if (useApi) return;

    for (const key in choice) {
        if (choice.hasOwnProperty(key)) {
            const element = choice[key];
            switch (key) {
                case "Initial":
                    window.WappBot.configWappBot["messageInitial"] = element;
                    break;
                case "Incorrect":
                    window.WappBot.configWappBot["messageIncorrect"] = element.text;
                    break;
                default:
                    if (!window.WappBot.configWappBot["messageOption"]) window.WappBot.configWappBot["messageOption"] = {};
                    window.WappBot.configWappBot["messageOption"][key] = element;
                    break;
            }
        }
    }

    chrome.storage.local.set({ WappBot: window.WappBot }, function () {
        console.log('Value is set to ' + window.WappBot);
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
        this.arr.splice(i, 1);
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
