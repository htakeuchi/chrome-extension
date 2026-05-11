(function exposeLinkCopier(global) {
  const formats = [
    {
      id: 'markdown',
      command: 'copy-markdown',
      icon: '#',
      label: 'Markdown',
      badge: 'MD',
      sample: '[title](url)',
    },
    {
      id: 'html',
      command: 'copy-html',
      icon: '<>',
      label: 'HTML',
      badge: 'HTML',
      sample: '<a href="url">title</a>',
    },
    {
      id: 'text',
      command: 'copy-text',
      icon: 'T',
      label: 'Text',
      badge: 'TXT',
      sample: 'title - url',
    },
  ];

  function getFormat(formatId) {
    return formats.find((format) => format.id === formatId);
  }

  function getFormatByCommand(command) {
    return formats.find((format) => format.command === command);
  }

  function formatLink(formatId, title, url) {
    switch (formatId) {
      case 'markdown':
        return `[${title}](${url})`;
      case 'html':
        return `<a href="${url}">${title}</a>`;
      case 'text':
        return `${title} - ${url}`;
      default:
        throw new Error(`Unsupported link format: ${formatId}`);
    }
  }

  function formatClipboardText(formatId, title, url, selectionText) {
    const linkText = formatLink(formatId, title, url);
    const trimmedSelectionText = typeof selectionText === 'string' ? selectionText.trim() : '';

    if (!trimmedSelectionText) {
      return linkText;
    }

    return `“${trimmedSelectionText}”\n\n${linkText}`;
  }

  global.LinkCopier = Object.freeze({
    formats: Object.freeze(formats.slice()),
    formatClipboardText,
    formatLink,
    getFormat,
    getFormatByCommand,
  });
})(globalThis);
