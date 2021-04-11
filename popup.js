"use strict";

const PORT_NAME = "who_is_reviewing";

const EVENT_TYPE_POST = "POST";

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
  console.log(event.currentTarget.checked);
});
