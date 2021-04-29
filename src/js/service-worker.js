// Service worker
import config from "@/config";
import {
  PORT_NAME,
  STATUS_OK,
  STATUS_ERROR,
  EVENT_TYPE_GET,
  EVENT_TYPE_POST,
  EVENT_TYPE_DELETE,
  EVENT_TYPE_USER_NAVIGATION,
} from "@js/common/constants";
import extensionWindow from "@js/common/context";
import { isMainPrPage } from "@js/common/functions";

const fetchData = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => ({
      status: STATUS_OK,
      userList: data,
    }))
    .catch(() => ({
      status: STATUS_ERROR,
    }));
};

const postData = (url, body) => {
  return fetch(url, {
    method: EVENT_TYPE_POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(() => fetchData(url))
    .catch(() => ({
      status: STATUS_ERROR,
    }));
};

const postMesageAndDisconnect = (port, message) => {
  port.postMessage(message);
  port.disconnect();
};

extensionWindow.runtime.onConnect.addListener(function (port) {
  if (port.name === PORT_NAME) {
    port.onMessage.addListener(function (msg) {
      const { path, eventType } = msg;
      const url = `${config.restEndPoint}/${path}`;
      switch (eventType) {
        case EVENT_TYPE_GET:
          fetchData(url).then((response) =>
            postMesageAndDisconnect(port, response)
          );
          break;
        case EVENT_TYPE_POST:
          const postBody = {
            userId: msg.userId,
            status: msg.status,
          };
          postData(url, postBody).then((response) =>
            postMesageAndDisconnect(port, response)
          );
          break;
        case EVENT_TYPE_DELETE:
          fetch(url, {
            method: eventType,
          });
          port.disconnect();
          break;
      }
    });
  }
});

extensionWindow.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  // User navigated to a PR
  if (changeInfo.url && isMainPrPage(changeInfo.url) === true) {
    extensionWindow.tabs.sendMessage(tabId, {
      eventType: EVENT_TYPE_USER_NAVIGATION,
    });
  }
});
