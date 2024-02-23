chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.tabs.sendMessage(sender.tab.id, { from: message.from, data: message.data });
});