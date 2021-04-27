// Content script
import config from "@/config";
import {
  PORT_NAME,
  EVENT_TYPE_GET,
  EVENT_TYPE_POST,
  EVENT_TYPE_STATUS_CHANGE,
  STATUS_OK,
} from "@js/common/constants";
import extensionWindow from "@js/common/context";

const CONTAINER_TO_APPEND_TO = ".js-merge-message-container";
const CONTAINER_ELEM_CLASS = "who-is-reviewing-user-list";

const url = document.URL;
const splitUrl = url.split("/").reverse();

// Execute logic only for PR pages.
if (splitUrl[1] === "pull") {
  // Get login of user
  let userLogin = "";
  const metas = document.getElementsByTagName("meta");
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("name") === "user-login") {
      userLogin = metas[i].getAttribute("content");
    }
  }

  const requestParams = {
    project: splitUrl[2],
    prId: splitUrl[0],
  };

  const drawReviewerList = (msg) => {
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
  };

  const callServiceWorker = (params) => {
    var port = extensionWindow.runtime.connect({ name: PORT_NAME });
    port.postMessage(params);
    port.onMessage.addListener(function (msg) {
      let amIReviewing = false;
      const key = `${splitUrl[2]}/${splitUrl[0]}`;
      if (msg.status === STATUS_OK) {
        drawReviewerList(msg);
        amIReviewing = msg.userList.indexOf(userLogin) >= 0;
      } else {
        drawReviewerList([]);
      }
      extensionWindow.storage.sync.set({ [key]: amIReviewing });
    });
  };

  callServiceWorker({
    ...requestParams,
    eventType: EVENT_TYPE_GET,
  });

  extensionWindow.runtime.onMessage.addListener(async (event) => {
    // Update list when current user toggles status in Popup
    if (event.eventType === EVENT_TYPE_STATUS_CHANGE) {
      callServiceWorker({
        ...requestParams,
        eventType: EVENT_TYPE_POST,
        userId: userLogin,
        status: event.status,
      });
    }
  });
}
