# MCP Server Config Extractor

MCPサーバの設定から`"mcpServers":`を除いた部分をインデントを調整してクリップボードにコピーするChrome拡張機能です。

## 概要

Model Context Protocol (MCP) サーバの設定をブラウザ上で選択し、簡単に設定の中身だけを抽出してクリップボードにコピーできます。設定ファイルの編集や共有時に便利です。

## 機能

- ブラウザ上で選択したMCPサーバ設定のJSONから、`mcpServers`オブジェクトの中身だけを抽出
- インデントを適切に調整（2スペース）
- クリップボードに自動コピー
- キーボードショートカット対応
- 複数のMCPサーバ設定にも対応

## インストール方法

### Chrome / Edge / Brave

1. ブラウザで`chrome://extensions/`を開く
2. 右上の「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. このプロジェクトのフォルダを選択

## 使い方

### 基本的な使用方法

1. ブラウザ上でMCPサーバの設定JSON(mcpServersを含む)をテキスト選択
2. 以下のいずれかの方法で実行:
   - 拡張機能のアイコンをクリック
   - キーボードショートカット: `Ctrl+Shift+E` (Windows/Linux) または `Command+Shift+E` (Mac)
3. クリップボードにコピーされた設定を貼り付けて使用

### 入力例

選択するJSON:

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-brave-search"
      ],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

### 出力例

クリップボードにコピーされる内容:

```json
"brave-search": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-brave-search"
  ],
  "env": {
    "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
  }
}
```

### 複数サーバの例

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
    }
  }
}
```

上記を選択すると、以下がクリップボードにコピーされます:

```json
"brave-search": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-brave-search"],
  "env": {
    "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
  }
},
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
}
```

## プロジェクト構成

```
mcpconfig/
├── manifest.json      # 拡張機能の設定ファイル
├── content.js         # コンテンツスクリプト（ページ上で動作）
├── background.js      # バックグラウンドスクリプト
├── README.md          # このファイル
└── .gitignore         # Git除外設定
```

## 技術仕様

- **Manifest Version**: 3
- **権限**: clipboardWrite
- **対応ブラウザ**: Chrome, Edge, Brave (Chromium系)

## トラブルシューティング

### 拡張機能が動作しない

- デベロッパーモードが有効になっているか確認してください
- 拡張機能が正しく読み込まれているか`chrome://extensions/`で確認してください
- ページをリロードしてから再試行してください

### クリップボードにコピーされない

- ブラウザのクリップボード権限が許可されているか確認してください
- HTTPSページで使用してください（一部のブラウザではHTTPページで制限があります）

### JSONのパースエラー

- 選択範囲が正しいJSON形式か確認してください
- `mcpServers`キーが含まれているか確認してください

## 開発

### ローカルでの開発

```bash
# リポジトリのクローン
git clone <repository-url>
cd mcpconfig

# Chromeで chrome://extensions/ を開き、デベロッパーモードで読み込む
```

### コードの編集後

拡張機能を更新するには、`chrome://extensions/`で更新ボタンをクリックしてください。

## ライセンス

MIT License

## 貢献

Issue報告やプルリクエストを歓迎します。

## 注意事項

- アイコン画像は含まれていません。必要に応じて48x48pxの`icon48.png`を追加してください。
- キーボードショートカットは`chrome://extensions/shortcuts`からカスタマイズできます。
