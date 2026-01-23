chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("tver.jp")) {
    chrome.tabs.sendMessage(tab.id, { action: "toggle" });
  }
});
