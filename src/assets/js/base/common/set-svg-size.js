export default function setSvgSize() {
  $('svg > use').each(function () {
    const $useElement = $(this);
    const href = $useElement.attr('xlink:href') || $useElement.attr('href');

    if (!href) return;

    const $symbol = $(href);
    if (!$symbol.length) return;

    const $svg = $useElement.closest('svg');
    const viewBox = $symbol.attr('viewBox');
    const width = $symbol.attr('width');
    const height = $symbol.attr('height');

    if (viewBox) $svg.attr('viewBox', viewBox);
    if (width) $svg.attr('width', width);
    if (height) $svg.attr('height', height);
  });
}
setSvgSize();