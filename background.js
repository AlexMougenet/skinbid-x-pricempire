getBrowser = () => {
  return typeof browser !== 'undefined' ? browser : chrome;
}
getBrowser().runtime.onMessage.addListener((message, sender, sendResponse) => {
  getBrowser().tabs.sendMessage(sender.tab.id, { from: message.from, data: message.data });
});