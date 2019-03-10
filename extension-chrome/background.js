var isCSPDisabled = false;
var tabid;
var filter = {
  urls: ["*://*/*"],
  types: ["main_frame", "sub_frame"]
};

var onHeadersReceived = function (details) {
  for (var i = 0; i < details.responseHeaders.length; i++) {
    if ('content-security-policy' === details.responseHeaders[i].name.toLowerCase()) {
      details.responseHeaders[i].value = '';
    }
  }

  return {
    responseHeaders: details.responseHeaders
  };
};

function updateUI() {
  var iconName = isCSPDisabled ? 'on' : 'off';
  var title = isCSPDisabled ? 'disabled' : 'enabled';

  chrome.browserAction.setIcon({ path: "images/icon32-" + iconName + ".png" });
  chrome.browserAction.setTitle({ title: 'Content-Security-Policy headers are ' + title });
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    isCSPDisabled = request;
    tabid = sender.tab.id;
    chrome.browsingData.remove({}, { "serviceWorkers": true }, function () { });

    updateUI();

  }
);

chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, filter, ["blocking", "responseHeaders"]);

chrome.tabs.onRemoved.addListener(function (tabCloseid, removed) {
  if (tabid === tabCloseid) {
    isCSPDisabled = false;
    updateUI();
  }
})

chrome.windows.onRemoved.addListener(function (windowid) {
  isCSPDisabled = false;
  updateUI();
})

chrome.tabs.onUpdated.addListener(function (tabCloseid, changeInfo, tab) {
  if (tabid === tabCloseid) {
    isCSPDisabled = false;
    updateUI();
  }
});