// Helper functions
export const getAPIPath = (url) => {
  const splitUrl = url.split("/").reverse();
  if (splitUrl[1] === "pull") {
    // Conversation page
    return `${splitUrl[2]}/${splitUrl[0]}`;
  } else if (splitUrl[2] === "pull") {
    // Commits/Files/Checks page
    return `${splitUrl[3]}/${splitUrl[1]}`;
  }
  return "";
};

export const isConversationPage = (url) => {
  const splitUrl = url.split("/").reverse();
  return splitUrl[1] === "pull";
};

export const getFilesPageUrl = (url) => {
  const splitUrl = url.split("/").reverse();
  if (splitUrl[1] === "pull") {
    // Conversation page
    return `${splitUrl[2]}/${splitUrl[1]}/${splitUrl[0]}/files`;
  } else if (splitUrl[2] === "pull") {
    // Commits/Files/Checks page
    return `${splitUrl[3]}/${splitUrl[2]}/${splitUrl[1]}/files`;
  }
  return "";
};

export const getUserLoginFromMeta = (metas) => {
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("name") === "user-login") {
      return metas[i].getAttribute("content");
    }
  }
  return "";
};
