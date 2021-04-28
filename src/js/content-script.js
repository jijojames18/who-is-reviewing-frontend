// Content script
import config from "@/config";
import {
  PORT_NAME,
  EVENT_TYPE_GET,
  EVENT_TYPE_POST,
  EVENT_TYPE_STATUS_CHANGE,
  STATUS_OK,
  STORAGE_KEY,
} from "@js/common/constants";
import extensionWindow from "@js/common/context";
import { getPRPath, getUserLogin } from "@js/common/functions";

const path = getPRPath(document.URL);

class ContentScript {
  constructor(userLogin, path, config) {
    this.userLogin = userLogin;
    this.path = path;
    this.config = config;
  }

  updateStorage(params) {
    extensionWindow.storage.sync.get([STORAGE_KEY], (result) => {
      let store = result[STORAGE_KEY] || {};
      store = this.removeOldStoreData(store);
      store[this.path] = params;
      extensionWindow.storage.sync.set({
        [STORAGE_KEY]: store,
      });
    });
  }

  removeOldStoreData(data) {
    let newData = {};
    const timestampLimit = new Date().getTime() - 86400 * 1000; // Remove data older than 1 day
    for (let path in data) {
      if (data[path].timestamp > timestampLimit) {
        newData[path] = data[path];
      }
    }

    return newData;
  }

  drawReviewerList() {
    const CONTAINER_TO_APPEND_TO = ".js-merge-message-container";
    const CONTAINER_ELEM_CLASS = "who-is-reviewing-user-list";

    // Remove any existing elements
    const existingUserListElem = document.querySelectorAll(
      `.${CONTAINER_ELEM_CLASS}`
    );
    for (let i = 0; i < existingUserListElem.length; i++) {
      existingUserListElem[i].remove();
    }

    let userListText = "";
    for (let i = 0; i < this.userList.length; i++) {
      userListText += ` ${this.userList[i]} `;
    }
    const userListTextMessage = this.config.msg.userList.replace(
      "{USER_LIST}",
      userListText
    );

    const containerElem = document.querySelectorAll(CONTAINER_TO_APPEND_TO);
    if (containerElem.length === 1) {
      const userListContainerElem = document.createElement("div");
      userListContainerElem.classList.add(CONTAINER_ELEM_CLASS);
      userListContainerElem.prepend(userListTextMessage);
      // Append the element to DOM.
      containerElem[0].prepend(userListContainerElem);
    }
  }

  callServiceWorker(params) {
    var port = extensionWindow.runtime.connect({ name: PORT_NAME });
    port.postMessage({ path: this.path, ...params });
    port.onMessage.addListener(
      function (msg) {
        this.amIReviewing = false;
        if (msg.status === STATUS_OK) {
          this.userList = msg.userList;
          this.amIReviewing = this.userList.indexOf(this.userLogin) >= 0;
          this.drawReviewerList();
        } else {
          this.drawReviewerList([]);
        }
        this.updateStorage({
          status: "OPEN",
          amIReviewing: this.amIReviewing,
          timestamp: new Date().getTime(),
        });
      }.bind(this)
    );
  }
}

// Execute logic only for PR pages.
if (path) {
  // Get login of user
  const headerElement = document.getElementById("partial-discussion-header");
  // Enable only for open PR
  if (
    headerElement &&
    headerElement.querySelectorAll(".State--open").length > 0
  ) {
    const userLogin = getUserLogin(document.getElementsByTagName("meta"));
    const contentScript = new ContentScript(userLogin, path, config);
    contentScript.callServiceWorker({
      eventType: EVENT_TYPE_GET,
    });

    extensionWindow.runtime.onMessage.addListener(async (event) => {
      // Update list when current user toggles status in Popup
      if (event.eventType === EVENT_TYPE_STATUS_CHANGE) {
        contentScript.callServiceWorker({
          eventType: EVENT_TYPE_POST,
          userId: userLogin,
          status: event.status,
        });
      }
    });
  }
}
