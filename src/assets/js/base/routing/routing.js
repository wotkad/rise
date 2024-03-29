import barba from "@barba/core";
import barbaPrefetch from "@barba/core";
import gsap from "gsap";
import routingFunctions from "./routing-functions";

barba.use(barbaPrefetch);

// Если header находится в barba-wrapper, то скрипт ниже не нужен.
barba.hooks.beforeLeave((data) => {
  const nextPath = data.next.url.href;
  const nextItem = $(`a[href="${nextPath}"]`);
  $(`.${"active"}`).removeClass("active");
  nextItem.addClass("active");
});

barba.init({
  preventRunning: true,
  requestError: (trigger, action, url, response) => {
    if (action === "click" && response.status && response.status === 404) {
      barba.go("/404");
    }
    return false;
  },
  transitions: [
    {
      name: "opacity-transition",
      sync: true,
      beforeLeave(data) {
        $('body,html').animate({scrollTop: 0}, 0);
        $(data.current.container).hide();
        gsap.to(data.current.container, {
          opacity: 0,
          duration: .4
        });
      },
      enter(data) {
        let $newPageHead = $('<head />').html(
          $.parseHTML(
            data.next.html.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0],
            document,
            true
          )
        );
        let headTags = [
          "meta[name='keywords']",
          "meta[name='description']",
          "meta[property='og:title']",
          "meta[property='og:description']",
          "meta[property='og:type']",
          "meta[property='og:image']",
          "meta[property='og:url']",
        ].join(',');
        $('head').find(headTags).remove();
        $newPageHead.find(headTags).appendTo('head');
        routingFunctions();
        return gsap.from(data.next.container, {
          opacity: 0,
          duration: .4
        });
      },
    },
  ],
});