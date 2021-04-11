"use strict";

const PORT_NAME = "who_is_reviewing";

const EVENT_TYPE_GET = "GET";
const EVENT_TYPE_STATUS_CHANGE = "STATUS_CHANGE";

const STATUS_OK = "OK";
const STATUS_ERROR = "ERROR";

const CONTAINER_TO_APPEND_TO = ".js-merge-message-container";
const CONTAINER_ELEM_CLASS = "who-is-reviewing-user-list";

const extensionWindow = (function () {
  if (typeof chrome !== undefined) {
    return chrome;
  } else if (typeof browser !== undefined) {
    return browser;
  } else if (typeof msBrowser !== undefined) {
    return msBrowser;
  }
})();

// Get login of user
let userLogin = "";
const metas = document.getElementsByTagName("meta");
for (let i = 0; i < metas.length; i++) {
  if (metas[i].getAttribute("name") === "user-login") {
    userLogin = metas[i].getAttribute("content");
  }
}

const addReviewerList = () => {
  const url = document.URL;
  const splitUrl = url.split("/").reverse();
  if (splitUrl[1] === "pull") {
    // Execute logic only for PR pages.
    const getReqParams = {
      endPoint: config.restEndPoint,
      project: splitUrl[2],
      prId: splitUrl[0],
    };

    // Connect to service worker to make API calls.
    var port = extensionWindow.runtime.connect({ name: PORT_NAME });
    port.postMessage({ ...getReqParams, eventType: EVENT_TYPE_GET });
    port.onMessage.addListener(function (msg) {
      if (msg.status === STATUS_OK) {
        const { userList } = msg;
        let userListText = "";
        for (let i = 0; i < userList.length; i++) {
          userListText += ` ${userList[i]} `;
        }
        const userListTextMessage = config.msg.userList.replace(
          "{USER_LIST}",
          userListText
        );

        // Remove any existing elements
        const existingUserListElem = document.querySelectorAll(
          `.${CONTAINER_ELEM_CLASS}`
        );
        if (existingUserListElem.length) {
          existingUserListElem[0].remove();
        }

        const containerElem = document.querySelectorAll(CONTAINER_TO_APPEND_TO);
        if (containerElem.length === 1) {
          const userListContainerElem = document.createElement("div");
          userListContainerElem.classList.add(CONTAINER_ELEM_CLASS);
          userListContainerElem.prepend(userListTextMessage);
          // Append the element to DOM.
          containerElem[0].prepend(userListContainerElem);
        }
      }
    });
  }
};

addReviewerList();

extensionWindow.runtime.onMessage.addListener(async (eventDetails) => {
  // Update list when current user toggles status in Popup
  if (eventDetails.eventType === EVENT_TYPE_STATUS_CHANGE) {
    addReviewerList();
  }
});
