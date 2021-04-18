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

extensionWindow.tabs.query(
  { currentWindow: true, active: true },
  function (tabs) {
    const url = tabs[0].url;
    const splitUrl = url.split("/").reverse();
    // Execute logic only for PR pages.
    if (splitUrl[1] === "pull") {
      const key = `${splitUrl[2]}/${splitUrl[0]}`;
      chrome.storage.sync.get([key], function (result) {
        const mainContentElem = document.getElementById("main-content");
        const fallBackContentElem = document.getElementById("fallback-content");
        mainContentElem.classList.remove("hidden");
        fallBackContentElem.classList.add("hidden");
        checkbox.checked = result[key] || false;
      });
    } else {
      const mainContentElem = document.getElementById("main-content");
      const fallBackContentElem = document.getElementById("fallback-content");
      mainContentElem.classList.add("hidden");
      fallBackContentElem.classList.remove("hidden");
    }
  }
);
