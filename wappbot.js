'use strict';


window.WappBot = {
  configWappBot: {
    useApi: false,
    uriApi: "https://wapp-bot.herokuapp.com/message",
    ignoreChat: [],
    messageInitial: {
      text: "Hello I'm WappBot send a reply \n",
      image: "data:image/png;base64,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"
    },
    messageIncorrect: "Incorrect option entered, we remind you that the options are: \n",
    messageOption: {
      "@Date": { 
        text: new Date().toLocaleDateString(),
        image: null
       },
      "@Christmas": {
        text : (() => {
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
        image: "data:image/png;base64,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"
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
        { id: "RawMedia", conditions: (module) => (module.prepRawMedia) ? module : null }
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

window.WAPI.sendImage = function (imgBase64, chatid, filename, caption) {
  let id = chatid;
  if (!window.WAPI.getAllChatIds().find(chat => chat == chatid)) id = new window.Store.UserConstructor(chatid);

  try {
    return Store.Chat.find(id).then(chat => {
      var mediaBlob = window.WAPI.base64ImageToFile(imgBase64, filename);
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
    var mediaBlob = window.WAPI.base64ImageToFile(imgBase64, filename);
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

window.WAPI.base64ImageToFile = function (b64Data, filename) {
  var arr = b64Data.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
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


window.WappBot.sendByAPIWappBot = (newMessage, chatId) => {
  var url = "https://wapp-bot.herokuapp.com/message";
  fetch(url, {
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
    if(!messageIncludeKey.image)
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