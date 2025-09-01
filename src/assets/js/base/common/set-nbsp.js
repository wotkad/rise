export default function setNbsp() {
  const prepositions = ['в', 'без', 'до', 'из', 'к', 'на', 'по', 'о', 'от', 'перед', 
                      'при', 'через', 'с', 'у', 'за', 'над', 'об', 'под', 'про', 'и', 
                      'а', 'но', 'да', 'или', 'то', 'либо', 'нибудь', 'ка', 'во', 'со',
                      'что', 'как', 'это', 'этот', 'тот', 'такой', 'такая', 'такое'];

  const regex = new RegExp(`(^|\\s)(${prepositions.join('|')})(\\s+)`, 'gi');

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      const newText = text.replace(regex, (match, p1, p2, p3) => {
        // Заменяем только пробелы на &nbsp;, сохраняя остальное
        return p1 + p2 + '\xA0'; // \xA0 — это символ неразрывного пробела
      });

      if (newText !== text) {
        node.nodeValue = newText;
      }
    } 
    else if (node.nodeType === Node.ELEMENT_NODE && 
            !['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'].includes(node.tagName)) {
      Array.from(node.childNodes).forEach(processNode);
    }
  }

  processNode(document.body);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        processNode(node);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return observer; // Для возможности отключения observer.disconnect()
}
setNbsp();