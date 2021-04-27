// Helper functions
export const getPRPath = (url) => {
  const splitUrl = url.split("/").reverse();
  return splitUrl[1] === "pull" ? `${splitUrl[2]}/${splitUrl[0]}` : "";
};
