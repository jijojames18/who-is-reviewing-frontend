// Content script
import config from "@/config";
import {
  PORT_NAME,
  EVENT_TYPE_GET,
  EVENT_TYPE_POST,
  EVENT_TYPE_STATUS_CHANGE,
  STATUS_OK,
  STORAGE_KEY,
  DOM_ELEMENT_SELECTORS,
  EVENT_TYPE_USER_NAVIGATION,
} from "@js/common/constants";
import extensionWindow from "@js/common/context";
import { getPRPath, getUserLogin, getFilesUrl } from "@js/common/functions";

const path = getPRPath(document.URL);

class ContentScript {
  constructor(userLogin, path, config) {
    this.userLogin = userLogin;
    this.path = path;
    this.config = config;
    this.isLoading = false;
    this.userList = [];
  }

  getIsLoading() {
    return this.isLoading;
  }

  getDetailsFromStorage() {
    return extensionWindow.storage.sync.get([STORAGE_KEY], (result) => {
      let store = result[STORAGE_KEY] || {};
      return store[this.path];
    });
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

  // Disable link for 'Files' page if user is not reviewing
  toggleChangesPageVisibility() {
    const hrefUrl = getFilesUrl(document.URL);
    const elem = document.querySelectorAll(`a[href$='${hrefUrl}']`);
    for (let i = 0; i < elem.length; i++) {
      elem[i].style.pointerEvents = this.amIReviewing ? "" : "none";
    }
  }

  drawReviewerList() {
    // Remove any existing elements
    const existingUserListElem = document.querySelectorAll(
      `.${DOM_ELEMENT_SELECTORS.userList.containerElement}`
    );
    for (let i = 0; i < existingUserListElem.length; i++) {
      existingUserListElem[i].remove();
    }

    let userListTextMessage = "";
    if (this.userList.length === 0) {
      userListTextMessage = this.config.msg.noActiveReviewers;
    } else {
      let userListText = "";
      for (let i = 0; i < this.userList.length; i++) {
        userListText += ` ${this.userList[i]} `;
      }
      userListTextMessage = this.config.msg.userList.replace(
        "{USER_LIST}",
        userListText
      );
    }

    const containerElem = document.querySelectorAll(
      DOM_ELEMENT_SELECTORS.userList.containerToAppendTo
    );
    if (containerElem.length === 1) {
      const userListContainerElem = document.createElement("h3");
      userListContainerElem.classList.add(
        DOM_ELEMENT_SELECTORS.userList.containerElement
      );
      userListContainerElem.prepend(userListTextMessage);
      // Append the element to DOM.
      containerElem[0].prepend(userListContainerElem);
    }
  }

  callServiceWorker(params) {
    this.isLoading = true;
    var port = extensionWindow.runtime.connect({ name: PORT_NAME });
    port.postMessage({ path: this.path, ...params });
    port.onMessage.addListener(
      function (msg) {
        this.amIReviewing = false;
        if (msg.status === STATUS_OK) {
          this.userList = msg.userList;
          this.amIReviewing = this.userList.indexOf(this.userLogin) >= 0;
          this.drawReviewerList();
          this.toggleChangesPageVisibility();
        } else {
          this.drawReviewerList();
          this.toggleChangesPageVisibility();
        }
        this.updateStorage({
          status: "OPEN",
          amIReviewing: this.amIReviewing,
          timestamp: new Date().getTime(),
        });
        this.isLoading = false;
      }.bind(this)
    );
  }
}

// Execute logic only for PR pages.
if (path) {
  // Get login of user
  const headerElement = document.getElementById(
    DOM_ELEMENT_SELECTORS.pullRequest.header
  );
  // Enable only for open PR
  if (
    headerElement &&
    headerElement.querySelectorAll(DOM_ELEMENT_SELECTORS.pullRequest.open)
      .length > 0
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
      } else if (
        event.eventType === EVENT_TYPE_USER_NAVIGATION &&
        contentScript.getIsLoading() === false
      ) {
        setTimeout(() => {
          contentScript.drawReviewerList();
          contentScript.toggleChangesPageVisibility();
        }, 3000);
      }
    });
  }
}
