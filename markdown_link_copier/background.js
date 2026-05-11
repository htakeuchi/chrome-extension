importScripts('link-utils.js');

const OFFSCREEN_DOCUMENT_PATH = 'clipboard.html';
const BADGE_SUCCESS_COLOR = '#16a34a';
const BADGE_ERROR_COLOR = '#dc2626';
const BADGE_SUCCESS_DURATION_MS = 900;
const BADGE_ERROR_DURATION_MS = 1500;
let creatingOffscreenDocument;
let badgeDisplayId = 0;

chrome.commands.onCommand.addListener((command, tab) => {
  const format = LinkCopier.getFormatByCommand(command);
  if (!format) {
    return;
  }

  copyCurrentTab(format.id, tab)
    .then(() => showBadge(format.badge, BADGE_SUCCESS_COLOR, BADGE_SUCCESS_DURATION_MS))
    .catch((error) => {
      console.error(`Failed to copy ${format.label} link:`, error);
      showBadge('!', BADGE_ERROR_COLOR, BADGE_ERROR_DURATION_MS);
    });
});

async function copyCurrentTab(formatId, commandTab) {
  const tab = await getActiveTab(commandTab);
  if (!tab || !tab.title || !tab.url) {
    throw new Error('Active tab title or URL could not be read.');
  }

  const selectionText = await getSelectedText(tab.id);
  const clipboardText = LinkCopier.formatClipboardText(formatId, tab.title, tab.url, selectionText);
  await copyToClipboard(clipboardText);
}

async function getActiveTab(commandTab) {
  if (commandTab && commandTab.title && commandTab.url) {
    return commandTab;
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab;
}

async function getSelectedText(tabId) {
  if (!tabId || !chrome.scripting || !chrome.scripting.executeScript) {
    return '';
  }

  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: getPageSelectedText,
    });

    return result && typeof result.result === 'string' ? result.result : '';
  } catch (error) {
    console.debug('Selected text could not be read from the active tab:', error);
    return '';
  }
}

function getPageSelectedText() {
  const selection = globalThis.getSelection();
  const selectedText = selection ? selection.toString() : '';

  if (selectedText) {
    return selectedText;
  }

  const activeElement = document.activeElement;
  if (!activeElement || typeof activeElement.value !== 'string') {
    return '';
  }

  const tagName = activeElement.tagName;
  if (tagName === 'INPUT') {
    const type = activeElement.type.toLowerCase();
    const textInputTypes = ['email', 'number', 'search', 'tel', 'text', 'url'];
    if (!textInputTypes.includes(type)) {
      return '';
    }
  } else if (tagName !== 'TEXTAREA') {
    return '';
  }

  const selectionStart = activeElement.selectionStart;
  const selectionEnd = activeElement.selectionEnd;
  if (
    typeof selectionStart !== 'number' ||
    typeof selectionEnd !== 'number' ||
    selectionEnd <= selectionStart
  ) {
    return '';
  }

  return activeElement.value.slice(selectionStart, selectionEnd);
}

async function copyToClipboard(text) {
  await ensureOffscreenDocument();

  const response = await chrome.runtime.sendMessage({
    target: 'offscreen',
    type: 'copy-to-clipboard',
    text,
  });

  if (!response || !response.ok) {
    throw new Error(response && response.error ? response.error : 'Clipboard write failed.');
  }
}

async function ensureOffscreenDocument() {
  const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);
  const existingUrls = await getOffscreenDocumentUrls();

  if (existingUrls.includes(offscreenUrl)) {
    return;
  }

  if (existingUrls.length > 0) {
    await chrome.offscreen.closeDocument();
  }

  if (!creatingOffscreenDocument) {
    creatingOffscreenDocument = chrome.offscreen
      .createDocument({
        url: OFFSCREEN_DOCUMENT_PATH,
        reasons: ['CLIPBOARD'],
        justification: 'Copy formatted current tab links to the clipboard from keyboard shortcuts.',
      })
      .finally(() => {
        creatingOffscreenDocument = null;
      });
  }

  await creatingOffscreenDocument;
}

async function getOffscreenDocumentUrls() {
  if ('getContexts' in chrome.runtime) {
    const contexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
    });
    return contexts.map((context) => context.documentUrl);
  }

  const clientsList = await clients.matchAll();
  return clientsList.map((client) => client.url);
}

function showBadge(text, backgroundColor, durationMs) {
  const displayId = ++badgeDisplayId;

  chrome.action.setBadgeBackgroundColor({ color: backgroundColor });
  chrome.action.setBadgeText({ text });

  setTimeout(() => {
    if (displayId !== badgeDisplayId) {
      return;
    }

    chrome.action.setBadgeText({ text: '' });
  }, durationMs);
}
