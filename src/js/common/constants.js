// Constants file

export const PORT_NAME = "who_is_reviewing";

export const STATUS_OK = "OK";
export const STATUS_ERROR = "ERROR";

export const EVENT_TYPE_GET = "GET";
export const EVENT_TYPE_POST = "POST";
export const EVENT_TYPE_DELETE = "DELETE";
export const EVENT_TYPE_STATUS_CHANGE = "STATUS_CHANGE";
export const EVENT_TYPE_USER_NAVIGATION = "USER_NAVIGATION";

export const REVIEW_STARTED = "STARTED";
export const REVIEW_STOPPED = "STOPPED";

export const PR_OPEN = "OPEN";
export const PR_CLOSED = "CLOSED";

export const STORAGE_KEY = "who_is_reviewing";

export const DOM_ELEMENT_SELECTORS = {
  userList: {
    containerToAppendTo: ".js-merge-message-container",
    containerElement: "who-is-reviewing-user-list",
  },
  pullRequest: {
    header: "partial-discussion-header",
    open: ".State--open",
  },
};
