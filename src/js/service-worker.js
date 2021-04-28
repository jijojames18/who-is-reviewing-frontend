// Service worker
import config from "@/config";
import {
  PORT_NAME,
  STATUS_OK,
  STATUS_ERROR,
  EVENT_TYPE_GET,
  EVENT_TYPE_POST,
  EVENT_TYPE_DELETE,
} from "@js/common/constants";
import extensionWindow from "@js/common/context";

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
      const { project, prId, eventType } = msg;
      const url = `${config.restEndPoint}/${project}/${prId}`;
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
