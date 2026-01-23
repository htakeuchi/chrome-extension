// クリップボードへのコピーを試み、失敗した場合はエラーメッセージを表示
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).catch(err => {
      console.error('クリップボードへの書き込みに失敗しました:', err);
      alert('クリップボードへの書き込みに失敗しました。');
    });
  } else {
    alert('このブラウザはクリップボードAPIをサポートしていません。');
    return Promise.reject(new Error('クリップボードAPIがサポートされていません'));
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
      }
      await copyToClipboard(linkText);
      // コピー完了を待ってから少し待機し、ポップアップを閉じる
      setTimeout(() => window.close(), 100);
    } else {
      alert('タブ情報が取得できませんでした。');
      window.close();
    }
  } catch (error) {
    alert(`エラーが発生しました: ${error}`);
    window.close();
  }
});
