// クリップボードへのコピーを試み、失敗した場合は一時テキストエリアを使ったフォールバック処理
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    return new Promise((resolve, reject) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // 一時的に画面外に配置
      textarea.style.position = 'fixed';
      textarea.style.top = '-1000px';
      textarea.style.left = '-1000px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        successful ? resolve() : reject(new Error('コピーに失敗しました'));
      } catch (err) {
        document.body.removeChild(textarea);
        reject(err);
      }
    });
  }
}

document.getElementById('copyBtn').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && tab.title) {
      const format = document.querySelector('input[name="format"]:checked').value;
      let linkText = '';
      switch (format) {
        case 'Markdown':
          linkText = `[${tab.title}](${tab.url})`;
          break;
        case 'HTML':
          linkText = `<a href="${tab.url}">${tab.title}</a>`;
          break;
        case 'Text':
          linkText = `${tab.title} - ${tab.url}`;
          break;
        default:
          linkText = `[${tab.title}](${tab.url})`;
      }
      await copyToClipboard(linkText);
      // コピー完了を待ってから少し待機し、ポップアップを閉じる
      setTimeout(() => window.close(), 100);
    } else {
      alert('タブ情報が取得できませんでした。');
      window.close();
    }
  } catch (error) {
    alert('エラーが発生しました: ' + error);
    window.close();
  }
});
