// content.js

let originalParent = null;
let originalNextSibling = null;
let fullWidthContainer = null;
let isFullWidth = false;

function init() {
  tryAddToggleButton();
  
  const observer = new MutationObserver((mutations) => {
    if (document.querySelector('#tver-fullwidth-btn')) return;
    
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'VIDEO' || node.querySelector?.('video')) {
            tryAddToggleButton();
            return;
          }
        }
      }
    }
  });

  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFullWidth) {
      toggleFullWidth();
    }
  });
}

function tryAddToggleButton() {
  const video = document.querySelector('video');
  if (video && !document.querySelector('#tver-fullwidth-btn')) {
    addToggleButton(video);
  }
}

function addToggleButton(video) {
  const titlesContainer = document.querySelector('[class*="EpisodeDescription_seriesTitle"]');
  if (!titlesContainer) return;

  const btn = document.createElement('button');
  btn.id = 'tver-fullwidth-btn';
  btn.textContent = '⛶ ブラウザ幅いっぱいに表示';
  btn.style.cssText = `
    display: block;
    width: 100%;
    text-align: right;
    background: transparent;
    color: #888;
    border: none;
    padding: 4px 0;
    margin: 4px 0;
    cursor: pointer;
    font-size: 13px;
    font-family: inherit;
    text-decoration: underline;
  `;
  
  btn.onmouseenter = () => {
    btn.style.color = '#0066cc';
  };
  btn.onmouseleave = () => {
    btn.style.color = '#888';
  };
  
  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFullWidth();
  };

  titlesContainer.parentElement?.insertBefore(btn, titlesContainer);
}

function toggleFullWidth() {
  const video = document.querySelector('video');
  if (!video) return;

  if (isFullWidth) {
    deactivateFullWidth();
  } else {
    activateFullWidth(video);
  }
}

function activateFullWidth(video) {
  let playerContainer = video.parentElement;
  while (playerContainer && playerContainer !== document.body) {
    if (playerContainer.querySelector('video') === video) {
      const parent = playerContainer.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(child => 
          child !== playerContainer && 
          child.id !== 'tver-fullwidth-btn' &&
          child.tagName !== 'SCRIPT' &&
          child.tagName !== 'STYLE'
        );
        if (siblings.length > 0) break;
      }
    }
    playerContainer = playerContainer.parentElement;
  }

  if (!playerContainer || playerContainer === document.body) {
    playerContainer = video.parentElement;
  }

  originalParent = playerContainer.parentElement;
  originalNextSibling = playerContainer.nextSibling;

  fullWidthContainer = document.createElement('div');
  fullWidthContainer.id = 'tver-full-width-container';
  fullWidthContainer.appendChild(playerContainer);
  document.body.insertBefore(fullWidthContainer, document.body.firstChild);
  document.body.classList.add('tver-full-width-active');
  
  isFullWidth = true;

  const handleClick = () => {
    toggleFullWidth();
    document.removeEventListener('click', handleClick, true);
  };
  
  setTimeout(() => {
    document.addEventListener('click', handleClick, true);
  }, 100);

  const btn = document.querySelector('#tver-fullwidth-btn');
  if (btn) btn.style.display = 'none';
}

function deactivateFullWidth() {
  if (!fullWidthContainer || !originalParent) {
    isFullWidth = false;
    return;
  }

  const playerContainer = fullWidthContainer.firstChild;
  if (playerContainer && originalParent) {
    if (originalNextSibling?.parentElement === originalParent) {
      originalParent.insertBefore(playerContainer, originalNextSibling);
    } else {
      originalParent.appendChild(playerContainer);
    }
  }

  fullWidthContainer.remove();
  fullWidthContainer = null;
  originalParent = null;
  originalNextSibling = null;
  document.body.classList.remove('tver-full-width-active');
  isFullWidth = false;

  const btn = document.querySelector('#tver-fullwidth-btn');
  if (btn) btn.style.display = 'block';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggle") {
    toggleFullWidth();
  }
});
