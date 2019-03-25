'use strict';


window.WappBot = {
  configWappBot: {
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
  }
}



/* eslint-disable */
/**
 * This script contains WAPI functions that need to be run in the context of the webpage
 */

/**
 * Auto discovery the webpack object references of instances that contains all functions used by the WAPI
 * functions and creates the Store object.
 */
if (!window['webpackJsonp']) {
  window.webpackJsonp = webpackJsonp;
}

if (!window.Store) {
  (function () {
    function getStore(modules) {
      let foundCount = 0;
      let neededObjects = [
        { id: "Store", conditions: (module) => (module.Chat && module.Msg) ? module : null },
        { id: "FromData", conditions: (module) => (module.createFromData) ? module : null },
        { id: "RawMedia", conditions: (module) => (module.prepRawMedia) ? module : null },
        { id: "UserConstructor", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null }
      ];
      for (let idx in modules) {
        if (typeof modules[idx] === 'object' && modules[idx] !== null) {
          let first = Object.values(modules[idx])[0];
          if (typeof first === 'object' && first.exports) {
            for (let idx2 in modules[idx]) {
              let module = modules(idx2);
              if (!module) {
                continue;
              }

              neededObjects.forEach(needObj => {
                if (!needObj.conditions || needObj.foundedModule) return;
                let neededModule = needObj.conditions(module);
                if (neededModule !== null) {
                  foundCount++;
                  needObj.foundedModule = neededModule;
                }
              });

              if (foundCount == neededObjects.length) {
                break;
              }
            }

            let neededStore = neededObjects.find(needObj => needObj.id === 'Store');
            window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
            neededObjects.splice(neededObjects.indexOf(neededStore), 1);
            neededObjects.forEach(needObj => {
              if (needObj.foundedModule) {
                window.Store[needObj.id] = needObj.foundedModule;
              }
            });

            return window.Store;
          }
        }
      }
    }

    webpackJsonp([], { parasite: (x, y, z) => getStore(z) }, 'parasite');
  })();
}



window.WAPI = {
  lastRead: {}
};

window.WAPI._serializeRawObj = obj => {
  if (obj) {
    return obj.toJSON();
  }
  return {};
};

/**
 * Serializes a chat object
 *
 * @param rawChat Chat object
 * @returns {{}}
 */

window.WAPI._serializeChatObj = obj => {
  if (obj == undefined) {
    return null;
  }

  return Object.assign(window.WAPI._serializeRawObj(obj), {
    kind: obj.kind,
    isGroup: obj.isGroup,
    contact: obj['contact'] ? window.WAPI._serializeContactObj(obj['contact']) : null,
    groupMetadata: obj['groupMetadata'] ? window.WAPI._serializeRawObj(obj['groupMetadata']) : null,
    presence: obj['presence'] ? window.WAPI._serializeRawObj(obj['presence']) : null,
    msgs: null
  });
};

window.WAPI._serializeContactObj = obj => {
  if (obj == undefined) {
    return null;
  }

  return Object.assign(window.WAPI._serializeRawObj(obj), {
    formattedName: obj.formattedName,
    isHighLevelVerified: obj.isHighLevelVerified,
    isMe: obj.isMe,
    isMyContact: obj.isMyContact,
    isPSA: obj.isPSA,
    isUser: obj.isUser,
    isVerified: obj.isVerified,
    isWAContact: obj.isWAContact,
    profilePicThumbObj: obj.profilePicThumb ? window.WAPI._serializeProfilePicThumb(obj.profilePicThumb) : {},
    statusMute: obj.statusMute,
    msgs: null
  });
};

window.WAPI._serializeMessageObj = obj => {
  if (obj == undefined) {
    return null;
  }

  return Object.assign(window.WAPI._serializeRawObj(obj), {
    id: obj.id._serialized,
    sender: obj['senderObj'] ? window.WAPI._serializeContactObj(obj['senderObj']) : null,
    timestamp: obj['t'],
    content: obj['body'],
    isGroupMsg: obj.isGroupMsg,
    isLink: obj.isLink,
    isMMS: obj.isMMS,
    isMedia: obj.isMedia,
    isNotification: obj.isNotification,
    isPSA: obj.isPSA,
    type: obj.type,
    chat: window.WAPI._serializeChatObj(obj['chat']),
    chatId: obj.id.remote,
    quotedMsgObj: window.WAPI._serializeMessageObj(obj['_quotedMsgObj']),
    mediaData: window.WAPI._serializeRawObj(obj['mediaData'])
  });
};

window.WAPI._serializeNumberStatusObj = obj => {
  if (obj == undefined) {
    return null;
  }

  return Object.assign(
    {},
    {
      id: obj.jid,
      status: obj.status,
      isBusiness: obj.biz === true,
      canReceiveMessage: obj.status === 200
    }
  );
};

window.WAPI._serializeProfilePicThumb = obj => {
  if (obj == undefined) {
    return null;
  }

  return Object.assign(
    {},
    {
      eurl: obj.eurl,
      id: obj.id,
      img: obj.img,
      imgFull: obj.imgFull,
      raw: obj.raw,
      tag: obj.tag
    }
  );
};

/**
 * Fetches all chat IDs from store
 *
 * @param done Optional callback function for async execution
 * @returns {Array|*} List of chat id's
 */
window.WAPI.getAllChatIds = function (done) {
  const chatIds = window.Store.Chat.map(chat => chat.id._serialized || chat.id);

  if (done !== undefined) done(chatIds);
  return chatIds;
};

window.WAPI.processMessageObj = function (messageObj, includeMe, includeNotifications) {
  if (messageObj.isNotification) {
    if (includeNotifications) return window.WAPI._serializeMessageObj(messageObj);
    else return;
    // System message
    // (i.e. "Messages you send to this chat and calls are now secured with end-to-end encryption...")
  } else if (messageObj.id.fromMe === false || includeMe) {
    return window.WAPI._serializeMessageObj(messageObj);
  }
  return;
};

window.WAPI.sendImage = async function (image, chatid, filename, caption) {
  let id = chatid;
  if (!window.WAPI.getAllChatIds().find(chat => chat == chatid)) id = new window.Store.UserConstructor(chatid);

  try {
    return Store.Chat.find(id).then(async chat => {
      var mediaBlob = await window.WAPI.base64ImageToFile(image, filename);
      chat.markComposing();

      var temp = window.Store.FromData.createFromData(mediaBlob, mediaBlob.type);
      var rawMedia = window.Store.RawMedia.prepRawMedia(temp, {});
      var textPortion = {
        caption: caption,
        mentionedJidList: []
      };
      rawMedia.sendToChat(chat, textPortion);

      return true;
    });
  } catch (error) {
    if (window.Store.Chat.length === 0) return false;

    firstChat = Store.Chat.models[0];
    var originalID = firstChat.id;
    firstChat.id = typeof originalID === 'string' ? id : new window.Store.UserConstructor(id);
    var mediaBlob = await window.WAPI.base64ImageToFile(image, filename);
    chat.markComposing();

    var temp = window.Store.FromData.createFromData(mediaBlob, mediaBlob.type);
    var rawMedia = window.Store.RawMedia.prepRawMedia(temp, {});
    var textPortion = {
      caption: caption,
      mentionedJidList: [],
      quotedMsg: null
    };
    rawMedia.sendToChat(firstChat, textPortion);
    firstChat.id = originalID;
    return true;
  }
};

window.WAPI.base64ImageToFile = function (image, filename) {
  return new Promise(async resolve => {
    if (!image.includes("base64")) {
      image = await window.WappBot.toDataURL('https://cors-anywhere.herokuapp.com/' + image); // convert url in base64
    }
    var arr = image.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    resolve(new File([u8arr], filename, { type: mime }));
  });
};

window.WAPI.sendMessage = function (idChat, message) {
  let id = idChat;
  if (!window.WAPI.getAllChatIds().find(chat => chat == idChat)) id = new window.Store.UserConstructor(idChat);

  try {
    // create new chat
    return Store.Chat.find(id).then(chat => {
      chat.sendMessage(message);
      return true;
    });
  } catch (e) {
    if (window.Store.Chat.length === 0) return false;

    firstChat = Store.Chat.models[0];
    var originalID = firstChat.id;
    firstChat.id = typeof originalID === 'string' ? id : new window.Store.UserConstructor(id);
    firstChat.sendMessage(message);
    firstChat.id = originalID;
    return true;
  }
};

window.WappBot.toDataURL = (url) => {
  return new Promise((resolve) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
}



window.WappBot.sendByAPIWappBot = (newMessage, chatId) => {
  fetch(window.WappBot.configWappBot.uriApi, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messageText: newMessage })
  }).then(function (response) {
    response.json().then(post => window.WAPI.sendMessage(chatId, post.messageResponse));
  })
}


window.WappBot.messageIncludeKey = (message, options) => {
  for (let i = 0; i < options.length; i++) {
    if (message.toUpperCase().includes(options[i].toUpperCase()))
      return window.WappBot.configWappBot.messageOption[options[i]];
  }
  return false;
}

window.WappBot.prepareMessageToSend = (chatId, options) => {
  let message = "";
  if (window.WappBot.configWappBot.ignoreChat.indexOf(chatId) > -1) {
    message = `${window.WappBot.configWappBot.messageIncorrect}`;
  } else {
    message = `${window.WappBot.configWappBot.messageInitial.text}`;
    window.WappBot.configWappBot.ignoreChat.push(chatId);
  }
  for (let i = 0; i < options.length; i++)
    message += `\t ${options[i]} \n`;

  return message;
}

window.WappBot.sendByLocalSetting = (newMessage, chatId) => {
  const options = Object.keys(window.WappBot.configWappBot.messageOption);
  const messageIncludeKey = window.WappBot.messageIncludeKey(newMessage, options);
  if (!messageIncludeKey) {
    const message = window.WappBot.prepareMessageToSend(chatId, options);
    if (!window.WappBot.configWappBot.messageInitial.image)
      window.WAPI.sendMessage(chatId, message);
    else
      window.WAPI.sendImage(window.WappBot.configWappBot.messageInitial.image, chatId, "image", message);
  } else {
    if (!messageIncludeKey.image)
      window.WAPI.sendMessage(chatId, messageIncludeKey.text);
    else
      window.WAPI.sendImage(messageIncludeKey.image, chatId, 'image', messageIncludeKey.text);
  }

}


/**
 * New messages observable functions.
 */
window.WAPI._newMessagesQueue = [];
window.WAPI._newMessagesBuffer =
  sessionStorage.getItem('saved_msgs') != null ? JSON.parse(sessionStorage.getItem('saved_msgs')) : [];
window.WAPI._newMessagesDebouncer = null;
window.WAPI._newMessagesCallbacks = [];
window.Store.Msg.off('add');
sessionStorage.removeItem('saved_msgs');

window.WAPI._newMessagesListener = window.Store.Msg.on('add', newMessage => {
  if (newMessage && newMessage.isNewMsg && !newMessage.isSentByMe) {
    let message = window.WAPI.processMessageObj(newMessage, false, false);
    if (message) {
      if (window.WappBot.configWappBot.useApi)
        window.WappBot.sendByAPIWappBot(message.body, message.chatId._serialized);
      else
        window.WappBot.sendByLocalSetting(message.body, message.chatId._serialized);
    }
  }
});

window.WAPI._unloadInform = event => {
  // Save in the buffer the ungot unreaded messages
  window.WAPI._newMessagesBuffer.forEach(message => {
    Object.keys(message).forEach(key => (message[key] === undefined ? delete message[key] : ''));
  });
  sessionStorage.setItem('saved_msgs', JSON.stringify(window.WAPI._newMessagesBuffer));

  // Inform callbacks that the page will be reloaded.
  window.WAPI._newMessagesCallbacks.forEach(function (callbackObj) {
    if (callbackObj.callback !== undefined) {
      callbackObj.callback({ status: -1, message: 'page will be reloaded, wait and register callback again.' });
    }
  });
};

window.addEventListener('unload', window.WAPI._unloadInform, false);
window.addEventListener('beforeunload', window.WAPI._unloadInform, false);
window.addEventListener('pageunload', window.WAPI._unloadInform, false);