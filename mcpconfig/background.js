// 拡張機能アイコンクリック時の処理
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'extractConfig' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
      return;
    }

    if (response && response.success) {
      console.log('設定をクリップボードにコピーしました');
      // 成功通知を表示
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'MCP Config Extractor',
        message: 'クリップボードにコピーしました'
      });
    } else {
      console.error('Error:', response ? response.error : 'Unknown error');
    }
  });
});

// キーボードショートカット
chrome.commands.onCommand.addListener((command) => {
  if (command === 'extract-config') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'extractConfig' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError);
            return;
          }

          if (response && response.success) {
            console.log('設定をクリップボードにコピーしました');
          } else {
            console.error('Error:', response ? response.error : 'Unknown error');
          }
        });
      }
    });
  }
});
