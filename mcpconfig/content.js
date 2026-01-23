// 選択範囲からMCP設定を抽出する関数
function extractMCPConfig(selectedText) {
  try {
    // JSONをパース
    const parsed = JSON.parse(selectedText);

    // mcpServersキーが存在するか確認
    if (parsed.mcpServers && typeof parsed.mcpServers === 'object') {
      // mcpServersの中身を取得
      const mcpContent = parsed.mcpServers;

      // 整形してJSON文字列に変換(インデント2スペース)
      const formatted = JSON.stringify(mcpContent, null, 2);

      // 各行を処理して最初の行のインデントを削除
      const lines = formatted.split('\n');
      if (lines.length > 0 && lines[0] === '{') {
        // 最初の { と最後の } を除去
        const innerLines = lines.slice(1, -1);
        // 各行の先頭2スペースを削除
        const dedented = innerLines.map(line => line.substring(2)).join('\n');
        return dedented;
      }

      return formatted;
    } else {
      throw new Error('mcpServersキーが見つかりません');
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

// メッセージリスナー
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractConfig') {
    const selection = window.getSelection().toString().trim();

    if (!selection) {
      sendResponse({ success: false, error: 'テキストが選択されていません' });
      return;
    }

    const extracted = extractMCPConfig(selection);

    if (extracted) {
      // クリップボードにコピー
      navigator.clipboard.writeText(extracted).then(() => {
        sendResponse({ success: true, text: extracted });
      }).catch(err => {
        sendResponse({ success: false, error: 'クリップボードへのコピーに失敗しました' });
      });
    } else {
      sendResponse({ success: false, error: 'JSON解析エラー' });
    }

    return true; // 非同期レスポンスを示す
  }
});
