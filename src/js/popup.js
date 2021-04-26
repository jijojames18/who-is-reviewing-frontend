// Popup
import {
  EVENT_TYPE_STATUS_CHANGE,
  REVIEW_STARTED,
  REVIEW_STOPPED,
} from "@js/common/constants";
import config from "@/config";
import extensionWindow from "@js/common/context";

import "@css/popup.css";

const checkbox = document.getElementById("toggle-status");
const mainContentElem = document.getElementById("main-content");
const fallBackContentElem = document.getElementById("fallback-content");

const showToggle = (isChecked) => {
  mainContentElem.classList.remove("hidden");
  fallBackContentElem.classList.add("hidden");
  checkbox.checked = isChecked || false;
};

const hideToggle = () => {
  mainContentElem.classList.add("hidden");
  fallBackContentElem.classList.remove("hidden");
};

checkbox.addEventListener("change", (event) => {
  const query = { active: true, currentWindow: true };
  function callback(tabs) {
    extensionWindow.tabs.sendMessage(tabs[0].id, {
      status: event.currentTarget.checked ? REVIEW_STARTED : REVIEW_STOPPED,
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
      extensionWindow.storage.sync.get([key], function (result) {
        showToggle(result[key]);
      });
    } else {
      hideToggle();
    }
  }
);
