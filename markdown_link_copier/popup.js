const formatButtons = Array.from(document.querySelectorAll('[data-format]'));
const statusElement = document.getElementById('status');
const shortcutSettingsButton = document.getElementById('shortcutSettings');

formatButtons.forEach((button) => {
  button.addEventListener('click', () => {
    copyCurrentTab(button.dataset.format, button);
  });
});

shortcutSettingsButton.addEventListener('click', () => {
  openShortcutSettings().catch((error) => {
    console.error('Failed to open shortcut settings:', error);
    setStatus('ショートカット設定を開けませんでした。', true);
  });
});

renderShortcuts().catch((error) => {
  console.error('Failed to render command shortcuts:', error);
});

async function copyCurrentTab(formatId, activeButton) {
  const format = LinkCopier.getFormat(formatId);
  if (!format) {
    setStatus('未対応の形式です。', true);
    return;
  }

  setBusy(true, activeButton);
  setStatus('');

  try {
    const tab = await getActiveTab();
    if (!tab || !tab.title || !tab.url) {
      throw new Error('タブ情報が取得できませんでした。');
    }

    const linkText = LinkCopier.formatLink(formatId, tab.title, tab.url);
    await copyToClipboard(linkText);
    setStatus(`${format.label} をコピーしました。`);
    setTimeout(() => window.close(), 350);
  } catch (error) {
    console.error(`Failed to copy ${format.label} link:`, error);
    setStatus('コピーに失敗しました。', true);
    setBusy(false);
  }
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab;
}

async function copyToClipboard(text) {
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    throw new Error('Clipboard API is not supported.');
  }

  await navigator.clipboard.writeText(text);
}

async function renderShortcuts() {
  const commands = await chrome.commands.getAll();
  const commandShortcutMap = new Map(commands.map((command) => [command.name, command.shortcut]));

  LinkCopier.formats.forEach((format) => {
    const shortcutElement = document.querySelector(`[data-shortcut-for="${format.id}"]`);
    if (!shortcutElement) {
      return;
    }

    const shortcut = commandShortcutMap.get(format.command) || '';
    shortcutElement.textContent = shortcut || '未設定';
    shortcutElement.classList.toggle('is-unset', !shortcut);
  });
}

async function openShortcutSettings() {
  await chrome.tabs.create({
    url: 'chrome://extensions/shortcuts',
  });
  window.close();
}

function setBusy(isBusy, activeButton) {
  formatButtons.forEach((button) => {
    button.disabled = isBusy;
    button.classList.toggle('is-copying', isBusy && button === activeButton);
  });
  shortcutSettingsButton.disabled = isBusy;
}

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.classList.toggle('is-error', isError);
}
