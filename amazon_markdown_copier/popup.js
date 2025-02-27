document.getElementById('copyBtn').addEventListener('click', async () => {
  try {
    // アクティブタブを取得
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) throw new Error("アクティブタブが見つかりません");

    // アクティブタブ内で Amazon 商品情報を取得するスクリプトを実行
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // 指定セレクタから要素を取得するヘルパー
        function getElement(selector) {
          return document.querySelector(selector);
        }
        try {
          const size = 200;
          const asinElement = getElement('input#ASIN');
          if (!asinElement) throw new Error('ASINが見つかりませんでした');
          const asin = asinElement.value;

          const titleElement = getElement('span#productTitle');
          if (!titleElement) throw new Error('商品名が見つかりませんでした');
          const title = titleElement.textContent.trim();

          const thumbnailUrl =
            (getElement('img#landingImage') && getElement('img#landingImage').src) ||
            (getElement('img[src*="_SY"]') && getElement('img[src*="_SY"]').src) ||
            (getElement('input#productImageUrl') && getElement('input#productImageUrl').value) ||
            (getElement('img[src*="_SX"]') && getElement('img[src*="_SX"]').src);
          if (!thumbnailUrl) throw new Error('サムネイル画像が見つかりませんでした');

          const productUrl = 'https://www.amazon.co.jp/gp/product/' + asin + '/?tag=namaraiicom-22';

          let modifiedUrl;
          const sizeMatch = thumbnailUrl.match(/_(_SY|_SX)(\d+)_/);
          if (sizeMatch && sizeMatch[2]) {
            // サイズ指定部分を新しいサイズに置換
            modifiedUrl = thumbnailUrl.replace(/_(_SY|_SX)\d+_/, `_${sizeMatch[1]}${size}_`);
          } else if (thumbnailUrl.match(/_(SY|SX)(\d+)_/)) {
            modifiedUrl = thumbnailUrl.replace(/_(SY|SX)\d+_/, `_SY${size}_`);
          } else {
            modifiedUrl = thumbnailUrl;
          }
          const markdownContent = `![${title}](${modifiedUrl})\n\n[${title}](${productUrl})`;
          return { markdown: markdownContent };
        } catch (error) {
          return { error: error.message };
        }
      }
    });
    // 結果がエラーなら alert で通知
    if (!results || !results[0] || results[0].result.error) {
      const errMsg = results && results[0] && results[0].result.error ? results[0].result.error : "情報の取得に失敗しました";
      alert(errMsg);
      return;
    }
    const markdown = results[0].result.markdown;

    // Popup 内（フォーカスがある状態）で Clipboard API を実行
    await navigator.clipboard.writeText(markdown);
    alert('クリップボードにコピーされました');
    window.close();
  } catch (error) {
    alert('エラーが発生しました: ' + error.message);
  }
});
