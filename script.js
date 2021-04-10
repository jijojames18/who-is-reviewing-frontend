"use strict";

const extensionWindow = (function () {
  if (typeof chrome !== undefined) {
    return chrome;
  } else if (typeof browser !== undefined) {
    return browser;
  } else if (typeof msBrowser !== undefined) {
    return msBrowser;
  }
})();

const PORT_NAME = "who_is_reviewing";

const STATUS_OK = "OK";
const STATUS_ERROR = "ERROR";

const EVENT_TYPE_GET = "GET";
const EVENT_TYPE_POST = "POST";
const EVENT_TYPE_DELETE = "DELETE";

extensionWindow.runtime.onConnect.addListener(function (port) {
  if (port.name === PORT_NAME) {
    port.onMessage.addListener(function (msg) {
      const { project, prId, eventType, endPoint } = msg;
      const url = `${endPoint}/${project}/${prId}`;
      if (eventType === EVENT_TYPE_GET) {
        fetch(url)
          .then((response) => response.json())
          .then((data) =>
            port.postMessage({
              status: STATUS_OK,
              userList: data,
            })
          )
          .catch(() => {
            port.postMessage({
              status: STATUS_ERROR,
            });
          });
      } else if (eventType === EVENT_TYPE_POST) {
        const postBody = {
          userId: msg.userId,
          status: msg.status,
        };
        fetch(url, {
          method: eventType,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postBody),
        })
          .then(() => fetch(url))
          .then((response) => response.json())
          .then((data) =>
            port.postMessage({
              status: STATUS_OK,
              userList: data,
            })
          )
          .catch(() => {
            port.postMessage({
              status: STATUS_ERROR,
            });
          });
      } else if (eventType === EVENT_TYPE_DELETE) {
        fetch(url, {
          method: eventType,
        });
      }
    });
  }
});
