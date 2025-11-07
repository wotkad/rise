function validationTarget() {
  $(document.links)
    .filter(function () {
      return this.hostname !== window.location.hostname;
    })
    .each(function () {
      const $link = $(this);
      if (!$link.attr("target")) {
        $link.attr({
          target: "_blank",
          rel: "noopener noreferrer",
        });
      }
    });
}
validationTarget();