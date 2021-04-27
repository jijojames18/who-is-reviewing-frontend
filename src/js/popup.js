// Popup
import {
  EVENT_TYPE_STATUS_CHANGE,
  REVIEW_STARTED,
  REVIEW_STOPPED,
} from "@js/common/constants";
import config from "@/config";
import extensionWindow from "@js/common/context";
import { getPRPath } from "@js/common/functions";

import "@css/popup.css";

const checkbox = document.getElementById("toggle-status");
const mainContentElem = document.getElementById("main-content");
const fallBackContentElem = document.getElementById("fallback-content");

const activeWindowQueryParams = { active: true, currentWindow: true };

// set messages in popup
document.getElementsByClassName("toggle-message")[0].textContent =
  config.msg.toggleMessage;
document.getElementsByClassName("toggle-status-label-yes")[0].textContent =
  config.msg.toggleYes;
document.getElementsByClassName("toggle-status-label-no")[0].textContent =
  config.msg.toggleNo;
fallBackContentElem.textContent = config.msg.fallbackMessage;

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
  const PRStatus = event.currentTarget.checked
    ? REVIEW_STARTED
    : REVIEW_STOPPED;
  function callback(tabs) {
    extensionWindow.tabs.sendMessage(tabs[0].id, {
      status: PRStatus,
      eventType: EVENT_TYPE_STATUS_CHANGE,
    });
  }
  extensionWindow.tabs.query(activeWindowQueryParams, callback);
});

extensionWindow.tabs.query(activeWindowQueryParams, function (tabs) {
  const key = getPRPath(tabs[0].url);
  // Execute logic only for PR pages.
  if (key) {
    extensionWindow.storage.sync.get([key], function (result) {
      showToggle(result[key]);
    });
  } else {
    hideToggle();
  }
});
