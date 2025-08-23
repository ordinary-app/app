export interface TextSelection {
  start: number;
  end: number;
  selectedText: string;
}

export function getTextSelection(textarea: HTMLTextAreaElement): TextSelection {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  
  return { start, end, selectedText };
}

export function insertTextAtCursor(
  textarea: HTMLTextAreaElement, 
  textToInsert: string, 
  selectionStart?: number, 
  selectionEnd?: number
): void {
  const start = selectionStart ?? textarea.selectionStart;
  const end = selectionEnd ?? textarea.selectionEnd;
  const value = textarea.value;
  
  const newValue = value.substring(0, start) + textToInsert + value.substring(end);
  textarea.value = newValue;
  
  // Set cursor position after inserted text
  const newCursorPos = start + textToInsert.length;
  textarea.setSelectionRange(newCursorPos, newCursorPos);
  textarea.focus();
}

export function wrapSelectedText(
  textarea: HTMLTextAreaElement,
  prefix: string,
  suffix: string = prefix
): void {
  const selection = getTextSelection(textarea);
  
  if (selection.selectedText) {
    // Text is selected, wrap it
    const wrappedText = prefix + selection.selectedText + suffix;
    insertTextAtCursor(textarea, wrappedText, selection.start, selection.end);
  } else {
    // No selection, just insert the formatting markers
    const placeholder = prefix + suffix;
    insertTextAtCursor(textarea, placeholder);
    // Position cursor between the markers
    const cursorPos = selection.start + prefix.length;
    textarea.setSelectionRange(cursorPos, cursorPos);
  }
}

export function formatText(textarea: HTMLTextAreaElement, format: string): void {
  switch (format) {
    case 'bold':
      wrapSelectedText(textarea, '**');
      break;
    case 'italic':
      wrapSelectedText(textarea, '*');
      break;
    case 'strikethrough':
      wrapSelectedText(textarea, '~~');
      break;
    case 'underline':
      // Markdown doesn't have native underline, use HTML
      wrapSelectedText(textarea, '<u>', '</u>');
      break;
    case 'link':
      handleLinkFormatting(textarea);
      break;
    case 'mention':
      handleMentionFormatting(textarea);
      break;
    default:
      console.log(`Formatting type "${format}" not implemented yet`);
  }
}

function handleLinkFormatting(textarea: HTMLTextAreaElement): void {
  const selection = getTextSelection(textarea);
  
  if (selection.selectedText) {
    // If text is selected, use it as link text
    const url = prompt('Enter URL:');
    if (url) {
      const linkText = `[${selection.selectedText}](${url})`;
      insertTextAtCursor(textarea, linkText, selection.start, selection.end);
    }
  } else {
    // No selection, insert link template
    const url = prompt('Enter URL:');
    const linkText = prompt('Enter link text:');
    if (url && linkText) {
      const link = `[${linkText}](${url})`;
      insertTextAtCursor(textarea, link);
    } else if (url) {
      const link = `[${url}](${url})`;
      insertTextAtCursor(textarea, link);
    }
  }
}

function handleMentionFormatting(textarea: HTMLTextAreaElement): void {
  const selection = getTextSelection(textarea);
  
  if (selection.selectedText) {
    // If text is selected, add @ prefix
    const mentionText = `@${selection.selectedText}`;
    insertTextAtCursor(textarea, mentionText, selection.start, selection.end);
  } else {
    // No selection, just insert @
    insertTextAtCursor(textarea, '@');
  }
}