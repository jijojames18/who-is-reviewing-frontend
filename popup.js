"use strict";

const PORT_NAME = "who_is_reviewing";

const EVENT_TYPE_STATUS_CHANGE = "STATUS_CHANGE";

const extensionWindow = (function () {
  if (typeof chrome !== undefined) {
    return chrome;
  } else if (typeof browser !== undefined) {
    return browser;
  } else if (typeof msBrowser !== undefined) {
    return msBrowser;
  }
})();

const checkbox = document.getElementById("toggle-status");

checkbox.addEventListener("change", (event) => {
  const query = { active: true, currentWindow: true };
  const prStatus = event.currentTarget.checked ? "STARTED" : "STOPPED";
  function callback(tabs) {
    extensionWindow.tabs.sendMessage(tabs[0].id, {
      status: prStatus,
      eventType: EVENT_TYPE_STATUS_CHANGE,
    });
  }
  chrome.tabs.query(query, callback);
});

extensionWindow.runtime.onMessage.addListener((event) => {
  if (event.eventType === EVENT_TYPE_STATUS_CHANGE) {
    checkbox.checked = event.status;
  }
});
