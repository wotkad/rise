import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export default function ctaV1Slider() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const $section = $('.cta-v1');
    const $items = $('.cta-v1__item');
    const $dots = $('.cta-v1__pagination');

    if (!$section.length || !$items.length) return;

    const totalItems = $items.length;
    let currentIndex = 0;
    const SCROLL_PER_ITEM = 600;
    const TRANSITION_DISTANCE = 300;
    const totalScrollDistance = SCROLL_PER_ITEM * totalItems;

    // Инициализация слайдов
    $items.each(function(index) {
        const $item = $(this);
        gsap.set($item, {
            opacity: index === 0 ? 1 : 0,
            zIndex: totalItems - index
        });

        const $image = $item.find('.cta-v1__image');
        const $content = $item.find('.cta-v1__content');

        gsap.set($image, {
            opacity: index === 0 ? 1 : 0
        });

        gsap.set($content, {
            opacity: index === 0 ? 1 : 0,
        });
    });

    // Пагинация
    function updateDots(index) {
        $dots.find('.cta-v1__dot').each(function(dotIndex) {
            const $dot = $(this);
            if (dotIndex === index) {
                $dot.css({ background: '#fff', transform: 'scale(1.3)' });
            } else if (dotIndex < index) {
                $dot.css({ background: 'rgba(255,255,255,.6)', transform: 'scale(.8)' });
            } else {
                $dot.css({ background: 'rgba(255,255,255,.3)', transform: 'scale(1)' });
            }
        });
    }

    // Переход по пагинации
    function goToItem(index) {
        const trigger = ScrollTrigger.getById('cta-slider');
        if (!trigger) return;
        gsap.to(window, {
            scrollTo: { y: trigger.start + (SCROLL_PER_ITEM * index) },
            duration: 1,
            ease: "power2.inOut"
        });
    }

    // Создание точек
    for (let i = 0; i < totalItems; i++) {
        const $dot = $('<button class="cta-v1__dot"></button>');
        $dot.on('click', () => goToItem(i));
        $dots.append($dot);
    }

    updateDots(0);

    // Главный timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            id: 'cta-slider',
            trigger: $section[0],
            start: 'top top',
            end: `+=${totalScrollDistance}px`,
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const newIndex = Math.min(
                    Math.floor((self.scroll() - self.start) / SCROLL_PER_ITEM),
                    totalItems - 1
                );
                if (newIndex !== currentIndex) {
                    currentIndex = newIndex;
                    updateDots(currentIndex);
                }
            }
        }
    });

    // Анимация переходов
    for (let i = 0; i < totalItems - 1; i++) {
        const $current = $items.eq(i);
        const $next = $items.eq(i + 1);
        const $currentImage = $current.find('.cta-v1__image');
        const $currentContent = $current.find('.cta-v1__content');
        const $nextImage = $next.find('.cta-v1__image');
        const $nextContent = $next.find('.cta-v1__content');
        const start = (i + 1) * SCROLL_PER_ITEM - TRANSITION_DISTANCE;

        tl
            .to($current, { opacity: 0, duration: TRANSITION_DISTANCE, ease: "none" }, start)
            .to($currentImage, { opacity: 0, duration: TRANSITION_DISTANCE, ease: "none" }, start)
            .to($currentContent, { opacity: 0, duration: TRANSITION_DISTANCE, ease: "none" }, start)
            .to($next, { opacity: 1, duration: TRANSITION_DISTANCE, ease: "none" }, start)
            .to($nextImage, { opacity: 1, duration: TRANSITION_DISTANCE, ease: "none" }, start)
            .to($nextContent, { opacity: 1, duration: TRANSITION_DISTANCE, ease: "power2.out" }, start);
    }

    // Дополнительный скролл после последнего слайда
    tl.to({}, { duration: SCROLL_PER_ITEM, ease: "none" });

    // Видимость пагинации
    function toggleDots(show) {
        if (show) {
            $dots.css({
                'display': 'flex',
                'opacity': '1',
                'transition': 'opacity 0.3s ease'
            });
        } else {
            $dots.css({
                'opacity': '0',
                'transition': 'opacity 0.3s ease',
            });
            // Скрываем display после завершения анимации opacity
            setTimeout(() => {
                if ($dots.css('opacity') === '0') {
                    $dots.css('display', 'none');
                }
            }, 300);
        }
    }

    ScrollTrigger.create({
        trigger: $section[0],
        start: 'top top',
        end: `+=${totalScrollDistance}px`,
        onEnter: () => toggleDots(true),
        onLeave: () => toggleDots(false),
        onEnterBack: () => toggleDots(true),
        onLeaveBack: () => toggleDots(false)
    });

    setTimeout(() => ScrollTrigger.refresh(), 100);
    $(window).on('resize', () => ScrollTrigger.refresh());
    $(window).on('beforeunload', () => $dots.empty());
}

ctaV1Slider();