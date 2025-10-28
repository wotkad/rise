import barba from "@barba/core";
import barbaPrefetch from "@barba/core";
import gsap from "gsap";
import routingFunctions from "@routing/routing-functions";

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

async function initBarba() {
  barba.use(barbaPrefetch);

  // Если header находится в barba-wrapper, то скрипт ниже не нужен.
  barba.hooks.beforeLeave((data) => {
    const nextPath = data.next.url.href;
    const nextItem = $(`a[href="${nextPath}"]`);
    $(`.${"active"}`).removeClass("active");
    nextItem.addClass("active");
  });

  barba.init({
    timeout: 1000000,
    preventRunning: true,
    requestError: (trigger, action, url, response) => {
      if (action === "click" && response.status && response.status === 404) {
        barba.go("/404");
      }
      return false;
    },
    transitions: [
      {
        name: "fade",
        leave({ current }) {
          return gsap.to(current.container, { opacity: 0, duration: 0.3 });
        },
        enter({ next }) {
          let $newPageHead = $('<head />').html(
            $.parseHTML(
              next.html.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0],
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
          gsap.set(next.container, { opacity: 0 });
          return gsap.to(next.container, { opacity: 1, duration: 0.3 });
        },
        afterLeave({ current }) {
          $('body,html').animate({scrollTop: 0}, 0);
          current.container.remove();
        },
      },
    ],
  });
}

initBarba();