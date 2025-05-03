function setNbsp() {
  // Список русских предлогов и союзов
  let prepositions = [
    'в', 'без', 'до', 'из', 'к', 'на', 'по', 'о', 'от', 'перед', 
    'при', 'через', 'с', 'у', 'за', 'над', 'об', 'под', 'про', 'и', 
    'а', 'но', 'да', 'или', 'то', 'либо', 'нибудь', 'ка', 'во', 'со',
    'что', 'как', 'это', 'этот', 'тот', 'такой', 'такая', 'такое', 
    'такие', 'мой', 'твой', 'его', 'её', 'наш', 'ваш', 'их'];

  // Регулярное выражение для поиска предлогов перед словами
  let regex = new RegExp('(^|\\s)(' + prepositions.join('|') + ')(\\s+)', 'gi');

  // Функция для обработки текстовых узлов
  function processTextNodes(node) {
    if (node.nodeType === 3) { // Текстовый узел
      let text = node.nodeValue;
      if (regex.test(text)) {
        // Создаем временный элемент для правильной обработки HTML
        let wrapper = $('<div>').html(text.replace(regex, '$1$2&nbsp;'));
        // Заменяем текстовый узел на обработанный HTML
        $(node).replaceWith(wrapper.contents());
      }
    } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE' && node.nodeName !== 'TEXTAREA') {
      // Рекурсивная обработка дочерних элементов
      $(node).contents().each(function() {
        processTextNodes(this);
      });
    }
  }

  // Обрабатываем весь документ
  processTextNodes(document.body);

  // Также обрабатываем динамически добавляемый контент
  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        processTextNodes(node);
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
setNbsp();