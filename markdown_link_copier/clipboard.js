chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.target !== 'offscreen' || message.type !== 'copy-to-clipboard') {
    return false;
  }

  try {
    copyToClipboard(message.text);
    sendResponse({ ok: true });
  } catch (error) {
    console.error('Failed to write to clipboard from offscreen document:', error);
    sendResponse({
      ok: false,
      error: error.message,
    });
  }

  return false;
});

function copyToClipboard(text) {
  const clipboardText = document.getElementById('clipboardText');
  if (!clipboardText) {
    throw new Error('Clipboard textarea was not found.');
  }

  clipboardText.value = text;
  clipboardText.select();
  clipboardText.setSelectionRange(0, clipboardText.value.length);

  const copied = document.execCommand('copy');
  clipboardText.value = '';

  if (!copied) {
    throw new Error('document.execCommand("copy") returned false.');
  }
}
