/*
Документація по роботі у шаблоні: 
Документація слайдера: https://swiperjs.com/
Сніппет(HTML): swiper
*/

// Підключаємо слайдер Swiper з node_modules
// При необхідності підключаємо додаткові модулі слайдера, вказуючи їх у {} через кому
// Приклад: { Navigation, Autoplay }
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, FreeMode, Thumbs, EffectFade } from 'swiper/modules';

// Ініціалізація слайдерів
function initSliders() {
  if (document.querySelector('.header-bottom__nav')) {
    initScrollSlider(document.querySelector('.header-bottom__nav'));
  }

  if (document.querySelector('.cards-top__categories ')) {
    const options = {
      spaceBetween: 7,
      breakpoints: {
        768: {
          spaceBetween: 10,
        },
        992: {
          spaceBetween: 19,
        },
      },
    };
    initScrollSlider(document.querySelector('.cards-top__categories '), options);
  }

  //========================================================================================================================================================
  if (document.querySelector('.banners__slider-block .banners__slider')) {
    document.querySelectorAll('.banners__slider-block').forEach((sliderBlock) => {
      const slider = sliderBlock.querySelector('.banners__slider');
      const prevButton = sliderBlock.querySelector('.banners__button-prev');
      const nextButton = sliderBlock.querySelector('.banners__button-next');
      const pagination = sliderBlock.querySelector('.banners__pagination');

      const bannerSlider = new Swiper(slider, {
        modules: [Navigation, Pagination],
        watchOverflow: true,
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 30,
        autoHeight: true,
        preloadImages: true,
        lazyLoading: true,
        lazyPreloadPrevNext: 1,
        watchSlidesVisibility: true,
        speed: 800,
        init: false,

        pagination: {
          el: pagination,
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          prevEl: prevButton,
          nextEl: nextButton,
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            lazyPreloadPrevNext: 1,
            spaceBetween: 20,
            speed: 500,
          },

          540: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            lazyPreloadPrevNext: 2,
            spaceBetween: 20,
            speed: 800,
          },

          768: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            lazyPreloadPrevNext: 3,
            spaceBetween: 20,
            speed: 800,
          },

          992: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            lazyPreloadPrevNext: 1,
            spaceBetween: 30,
            speed: 800,
          },
        },
      });

      // lock > breakpoint > unlock
      bannerSlider.on('breakpoint', (e) => {
        setTimeout(() => {
          if (e.isLocked) return;
          const emptySlides = e.el.querySelectorAll('.swiper-slide-blank').length;
          const filledSlides = e.slides.length - emptySlides;

          if (
            filledSlides === e.params.slidesPerView ||
            filledSlides >= e.params.slidesPerView + e.params.slidesPerGroup
          ) {
            e.slides.forEach((slide) => {
              if (slide.classList.contains('swiper-slide-blank')) {
                slide.remove();
              }
            });
          }
        }, 0);
      });

      bannerSlider.on('lock', (e) => {
        e.params.loop = false;
        e.params.loopAddBlankSlides = false;
      });
      bannerSlider.on('unlock', (e) => {
        e.params.loop = true;
        e.params.loopAddBlankSlides = true;
      });
      bannerSlider.on('init', (e) => {
        if (e.slides.length > e.params.slidesPerView) {
          e.params.loop = true;
          e.params.loopAddBlankSlides = true;
        } else {
          e.params.loop = false;
          e.params.loopAddBlankSlides = false;
        }
      });
      bannerSlider.init();
    });
  }

  const productsSliders = document.querySelectorAll('.products__slider');
  if (productsSliders.length) {
    const swiperOptions = {
      modules: [Navigation, Pagination],
      observer: true,
      watchOverflow: true,
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 10,
      autoHeight: false,
      rewind: true,

      pagination: {
        el: '.products__pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        prevEl: '.products__button-prev',
        nextEl: '.products__button-next',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        440: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        700: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        992: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
        1100: {
          slidesPerView: 5,
          slidesPerGroup: 5,
        },
      },
    };
    initSlidersObserver(productsSliders, swiperOptions);
  }

  const weekProductsSliders = document.querySelectorAll('.week-products__slider');
  if (weekProductsSliders.length) {
    const swiperOptions = {
      modules: [Navigation, Pagination],
      observer: true,
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 10,
      watchOverflow: true,
      autoHeight: false,
      rewind: true,

      pagination: {
        el: '.week-products__pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        prevEl: '.week-products__button-prev',
        nextEl: '.week-products__button-next',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          //autoHeight: true,
        },
        440: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          //autoHeight: false,
        },
        700: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        992: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        1110: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
      },
    };
    initSlidersObserver(weekProductsSliders, swiperOptions);
  }

  const cardItemsWrappers = document.querySelectorAll('[data-card-items]');
  if (cardItemsWrappers.length) {
    let options = { rootMargin: '100px 0px 100px 0px' };
    let observer = new IntersectionObserver(wrappersHandleIntersect, options);
    cardItemsWrappers.forEach((cardItemsWrapper) => observer.observe(cardItemsWrapper));

    function wrappersHandleIntersect(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let cardObserver = new IntersectionObserver(cardsHandleIntersect, options);
          let cardSliders = entry.target.querySelectorAll('.card__slider');
          cardSliders.forEach((cardSlider) => cardObserver.observe(cardSlider));

          function cardsHandleIntersect(entries) {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                new Swiper(entry.target, {
                  modules: [EffectFade, Pagination],
                  observer: true,
                  observeParents: true,
                  observeSlideChildren: true,
                  slidesPerView: 'auto',
                  spaceBetween: 30,
                  preloadImages: false,
                  lazyLoading: true,
                  lazyPreloadPrevNext: 1,
                  effect: 'fade',
                  rewind: true,

                  fadeEffect: {
                    crossFade: true,
                  },
                  pagination: {
                    el: '.card__pagination',
                    clickable: true,
                  },
                });
                cardObserver.unobserve(entry.target);
              }
            });
          }
        }
      });
    }
  }

  //========================================================================================================================================================
  const categoryTabs = document.querySelectorAll('.category-tabs__body');
  if (categoryTabs.length) {
    categoryTabs.forEach((categoryTab) => {
      new Swiper(categoryTab.querySelector('.category-tabs__slider'), {
        modules: [Navigation],
        direction: 'horizontal',
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        spaceBetween: 10,
        loop: true,
        navigation: {
          prevEl: categoryTab.querySelector('.category-tabs__button-prev'),
          nextEl: categoryTab.querySelector('.category-tabs__button-next'),
        },
        breakpoints: {
          768: {
            spaceBetween: 15,
          },
          992: {
            spaceBetween: 20,
          },
        },
      });
    });
  }

  //========================================================================================================================================================
  const productThumbs = new Swiper('.product__thumbs-slider', {
    modules: [Scrollbar],
    observer: true,
    observeParents: true,
    spaceBetween: 10,
    slidesPerView: 3,
    direction: 'horizontal',
    watchSlidesProgress: true,
    freeMode: true,
    mousewheel: {
      releaseOnEdges: true,
    },
    scrollbar: {
      el: '.product__thumbs-scrollbar',
      draggable: true,
    },
    breakpoints: {
      320: {
        direction: 'horizontal',
        slidesPerView: 3,
      },
      360: {
        direction: 'horizontal',
        slidesPerView: 4,
      },
      480: {
        direction: 'horizontal',
        slidesPerView: 5,
      },
      768: {
        direction: 'vertical',
        slidesPerView: 4,
      },
    },
  });
  const productSlider = new Swiper('.product__slider', {
    modules: [Thumbs, Navigation],
    spaceBetween: 10,
    loop: true,
    navigation: {
      nextEl: '.product__thumbs-btn-next',
      prevEl: '.product__thumbs-btn-prev',
    },
    thumbs: {
      swiper: productThumbs,
    },
  });

  new Swiper('.product-tabs__navigation', {
    modules: [Scrollbar],
    observer: true,
    observeParents: true,
    slidesPerView: 'auto',
    slidesPerGroupAuto: true,
    spaceBetween: 7,
    freeMode: true,
    watchOverflow: true,
    scrollbar: {
      el: '.product-tabs__scrollbar',
      draggable: true,
    },
    breakpoints: {
      320: {
        spaceBetween: 7,
      },
      480: {
        spaceBetween: 10,
      },
    },
  });

  //========================================================================================================================================================
  function initScrollSlider(slider, customOptions = null) {
    const options = {
      modules: [Scrollbar, FreeMode],
      slidesPerView: 'auto',
      slidesPerGroupAuto: true,
      watchOverflow: true,
      freeMode: {
        enabled: true,
        momentum: false,
      },
      scrollbar: {
        el: slider.querySelector('.swiper-scrollbar'),
        draggable: true,
      },
      ...customOptions,
    };
    return new Swiper(slider, options);
  }

  function initSlidersObserver(sliders, swiperOptions, observerOptions = null) {
    let observer = new IntersectionObserver(
      handleIntersect,
      observerOptions ? observerOptions : { rootMargin: '100px 0px 100px 0px' },
    );
    function handleIntersect(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let slider = entry.target;
          new Swiper(slider, swiperOptions);
          initCardSlidersInSlider(slider);
          observer.unobserve(entry.target);
        }
      });
    }
    sliders.forEach((slider) => observer.observe(slider));
    return observer;
  }

  function initCardSlidersInSlider(slider) {
    let options = { root: slider };
    let observer = new IntersectionObserver(handleIntersect, options);

    let cardSliders = slider.querySelectorAll('.card__slider');
    cardSliders.forEach((cardSlider) => observer.observe(cardSlider));

    function handleIntersect(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          new Swiper(entry.target, {
            modules: [EffectFade, Pagination],
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            slidesPerView: 'auto',
            spaceBetween: 30,
            preloadImages: false,
            lazyLoading: true,
            lazyPreloadPrevNext: 1,
            effect: 'fade',
            rewind: true,
            nested: true,

            fadeEffect: {
              crossFade: true,
            },
            pagination: {
              el: '.card__pagination',
              clickable: true,
            },
          });

          observer.unobserve(entry.target);
        }
      });
    }
  }
}

window.addEventListener('load', function (event) {
  initSliders();
});
