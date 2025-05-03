function setSvgSize() {
  $('svg > use').each(function () {
    const $useElement = $(this);
    const href = $useElement.attr('xlink:href') || $useElement.attr('href');
    
    if (href) {
      const id = href.replace('#', '');
      const $symbol = $(`#${id}`);
      
      if ($symbol.length) {
        const $svg = $useElement.closest('svg');
        const viewBox = $symbol.attr('viewBox');
        const width = $symbol.attr('width');
        const height = $symbol.attr('height');
        
        if (viewBox) $svg.attr('viewBox', viewBox);
        if (width) $svg.attr('width', width);
        if (height) $svg.attr('height', height);
      }
    }
  });
}
setSvgSize();