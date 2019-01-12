'use strict';

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
        { id: "Wap", conditions: (module) => (module.createGroup) ? module : null },
        { id: "MediaCollection", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processFiles !== undefined) ? module.default : null },
        { id: "WapDelete", conditions: (module) => (module.sendConversationDelete && module.sendConversationDelete.length == 2) ? module : null },
        { id: "Conn", conditions: (module) => (module.default && module.default.ref && module.default.refTTL) ? module.default : null },
        { id: "WapQuery", conditions: (module) => (module.queryExist) ? module : null },
        { id: "ProtoConstructor", conditions: (module) => (module.prototype && module.prototype.constructor.toString().indexOf('binaryProtocol deprecated version') >= 0) ? module : null },
        { id: "UserConstructor", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null },
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
 * Fetches all chat objects from store
 *
 * @param done Optional callback function for async execution
 * @returns {Array|*} List of chats
 */
window.WAPI.getAllChats = function (done) {
  const chats = window.Store.Chat.map(chat => window.WAPI._serializeChatObj(chat));

  if (done !== undefined) done(chats);
  return chats;
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

/**
 * Fetches chat object from store by ID
 *
 * @param id ID of chat
 * @param done Optional callback function for async execution
 * @returns {T|*} Chat object
 */
window.WAPI.getChat = function (id, done) {
  id = typeof id == 'string' ? id : id._serialized;
  const found = window.Store.Chat.get(id);
  if (done !== undefined) done(found);
  return found;
};

window.WAPI.getChatByName = function (name, done) {
  const found = window.Store.Chat.find(chat => chat.name === name);
  if (done !== undefined) done(found);
  return found;
};

window.WAPI.getChatById = function (id, done) {
  let found = window.WAPI.getChat(id);
  if (found) {
    found = window.WAPI._serializeChatObj(found);
  } else {
    found = false;
  }

  if (done !== undefined) done(found);
  return found;
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

window.WAPI.getAllMessagesInChat = function (id, includeMe, includeNotifications, done) {
  const chat = window.WAPI.getChat(id);
  let output = [];
  const messages = chat.msgs.models;
  for (const i in messages) {
    if (i === 'remove') {
      continue;
    }
    const messageObj = messages[i];

    let message = window.WAPI.processMessageObj(messageObj, includeMe, includeNotifications);
    if (message) output.push(message);
  }
  if (done !== undefined) done(output);
  return output;
};

window.WAPI.getAllMessageIdsInChat = function (id, includeMe, includeNotifications, done) {
  const chat = window.WAPI.getChat(id);
  let output = [];
  const messages = chat.msgs.models;
  for (const i in messages) {
    if (i === 'remove' || (!includeMe && messages[i].isMe) || (!includeNotifications && messages[i].isNotification)) {
      continue;
    }
    output.push(messages[i].id._serialized);
  }
  if (done !== undefined) done(output);
  return output;
};

window.WAPI.getLastMessageIdInChat = function (idChat, done) {
  const chat = window.WAPI.getChat(idChat);
  const idMessage = chat.msgs.models.pop().id._serialized;
  if (done !== undefined) done(idMessage);
  return idMessage;
}

/**
 * Get the last message ID
 * @param {bool} fromMe - when 'true' it will get the latest message sent by you
 */
window.WAPI.lastMessage = function (fromMe = true, done) {
  if (fromMe) {
    var validMessages = Store.Msg.models
      .filter(msg => msg.isSentByMe);
  } else {
    var validMessages = Store.Msg.models
  }
  // validMessages excludes notifications
  if (typeof validMessages !== 'undefined' && validMessages.length > 0) {
    var lastMsg = validMessages[validMessages.length - 1];
    var message = window.WAPI._serializeMessageObj(lastMsg);
    if (done !== undefined) done(message);
    return message;
  } else {
    if (done !== undefined) done(false);
    return false;
  }
}

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
      var url = "http://localhost:3000/conversation";
      fetch(url, {
        method: "POST",
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: message.body })
      }).then(function (response) {
        response.json().then(post => window.WAPI.sendMessage(message.chatId._serialized, post.output.generic[0].text));
      })
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