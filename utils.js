getBrowser = () => {
  return typeof browser !== 'undefined' ? browser : chrome;
}
const waitForElement = (selector, interval = 100, useXPath = false) => {
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
const serialize = function (obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}