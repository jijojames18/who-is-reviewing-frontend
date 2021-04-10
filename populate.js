"use strict";

const PORT_NAME = "who_is_reviewing";

const EVENT_TYPE_GET = "GET";

const STATUS_OK = "OK";
const STATUS_ERROR = "ERROR";

const CONTAINER_TO_APPEND_TO = ".js-merge-message-container";
const CONTAINER_ELEM_CLASS = "who-is-reviewing-user-list";

const addReviewerList = () => {
  const url = document.URL;
  const splitUrl = url.split("/").reverse();
  if (splitUrl[1] === "pull") {
    const getReqParams = {
      endPoint: config.restEndPoint,
      project: splitUrl[2],
      prId: splitUrl[0],
    };
    var port = chrome.runtime.connect({ name: PORT_NAME });
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
        const existingUserListElem = document.querySelectorAll(
          `.${CONTAINER_ELEM_CLASS}`
        );
        // Remove any existing elements
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
