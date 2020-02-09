var pollInterval = 5000;
var timerId;
var isCSPDisabled = false;

function injectVariables(variables, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    console.log("[Info]: Injecting variables");
    for (var i = 0; i < variables.length; i++) {
        script.textContent =
            "var " +
            variables[i].name +
            " = " +
            JSON.stringify(variables[i].value) +
            ";";
    }
    node.appendChild(script);
}
function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", file_path);
    node.appendChild(script);
}

function injectCode(code, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.textContent = code;
    node.appendChild(script);
}


function start() {
    try {
        console.log('[Info]: waiting for whatsapp start');
        var elementOfInterest = document.getElementsByClassName('_3RWII');
        if (elementOfInterest.length > 0) {
            isCSPDisabled = !isCSPDisabled;

            chrome.storage.local.get(['WappBot'], function (result) {
                injectCode(`window["WappBot"] = ${JSON.stringify(result.WappBot)}`, 'body');
            });

            chrome.runtime.sendMessage(isCSPDisabled);

            injectVariables([{ name: "extensionID", value: chrome.runtime.id }], "body");
            injectScript(chrome.extension.getURL("script/wappbot.js"), "body");
        }
        else timerId = window.setTimeout(start, pollInterval);
    } catch (error) {
        console.error(error);
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "media_url") {
        var x = new XMLHttpRequest();
        x.open("GET", message.url, true);
        x.responseType = "blob";
        x.onload = function () {
            if (this.status == 200) {
                var myurl = window.URL.createObjectURL(this.response);
                sendResponse({
                    type: "media_success",
                    url: myurl
                });
            } else {
                sendResponse({
                    type: "media_fail"
                });
            }
        };
        x.send();
    }
    return true;
});

start();