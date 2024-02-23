const waitForElement = (selector, interval, useXPath = false) => {
  return new Promise(resolve => {
    const checkInterval = setInterval(() => {
      const el = useXPath ? getElementByXpath(selector) : document.querySelector(selector);
      if (el) {
        clearInterval(checkInterval);
        resolve(el);
      }
    }, interval);
  });
};
const getElementByXpath = (path) => {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}