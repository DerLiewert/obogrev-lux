// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from './functions.js';
// Підключення списку активних модулів
import { flsModules } from './modules.js';
import YTPlayer from 'youtube-player';

const matchMediaMax992 = window.matchMedia(`(max-width: 991.98px)`);

let bodyLockStatus = false;
let bodyUnlock = (delay = 0) => {
  setTimeout(() => {
    if (!bodyLockStatus) return;

    const lockPaddingElements = document.querySelectorAll('[data-lp]');

    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.removeProperty('padding-right');
    });
    document.body.style.removeProperty('padding-right');
    document.documentElement.classList.remove('lock');
    bodyLockStatus = false;
  }, delay);
};

let bodyLock = (delay = 0) => {
  setTimeout(() => {
    if (bodyLockStatus) return;

    const lockPaddingElements = document.querySelectorAll('[data-lp]');
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px';

    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    });

    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add('lock');
    bodyLockStatus = true;
  }, delay);
};

let bodyLockToggle = (delay = 0) => {
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};

//========================================================================================================================================================
//=== Переміщення блоку контактів та авторизації з ПК-версії хедера в бургеp меню на екрані <992 =====================================================================
//========================================================================================================================================================
function movingHeaderBlocks() {
  const header = document.querySelector('.header');
  if (!header) return;

  matchMediaMax992.addEventListener('change', onMatchMediaChange);
  if (matchMediaMax992.matches) onMatchMediaChange(matchMediaMax992);

  function onMatchMediaChange(e) {
    const topInner = header.querySelector('.header-top__inner');
    const middleInner = header.querySelector('.header-middle__inner');
    const headerTablet = header.querySelector('.header-tablet');
    const contacts = header.querySelector('.header-middle__contacts');
    const auth = header.querySelector('.header-top__auth');

    if (e.matches) {
      headerTablet.insertAdjacentElement('beforeend', contacts);
      headerTablet.insertAdjacentElement('afterbegin', auth);
    } else {
      middleInner.insertAdjacentElement('beforeend', contacts);
      topInner.insertAdjacentElement('beforeend', auth);
    }
  }
}
movingHeaderBlocks();

//========================================================================================================================================================
//=== Open/close бергер меню =============================================================================================================================
//========================================================================================================================================================
function burderMenu() {
  const burgerBtn = document.querySelector('.burger-icon');
  if (!burgerBtn) return;

  burgerBtn.addEventListener('click', onBurgerClick);

  function onBurgerClick() {
    let activeMenuSpollers = [];
    if (document.body.classList.contains('menu-open')) {
      activeMenuSpollers = document.querySelectorAll('.header-tablet__menu .menu__title._active');
    }

    document.body.classList.toggle('menu-open');
    bodyLockToggle();

    if (!activeMenuSpollers.length) return;

    activeMenuSpollers.forEach((activeMenu) => {
      activeMenu.classList.remove('_active');
      slideUp(activeMenu.nextElementSibling);
    });
  }

  matchMediaMax992.addEventListener('change', (e) => {
    if (e.matches) return;

    document.body.classList.remove('menu-open');
    bodyUnlock();
  });
}
burderMenu();

//========================================================================================================================================================
//=== Махінації з хедером при скролі =====================================================================================================================
//========================================================================================================================================================
const header = document.querySelector('.header');
const headerInner = document.querySelector('.header__inner');
const headerTop = document.querySelector('.header-top');
const headerMiddle = header.querySelector('.header-middle');
const headerBottom = header.querySelector('.header-bottom');
const fixedPoint = document.querySelector('.header-fixed-point');
const secontdFixedPoint = document.querySelector('.header-second-fixed-point');

let isScrollTop = true;
let prevScrollY = 0;
const onScrollThrottle = throttle(onScroll, 250);

const fixedPointObserver = new IntersectionObserver(
  (entries) => {
    if (!entries[0].isIntersecting) {
      header.classList.add('_fixed');
      header.setAttribute('data-lp', '');
      headerTop.classList.add('_hidden');

      setHeaderHeight();
    } else {
      header.classList.remove('_fixed');
      header.removeAttribute('data-lp');
      headerTop.classList.remove('_hidden');

      setHeaderHeight();
    }
  },
  { threshold: 1 },
);
const secondFixedPointObserver = new IntersectionObserver(
  (entries) => {
    if (!entries[0].isIntersecting) {
      window.addEventListener('scroll', onScrollThrottle);
    } else {
      window.removeEventListener('scroll', onScrollThrottle);
    }
  },
  { threshold: 1 },
);

let prevHeaderTopHeight = 0;
const resizeHeaderTopObserver = new ResizeObserver((entries) => {
  const height = entries[0].borderBoxSize?.[0].blockSize;
  if (typeof height === 'number' && height !== prevHeaderTopHeight) {
    prevHeaderTopHeight = height;
    document.documentElement.style.setProperty('--fixed-point-top', headerTop.offsetHeight + 'px');
    secontdFixedPoint.style.top = headerTop.offsetHeight + headerBottom.offsetHeight + 'px';
  }
});

let prevHeaderHeight = 0;
const resizeHeaderObserver = new ResizeObserver((entries) => {
  const height = entries[0].borderBoxSize?.[0].blockSize;
  if (typeof height === 'number' && height !== prevHeaderHeight) {
    prevHeaderHeight = height;

    const { totalHeaderHeight, visibleHeaderHeight } = getHeaderHeight();

    document.querySelector('.header-wrapper').style.height = totalHeaderHeight + 'px';
    document.documentElement.style.setProperty('--header-height', visibleHeaderHeight + 'px');
    header.style.height = visibleHeaderHeight + 'px';
  }
});
resizeHeaderObserver.observe(headerInner);

matchMediaMax992.addEventListener('change', onChangeMedia);
onChangeMedia(matchMediaMax992);

function onChangeMedia(e) {
  if (e.matches) {
    fixedPointObserver.unobserve(fixedPoint);
    secondFixedPointObserver.unobserve(secontdFixedPoint);
    resizeHeaderTopObserver.unobserve(headerTop);
    window.removeEventListener('scroll', onScrollThrottle);

    header.classList.add('_fixed');
    header.setAttribute('data-lp', '');
    document.documentElement.style.removeProperty('--fixed-point-top');

    prevHeaderTopHeight = 0;
    prevHeaderHeight = 0;
  } else {
    fixedPointObserver.observe(fixedPoint);
    secondFixedPointObserver.observe(secontdFixedPoint);
    resizeHeaderTopObserver.observe(headerTop);
  }
}

function onScroll() {
  if (prevScrollY < scrollY && isScrollTop) {
    header.classList.add('_header-bottom-hidden');
    setHeaderHeight();
    isScrollTop = false;
  } else if (prevScrollY > scrollY && !isScrollTop) {
    header.classList.remove('_header-bottom-hidden');
    setHeaderHeight();
    isScrollTop = true;
  }
  prevScrollY = scrollY;
}

function throttle(func, ms) {
  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {
    if (isThrottled) {
      // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(function () {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

function getHeaderHeight() {
  const headerTopHeight = headerTop.offsetHeight;
  const headerMiddleHeight = headerMiddle.offsetHeight;
  const headerBottomHeight = headerBottom.offsetHeight;
  const totalHeaderHeight = headerTopHeight + headerMiddleHeight + headerBottomHeight;
  let visibleHeaderHeight = headerMiddleHeight;
  if (!headerTop.classList.contains('_hidden')) {
    visibleHeaderHeight += headerTopHeight;
  }
  if (!header.classList.contains('_header-bottom-hidden')) {
    visibleHeaderHeight += headerBottomHeight;
  }
  return { totalHeaderHeight, visibleHeaderHeight };
}

function setHeaderHeight() {
  const visibleHeaderHeight = getHeaderHeight().visibleHeaderHeight;
  document.documentElement.style.setProperty('--header-height', visibleHeaderHeight + 'px');
  header.style.height = visibleHeaderHeight + 'px';
}

//========================================================================================================================================================
//=== При ховері на header-bottom__nav-item показувати submenu.
//=== Оскільки header-bottom__nav зроблений у вигляды слайдера (свайпера) для адаптиву та можливості збільшення пунктів меню і має overflow: hidden, то submenu при position: absolute не буде видно.
//=== Тому при наведені на header-bottom__nav-item відбувається переміщення його submenu у header-bottom__inner і позиціонується абсолютно відносно нього.
//=== При виході миші з header-bottom__nav-item submenu переміщується з header-bottom__inner назад у header-bottom__nav-item
//========================================================================================================================================================
function headerBottomNavHover() {
  const headerBottomInner = document.querySelector('.header-bottom__inner');
  if (!headerBottomInner) return;

  let activeNavItem = null;
  let activeLink = null;
  let activeSubmenu = null;

  const visibleSubmenuArr = new Map();

  headerBottomInner.addEventListener('mouseover', (e) => {
    const navItem = e.target.closest('.header-bottom__nav-item');
    if (!navItem || navItem === activeNavItem) return;

    unsetActiveNavItem();

    activeNavItem = navItem;
    activeLink = activeNavItem.querySelector('.header-bottom__nav-link');
    activeSubmenu = activeNavItem.querySelector('.header-bottom__nav-submenu');

    if (!activeSubmenu) return;
    if (activeLink) activeLink.classList.add('_active');

    activeLink.addEventListener('mouseenter', bodyLock);
    activeLink.addEventListener('mouseleave', bodyUnlock);
    activeSubmenu.addEventListener('mouseenter', bodyLock);
    activeSubmenu.addEventListener('mouseleave', onSubmenuLeave);

    headerBottomInner.insertAdjacentElement('beforeend', activeSubmenu);

    // для плавного появления Submenu, добавляем класс _visible для него через нулевой setTimeout после его перемещения с header-bottom__nav-item у header-bottom__inner
    const timeoutId = setTimeout(() => {
      visibleSubmenuArr.get(timeoutId).classList.add('_visible');
      visibleSubmenuArr.delete(timeoutId);
    }, 0);

    visibleSubmenuArr.set(timeoutId, activeSubmenu);
  });

  headerBottomInner.addEventListener('mouseleave', () => {
    unsetActiveNavItem();
  });

  function onSubmenuLeave(e) {
    if (e.relatedTarget?.closest('.header-bottom__nav-item') !== activeNavItem) {
      unsetActiveNavItem();
    }
    bodyUnlock();
  }

  function unsetActiveNavItem() {
    if (activeLink) activeLink.classList.remove('_active');
    if (activeNavItem && activeSubmenu) {
      activeSubmenu.classList.remove('_visible');
      activeNavItem.insertAdjacentElement('beforeend', activeSubmenu);

      activeLink.removeEventListener('mouseenter', bodyLock);
      activeLink.removeEventListener('mouseleave', bodyUnlock);
      activeSubmenu.removeEventListener('mouseenter', bodyLock);
      activeSubmenu.removeEventListener('mouseleave', onSubmenuLeave);
    }
    activeNavItem = activeLink = activeSubmenu = null;
  }
}
headerBottomNavHover();

//========================================================================================================================================================
//=== Відстеження зміни висоти tapbar ====================================================================================================================
//========================================================================================================================================================
function tapbar() {
  const tapbarWrapper = document.querySelector('.tapbar-wrapper');
  if (!tapbarWrapper) return;

  const tapbar = tapbarWrapper.querySelector('.tapbar');
  let prevTapbarHeight = 0;

  const resizeTapbarObserver = new ResizeObserver((entries) => {
    const height = entries[0].borderBoxSize[0].blockSize;
    if (typeof height === 'number' && height !== prevTapbarHeight) {
      prevTapbarHeight = height;
      tapbarWrapper.style.height = height + 'px';
      document.documentElement.style.setProperty('--tapbar-height', height + 'px');
    }
  });

  resizeTapbarObserver.observe(tapbar);

  matchMediaMax992.addEventListener('change', onChangeMedia);
  onChangeMedia(matchMediaMax992);

  function onChangeMedia(e) {
    if (e.matches) {
      resizeTapbarObserver.observe(tapbar);
    } else {
      resizeTapbarObserver.unobserve(tapbar);
      tapbarWrapper.style.removeProperty('height');
      document.documentElement.style.removeProperty('--tapbar-height');
      prevTapbarHeight = 0;
    }
  }
}
tapbar();

//========================================================================================================================================================
//======= Popup ==========================================================================================================================================
//========================================================================================================================================================
document.addEventListener('click', (e) => {
  const target = e.target;
  const btnOpen = target.closest('[data-popup-open]');

  if (btnOpen) {
    const popupId = btnOpen.getAttribute('data-popup-open');
    e.preventDefault();
    openPopup(popupId);
    return;
  }

  const popup = target.closest('[data-popup]');
  if (!popup) return;

  const btnClose = target.closest('[data-popup-close]');
  const popupContent = target.closest('[data-popup-content]');
  if (btnClose || !popupContent) {
    closePopup(popup);
  }
});

function openPopup(id) {
  const popup = document.querySelector(id);
  popup.classList.add('_show-popup');
  bodyLock();
  document.dispatchEvent(new Event('popup-open'));
}
function closePopup(popup) {
  popup.classList.remove('_show-popup');
  bodyUnlock();
  popup.dispatchEvent(new Event('popup-close'));
}

//========================================================================================================================================================
//=== Спойлер / акордеон ============================================================================================================================================
//========================================================================================================================================================
function spollers() {
  const spollerBlocks = document.querySelectorAll('[data-spollers]');
  if (!spollerBlocks.length) return;

  spollerBlocks.forEach((spollerBlock) => {
    const spollerTitles = spollerBlock.querySelectorAll('[data-spoller]');
    const isOnlyOneSpoller = spollerBlock.hasAttribute('data-spollers-one');

    if (spollerBlock.getAttribute('data-spollers')) {
      const [mediaType, mediaSize] = spollerBlock.getAttribute('data-spollers').split(',');
      const mediaQuery = `(${mediaType}-width: ${mediaSize}px)`;
      const matchMedia = window.matchMedia(mediaQuery);

      if (matchMedia.matches) initSpollerBlock(spollerTitles);

      matchMedia.addEventListener('change', function () {
        initSpollerBlock(spollerTitles, matchMedia);
      });
    } else {
      initSpollerBlock(spollerTitles);
    }

    function initSpollerBlock(spollerTitles, matchMedia = false) {
      if (matchMedia.matches || !matchMedia) {
        spollerBlock.classList.add('_init-spollers');
        spollerTitles.forEach((spollerTitle) => initSpoller(spollerTitle));
      } else {
        spollerBlock.classList.remove('_init-spollers');
        spollerTitles.forEach((spollerTitle) => uninitSpoller(spollerTitle));
      }
    }
    function initSpoller(spollerTitle) {
      spollerTitle.addEventListener('click', onSpollerTitle);
      const spollerBody = spollerTitle.nextElementSibling;
      slideUp(spollerBody, 0);
    }
    function uninitSpoller(spollerTitle) {
      spollerTitle.removeEventListener('click', onSpollerTitle);
      spollerTitle.classList.remove('_spoller-open');
      const spollerBody = spollerTitle.nextElementSibling;
      slideDown(spollerBody, 0);
    }
    function onSpollerTitle(e) {
      const spollerTitle = e.currentTarget;
      const spollerBody = spollerTitle.nextElementSibling;
      if (spollerBody.hasAttribute('data-disabled')) return;

      if (spollerTitle.classList.contains('_spoller-open')) {
        spollerTitle.classList.remove('_spoller-open');
        slideUp(spollerBody);
      } else {
        const activeSpoller = spollerBlock.querySelector('[data-spoller]._spoller-open');
        if (isOnlyOneSpoller && activeSpoller) {
          const activeSpollerBody = activeSpoller.nextElementSibling;
          if (activeSpollerBody.hasAttribute('data-disabled')) return;
          activeSpoller.classList.remove('_spoller-open');
          slideUp(activeSpollerBody);
        }

        spollerTitle.classList.add('_spoller-open');
        slideDown(spollerBody);
      }
    }
  });
}
spollers();

// Функції slideUp та slideDown для плавного згортання та розкриття елемента (тіло спойлера)
function slideUp(el, duration = 500) {
  if (el.hasAttribute('data-disabled')) return;
  el.setAttribute('data-disabled', '');
  el.style.overflow = 'hidden';
  const height = el.offsetHeight;

  el.style.height = height + 'px';
  el.offsetHeight;
  el.style.transitionProperty = 'padding, margin, height';
  el.style.transitionDuration = duration + 'ms';
  el.style.height = 0;
  el.style.paddingTop = 0;
  el.style.paddingBottom = 0;
  el.style.marginTop = 0;
  el.style.marginBottom = 0;

  setTimeout(() => {
    el.hidden = true;
    el.style.removeProperty('height');
    el.style.removeProperty('overflow');
    el.style.removeProperty('padding-top');
    el.style.removeProperty('padding-bottom');
    el.style.removeProperty('margin-top');
    el.style.removeProperty('margin-bottom');
    el.style.removeProperty('transition-property');
    el.style.removeProperty('transition-duration');
    el.removeAttribute('data-disabled');
  }, duration);
}
function slideDown(el, duration = 500) {
  if (el.hasAttribute('data-disabled')) return;
  el.setAttribute('data-disabled', '');
  el.hidden = false;
  const height = el.offsetHeight;
  el.style.overflow = 'hidden';
  el.style.height = 0;
  el.style.paddingTop = 0;
  el.style.paddingBottom = 0;
  el.style.marginTop = 0;
  el.style.marginBottom = 0;

  el.offsetHeight;
  el.style.transitionProperty = 'padding, margin, height';
  el.style.transitionDuration = duration + 'ms';
  el.style.height = height + 'px';
  el.style.removeProperty('padding-top');
  el.style.removeProperty('padding-bottom');
  el.style.removeProperty('margin-top');
  el.style.removeProperty('margin-bottom');

  setTimeout(() => {
    el.style.removeProperty('overflow');
    el.style.removeProperty('height');
    el.style.removeProperty('transition-property');
    el.style.removeProperty('transition-duration');
    el.removeAttribute('data-disabled');
  }, duration);
}

//========================================================================================================================================================
//=== Set rating active stars ==========================================================================================
//========================================================================================================================================================
function setRatingStars() {
  const ratingStarsActive = document.querySelectorAll('[data-rating]');

  ratingStarsActive.forEach((item) => {
    const starsFullWidth = item.offsetWidth;
    const starsGap = 2; // отступ между звёздами на картинке в px
    const value = item.dataset.rating ? +item.dataset.rating : 0; // оценка товара 0-5
    const starsWidthWithoutGap = starsFullWidth - 4 * starsGap; // длина звёздочек на картинке без отступов

    const fillStars = (starsWidthWithoutGap / 5) * value;
    const fillGap = value > 0 ? Math.ceil(value - 1) * starsGap : 0;
    const widthPercent = ((fillStars + fillGap) * 100) / starsFullWidth;
    item.style.width = widthPercent + '%';
  });
}
setRatingStars();

//========================================================================================================================================================
//=== Функціонал counter'а (картка товару) ===============================================================================================================
//========================================================================================================================================================
const counters = document.querySelectorAll('[data-counter]');
if (counters.length) {
  counters.forEach((counter) => {
    const input = counter.querySelector('[data-counter-input]');
    const plus = counter.querySelector('[data-counter-plus]');
    const minus = counter.querySelector('[data-counter-minus]');
    const minValue = +input.getAttribute('min');
    const maxValue = +input.getAttribute('max');

    plus.addEventListener('click', () => {
      const value = +input.value + 1;
      if (maxValue && value >= maxValue) {
        input.value = maxValue;
      } else {
        input.value = value;
      }
    });
    minus.addEventListener('click', () => {
      const value = +input.value - 1;
      if (minValue && value <= minValue) {
        input.value = minValue;
      } else {
        input.value = value;
      }
    });
    input.addEventListener('input', (e) => {
      const value = +e.currentTarget.value;
      if (minValue && value <= minValue) {
        input.value = minValue;
        return;
      }
      if (maxValue && value >= maxValue) {
        input.value = maxValue;
        return;
      }
      input.value = value;
    });
  });
}

// //========================================================================================================================================================
// //=== Filters (Блок news на главной)===============================================================================================================================================
// //========================================================================================================================================================
function filters() {
  // data-filter - для оболочки блока "фильтр"
  // data-filter-category="название" - для категории (название категории фильтра без пробела )
  // data-filter-item="название" - для item, который будет фильтроваться (указываем к какой категорий принадлежит item, можно несколько через пробел)
  // для data-filter-category и data-filter-item может быть указано несколько значений через запятую без пробела "articles,reviews"

  // _active - класс, который задается активной категории фильтра (по умолчанию первой категории в списке)
  // _filter-hidden - класс для неактитвных items
  const filters = document.querySelectorAll('[data-filter]');
  if (!filters.length) return;

  filters.forEach((filterBlock) => {
    const categories = filterBlock.querySelectorAll('[data-filter-category]');
    const items = filterBlock.querySelectorAll('[data-filter-item]');
    let activeCategory = filterBlock.querySelector('[data-filter-category]._active');

    if (!activeCategory) {
      activeCategory = categories[0];
      activeCategory.classList.add('_active');
    }

    showItemsByCategory(activeCategory, items);

    categories.forEach((category) => {
      category.addEventListener('click', onCategory);
    });

    function onCategory(e) {
      const category = e.currentTarget;
      category.classList.add('_active');
      activeCategory.classList.remove('_active');
      activeCategory = category;
      showItemsByCategory(activeCategory, items);
    }
  });

  function showItemsByCategory(activeCategory, items) {
    if (activeCategory.dataset.filterCategory === '*') {
      items.forEach((item) => item.classList.remove('_filter-hidden'));
      return;
    }

    const activeCategories = activeCategory.dataset.filterCategory.split(','); // для "Статьи и обзоры" задано 2 значения data-filter-category="articles,reviews"
    items.forEach((item) => {
      let isShow = false;

      // для data-filter-item также может быть задано несколько значение / проверяем, соответствует ли хотя бы одно из них активной категории
      for (const category of item.dataset.filterItem.split(',')) {
        if (activeCategories.includes(category)) {
          isShow = true;
          break;
        }
      }

      if (isShow) {
        item.classList.remove('_filter-hidden');
      } else {
        item.classList.add('_filter-hidden');
      }
    });
  }
}
filters();

//========================================================================================================================================================
//=== Show more ==========================================================================================
//========================================================================================================================================================
function showMore() {
  const showmoreItems = document.querySelectorAll('[data-showmore]');
  if (!showmoreItems.length) return;

  showmoreItems.forEach((showmore) => {
    let showItems = showmore.getAttribute('data-showmore')
      ? +showmore.getAttribute('data-showmore')
      : 10;
    let step = showmore.getAttribute('data-showmore-step');
    step = step ? +step : 0;

    const items = showmore.querySelectorAll('[data-showmore-items] > *');
    const button = showmore.querySelector('[data-showmore-button]');

    if (items.length > showItems) {
      for (let i = showItems; i < items.length; i++) {
        items[i].style.display = 'none';
      }
    }

    button.addEventListener('click', () => {
      if (showItems >= items.length) return;
      if (!step) {
        for (let i = showItems; i < items.length; i++) {
          items[i].style.removeProperty('display');
        }
        button.style.display = 'none';
        return;
      }

      showItems += step;
      const length = showItems < items.length ? showItems : items.length;

      for (let i = showItems - step; i < length; i++) {
        items[i].style.removeProperty('display');
      }
      if (showItems >= items.length) button.style.display = 'none';
    });
  });
}
showMore();

//========================================================================================================================================================
//==== Відкриття/закриття сайдбару з фільтрацією товарів на мобільних пристроях (filterBtn з'являється на моб.) ==========================================
//========================================================================================================================================================
function sidebarOpenClose() {
  const sidebar = document.querySelector('.sidebar');

  if (!sidebar) return;
  const closeBtn = sidebar.querySelector('.sidebar__close-btn');
  const filterBtn = document.querySelector('.cards-top__filter-btn');

  filterBtn?.addEventListener('click', () => {
    document.documentElement.classList.add('sidebar-open');
    bodyLock();
  });
  closeBtn?.addEventListener('click', closeSidebar);

  matchMediaMax992.addEventListener('change', (e) => {
    if (e.matches) return;
    closeSidebar();
  });

  function closeSidebar() {
    document.documentElement.classList.remove('sidebar-open');
    bodyUnlock();
  }
}
sidebarOpenClose();

//========================================================================================================================================================
//=== sidebar__help =====================================================================================================================================================
//========================================================================================================================================================
function initSidebarHelpItems() {
  const sidebarHelpItems = document.querySelectorAll('.sidebar__help');

  sidebarHelpItems.forEach((helpItem) => {
    slideUp(helpItem.querySelector('.sidebar__help-content'));
    helpItem.addEventListener('click', (e) => {
      e.stopPropagation();

      const helpContent = helpItem.querySelector('.sidebar__help-content');
      if (!helpContent.innerHTML) {
        helpContent.insertAdjacentHTML(
          'beforeend',
          'Нет никакой информации <span style="white-space: nowrap;">:(</span>',
        );
      }

      if (window.innerWidth < 992) {
        const textPopup = document.querySelector('#help-popup [data-popup-text]');
        textPopup.innerHTML = helpContent.innerHTML;
        openPopup('#help-popup');
      } else {
        if (helpContent.classList.contains('_open')) {
          slideUp(helpContent);
          helpContent.classList.remove('_open');
        } else {
          slideDown(helpContent);
          helpContent.classList.add('_open');
        }
      }
    });
  });
}
initSidebarHelpItems();

//========================================================================================================================================================
//=== Відображення карток у списку товарів: у вигляді сітки або рядків (відображається додаткова інформація про товар) ===================================
//========================================================================================================================================================
function cardsView() {
  const cardWrapper = document.querySelector('.cards__items');
  const rowsBtn = document.querySelector('.cards-top__view--rows');
  const gridBtn = document.querySelector('.cards-top__view--grid');

  if (!cardWrapper && !rowsBtn && !gridBtn) return;

  gridBtn.classList.add('_active');

  rowsBtn.addEventListener('click', setCardsRow);
  gridBtn.addEventListener('click', setCardsGrid);

  const matchMedia600 = window.matchMedia(`(max-width: 599.98px)`);
  matchMedia600.addEventListener('change', () => {
    if (matchMedia.matches) return;
    setCardsGrid();
  });

  function setCardsRow() {
    cardWrapper.classList.add('_rows');
    rowsBtn.classList.add('_active');
    gridBtn.classList.remove('_active');

    const cards = cardWrapper.querySelectorAll('.card');
    cards.forEach((card) => {
      const cardHeader = card.querySelector('.card__header');
      const cardBottom = card.querySelector('.card__bottom');
      cardBottom.insertAdjacentElement('afterbegin', cardHeader);
    });
  }
  function setCardsGrid() {
    cardWrapper.classList.remove('_rows');
    gridBtn.classList.add('_active');
    rowsBtn.classList.remove('_active');

    const cards = cardWrapper.querySelectorAll('.card');
    cards.forEach((card) => {
      const cardHeader = card.querySelector('.card__header');
      const cardTop = card.querySelector('.card__top');
      cardTop.insertAdjacentElement('afterbegin', cardHeader);
    });
  }
}
cardsView();

//========================================================================================================================================================
//======== goto ==========================================================================================================================================
//========================================================================================================================================================

function goto() {
  // data-goto - указать ID / класс блока
  // data-goto-header - учитывать header
  const gotoLinks = document.querySelectorAll('[data-goto]');
  if (!gotoLinks.length) return;

  gotoLinks.forEach((gotoLink) => {
    const withHeader = gotoLink.hasAttribute('data-goto-header');
    let headerFullHeight = 0;
    let headerTopHeight = 0;

    gotoLink.addEventListener('click', (e) => {
      e.preventDefault();

      const gotoTargetEl = document.querySelector(gotoLink.dataset.goto);
      if (!gotoTargetEl) return;

      let targetElTop = gotoTargetEl.getBoundingClientRect().top + window.scrollY;

      if (withHeader) {
        headerFullHeight = document.querySelector('header').offsetHeight;
        headerTopHeight = document.querySelector('.header-top').offsetHeight;
      }

      window.scrollTo({
        top: targetElTop - headerFullHeight + headerTopHeight,
        behavior: 'smooth',
      });

      //===========================================================================
      const gotoTab = document.querySelector(gotoLink.dataset.gotoTab);
      if (!gotoTab) return;

      const activeTitle = gotoTab
        .closest('[data-tabs]')
        .querySelector('[data-tabs-titles] ._active');
      activeTitle.classList.remove('_active');
      gotoTab
        .closest('[data-tabs]')
        .querySelector(`[data-tabs-body] > ${activeTitle.getAttribute('for')}`).style.display =
        'none';

      gotoTab
        .closest('[data-tabs]')
        .querySelector('[for="' + gotoLink.dataset.gotoTab + '"]')
        .classList.add('_active');
      gotoTab.style.removeProperty('display');
    });
  });
}
goto();

//========================================================================================================================================================
function tabs() {
  const tabs = document.querySelectorAll('[data-tabs]');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    const titles = tab.querySelectorAll('[data-tabs-titles] > *');
    const bodyItems = tab.querySelectorAll('[data-tabs-body] > *');

    let activeTitle = tab.querySelector('[data-tabs-titles] ._active');
    if (!activeTitle) {
      activeTitle = titles[0];
      activeTitle.classList.add('_active');
    }

    const activeTitleId = activeTitle.getAttribute('for')?.replace('#', '');
    bodyItems.forEach((item) => {
      if (activeTitleId !== item.getAttribute('id')) item.style.display = 'none';
    });

    titles.forEach((title) => {
      title.addEventListener('click', onTitleClick);
    });

    function onTitleClick(e) {
      e.preventDefault();
      const title = e.currentTarget;
      const body = tab.querySelector(`[data-tabs-body] > ${title.getAttribute('for')}`);
      if (!title.hasAttribute('for') || !body) return;

      activeTitle = tab.querySelector('[data-tabs-titles] ._active');
      activeTitle.classList.remove('_active');
      tab.querySelector(`[data-tabs-body] > ${activeTitle.getAttribute('for')}`).style.display =
        'none';

      title.classList.add('_active');
      body.style.removeProperty('display');
      activeTitle = title;
    }
  });
}
tabs();

//========================================================================================================================================================
//======== На странице Category отображать кнопки для изменения вида карточек товаров только на табе Товары. На табах Коллекции и Бренды прятать =========
//========================================================================================================================================================
const cardsTabBlock = document.querySelector('[data-tabs="cards-body"]');
if (cardsTabBlock) {
  cardsTabBlock.querySelector('[data-tabs-titles]')?.addEventListener('click', (e) => {
    const tab = e.target.closest('.cards-top__btn');
    if (!tab) return;

    if (tab.getAttribute('for') === '#goods') {
      cardsTabBlock.classList.add('_show-view-items');
    } else {
      cardsTabBlock.classList.remove('_show-view-items');
    }
  });
}

//========================================================================================================================================================
//======== Zoom image in prodact__slider ====================================================================================================================================
//========================================================================================================================================================
const zoomBlocks = document.querySelectorAll('[data-zoom]');
zoomBlocks.forEach((zoomBlock) => {
  zoomBlock.querySelectorAll('[data-zoom-image]').forEach((imgWrapper) => {
    const img = imgWrapper.querySelector('img');

    if (isMobile.any()) {
      const popupId = '#zoom-popup';
      const zoomPopup = document.querySelector(popupId);

      imgWrapper.addEventListener('click', () => {
        openPopup(popupId);

        const previewHolder = zoomPopup.querySelector('.zoom-popup__preview-holder');
        const previewSource = previewHolder.querySelector(`source`);
        const previewImg = previewHolder.querySelector(`img`);
        previewImg.setAttribute('src', img.getAttribute('src'));
        if (previewSource) previewSource.setAttribute('srcset', img.getAttribute('src'));

        let previewHolderRect = previewHolder.getBoundingClientRect();
        let previewImgRect = previewImg.getBoundingClientRect();

        let zoom = 1;
        let previewImgTop = 0,
          previewImgLeft = 0,
          previewImgWidth = 0,
          previewImgHeight = 0;

        let heightRatio = previewHolderRect.height / previewImg.offsetHeight;
        let widthRatio = previewHolderRect.width / previewImg.offsetWidth;

        if (heightRatio > widthRatio) {
          previewImgWidth = previewHolderRect.width;
          previewImgHeight = previewImg.offsetHeight * widthRatio;
        } else {
          previewImgWidth = previewImg.offsetWidth * heightRatio;
          previewImgHeight = previewHolderRect.height;
        }

        previewImgTop = (previewHolderRect.height - previewImgHeight) / 2;
        previewImgLeft = (previewHolderRect.width - previewImgWidth) / 2;

        let initialImgWidth = previewImgWidth;
        let initialImgHeight = previewImgHeight;

        setElementSize(previewImg);
        setElementPosition(previewImg, previewImgTop, previewImgLeft);

        //===================================================================================
        const zoomPlus = zoomPopup.querySelector(`.zoom-popup__btn--plus`);
        const zoomMinus = zoomPopup.querySelector(`.zoom-popup__btn--minus`);

        zoomPlus.addEventListener('click', onZoomPlus);
        function onZoomPlus() {
          if (zoom >= 3) return;
          zoom += 0.5;

          setElementSize(previewImg);
          setPreviewImgLeft();
          setPreviewImgTop();
          setElementPosition(previewImg, previewImgTop, previewImgLeft);
        }

        zoomMinus.addEventListener('click', onZoomMinus);
        function onZoomMinus() {
          if (zoom <= 1) return;
          zoom -= 0.5;

          setElementSize(previewImg);
          setPreviewImgLeft(false);
          setPreviewImgTop(false);
          setElementPosition(previewImg, previewImgTop, previewImgLeft);
        }

        function setElementSize(target) {
          previewImgWidth = initialImgWidth * zoom;
          previewImgHeight = initialImgHeight * zoom;
          target.style.width = previewImgWidth + 'px';
          target.style.height = previewImgHeight + 'px';
        }

        function setPreviewImgLeft(isEnlarge = true) {
          previewImgRect = previewImg.getBoundingClientRect();
          previewHolderRect = previewHolder.getBoundingClientRect();

          if (previewImgLeft >= 0 && zoom === 1) {
            previewImgLeft = (previewHolderRect.width - previewImgWidth) / 2;
          } else {
            const prevZoomImgWidth = isEnlarge
              ? initialImgWidth * (zoom - 0.5)
              : initialImgWidth * (zoom + 0.5);

            previewImgLeft =
              previewHolderRect.width / 2 -
              (previewHolderRect.width / 2 - previewImgLeft) * (previewImgWidth / prevZoomImgWidth);
          }

          if (previewImgLeft > 0 && previewImgRect.width >= previewHolderRect.width) {
            previewImgLeft = 0;
          } else if (previewImgRect.width + previewImgLeft < previewHolderRect.width) {
            previewImgLeft = previewHolderRect.width - previewImgRect.width;
            if (previewImgRect.width < previewHolderRect.width) {
              previewImgLeft = previewImgLeft / 2;
            }
          }
        }

        function setPreviewImgTop(isEnlarge = true) {
          previewImgRect = previewImg.getBoundingClientRect();
          previewHolderRect = previewHolder.getBoundingClientRect();

          if (previewImgTop >= 0 && zoom === 1) {
            previewImgTop = (previewHolderRect.height - previewImgHeight) / 2;
          } else {
            const prevZoomImgHeight = isEnlarge
              ? initialImgHeight * (zoom - 0.5)
              : initialImgHeight * (zoom + 0.5);

            previewImgTop =
              previewHolderRect.height / 2 -
              (previewHolderRect.height / 2 - previewImgTop) *
                (previewImgHeight / prevZoomImgHeight);
          }

          if (previewImgTop > 0 && previewImgRect.height >= previewHolderRect.height) {
            previewImgTop = 0;
          } else if (previewImgRect.height + previewImgTop < previewHolderRect.height) {
            previewImgTop = previewHolderRect.height - previewImgRect.height;
            if (previewImgRect.height < previewHolderRect.height) {
              previewImgTop = previewImgTop / 2;
            }
          }
        }

        //===================================================================================
        let touchCoords = {
          startX: 0,
          startY: 0,
          endX: 0,
          endY: 0,
        };

        previewImg.addEventListener('touchstart', onTouchStart);
        function onTouchStart(e) {
          touchCoords.startX = e.changedTouches[0].clientX - previewImgLeft;
          touchCoords.startY = e.changedTouches[0].clientY - previewImgTop;
        }

        previewImg.addEventListener('touchmove', onTouchMove);
        function onTouchMove(e) {
          e.preventDefault();
          touchCoords.endX = e.changedTouches[0].clientX;
          touchCoords.endY = e.changedTouches[0].clientY;

          previewImgLeft = touchCoords.endX - touchCoords.startX;
          previewImgTop = touchCoords.endY - touchCoords.startY;

          previewHolderRect = previewHolder.getBoundingClientRect();

          if (
            (previewImgLeft > 0 && previewImgWidth > previewHolderRect.width) ||
            (previewImgLeft < 0 && previewImgWidth <= previewHolderRect.width)
          ) {
            previewImgLeft = 0;
          } else if (
            (previewImgWidth <= previewHolderRect.width &&
              previewImgLeft > previewHolderRect.width - previewImgWidth) ||
            (previewImgWidth > previewHolderRect.width &&
              previewImgLeft < previewHolderRect.width - previewImgWidth)
          ) {
            previewImgLeft = previewHolderRect.width - previewImgWidth;
          }

          if (
            (previewImgTop > 0 && previewImgHeight > previewHolderRect.height) ||
            (previewImgTop < 0 && previewImgHeight <= previewHolderRect.height)
          ) {
            previewImgTop = 0;
          } else if (
            (previewImgHeight <= previewHolderRect.height &&
              previewImgTop > previewHolderRect.height - previewImgHeight) ||
            (previewImgHeight > previewHolderRect.height &&
              previewImgTop < previewHolderRect.height - previewImgHeight)
          ) {
            previewImgTop = previewHolderRect.height - previewImgHeight;
          }

          setElementPosition(previewImg, previewImgTop, previewImgLeft);
        }

        zoomPopup.addEventListener('popup-close', onPopupClose);
        function onPopupClose() {
          setElementPosition(previewImg, 0, 0);
          previewImg.removeAttribute('style');
          previewHolder.classList.remove('_visible');
          previewImg.removeAttribute('src');
          if (previewSource) previewSource.removeAttribute('src');

          zoomPlus.removeEventListener('click', onZoomPlus);
          zoomMinus.removeEventListener('click', onZoomMinus);
          previewImg.removeEventListener('touchstart', onTouchStart);
          previewImg.removeEventListener('touchmove', onTouchMove);
          zoomPopup.removeEventListener('popup-close', onPopupClose);

          previewHolderResize.unobserve(previewHolder);
        }

        //===================================================================================
        let prevHolderWidth = previewHolderRect.width;
        let prevHolderHeight = previewHolderRect.height;

        const previewHolderResize = new ResizeObserver(() => {
          previewHolderRect = previewHolder.getBoundingClientRect();
          previewImgRect = previewImg.getBoundingClientRect();

          heightRatio = previewHolderRect.height / previewImgRect.height;
          widthRatio = previewHolderRect.width / previewImgRect.width;

          if (heightRatio > widthRatio) {
            previewImgWidth = previewHolderRect.width;
            previewImgHeight = previewImgRect.height * widthRatio;
          } else {
            previewImgWidth = previewImgRect.width * heightRatio;
            previewImgHeight = previewHolderRect.height;
          }

          const scaleHeight = previewImgHeight / initialImgHeight;
          const scaleWidth = previewImgWidth / initialImgWidth;

          initialImgWidth = previewImgWidth;
          initialImgHeight = previewImgHeight;

          setElementSize(previewImg);

          previewImgRect = previewImg.getBoundingClientRect();

          previewImgLeft =
            previewHolderRect.width / 2 -
            (previewHolderRect.width / 2 - previewImgLeft) * scaleWidth;

          if (previewImgRect.width < previewHolderRect.width) {
            previewImgLeft = (previewHolderRect.width - previewImgWidth) / 2;
          } else if (previewImgLeft > 0 && previewImgRect.width > previewHolderRect.width) {
            previewImgLeft = 0;
          } else if (previewImgRect.width + previewImgLeft < previewHolderRect.width) {
            previewImgLeft = previewHolderRect.width - previewImgRect.width;
          } else {
            previewImgLeft = previewImgLeft - (prevHolderWidth - previewHolderRect.width) / 2;
          }
          prevHolderWidth = previewHolderRect.width;

          previewImgTop =
            previewHolderRect.height / 2 -
            (previewHolderRect.height / 2 - previewImgTop) * scaleHeight;

          if (previewImgRect.height < previewHolderRect.height) {
            previewImgTop = (previewHolderRect.height - previewImgHeight) / 2;
          } else if (previewImgTop > 0 && previewImgRect.height > previewHolderRect.height) {
            previewImgTop = 0;
          } else if (previewImgRect.height + previewImgTop < previewHolderRect.height) {
            previewImgTop = previewHolderRect.height - previewImgRect.height;
          } else {
            previewImgTop = previewImgTop - (prevHolderHeight - previewHolderRect.height) / 2;
          }
          prevHolderHeight = previewHolderRect.height;

          setElementPosition(previewImg, previewImgTop, previewImgLeft);
        });

        previewHolderResize.observe(previewHolder);
      });
    } else {
      let imgRect, imgWrapperRect;
      let previewImg, previewSource, previewHolder, previewHolderRect;
      let square, squareParam;
      const zoom = 1.5;
      let zoomCoeff;

      previewHolder = document.querySelector('[data-zoom-previewholder]');
      previewImg = previewHolder.querySelector('img');

      img.addEventListener('mouseenter', () => {
        imgRect = img.getBoundingClientRect();
        imgWrapperRect = imgWrapper.getBoundingClientRect();
        previewHolderRect = previewHolder.getBoundingClientRect();

        let widthRatio = previewHolderRect.width / imgRect.width; // відношення довжини зображення до довжини блоку, у якому буде відображатися збільшене зображення
        let heightRatio = previewHolderRect.height / imgRect.height; // відношення висоти зображення до висоти блоку, у якому буде відображатися збільшене зображення

        zoomCoeff = widthRatio > heightRatio ? widthRatio * zoom : heightRatio * zoom;

        squareParam = {
          height: previewHolderRect.height / zoomCoeff,
          width: previewHolderRect.width / zoomCoeff,
          top: imgRect.top - imgWrapperRect.top, // img може бути меньше за контейнер / знаходимо висоту між верхом контейнера до початку img. Якщо висота img такаж як і контейнера, то imageTop = 0
          left: imgRect.left - imgWrapperRect.left,
        };

        square = createSquare(squareParam);
        setElementPosition(square, squareParam.top, squareParam.left);

        imgWrapper.insertAdjacentElement('beforeend', square);

        previewImg.setAttribute('src', img.getAttribute('src'));
        previewSource = previewHolder.querySelector(`source`);
        if (previewSource) previewSource.setAttribute('srcset', img.getAttribute('src'));

        previewImg.style.width = imgRect.width * zoomCoeff + 'px';
        previewImg.style.height = imgRect.height * zoomCoeff + 'px';
        previewHolder.classList.add('_visible');
      });

      let newSquareTop = 0,
        newSquareLeft = 0;

      img.addEventListener('mousemove', (e) => {
        // Переміщення square по вертикалі
        if (e.clientY - imgRect.top < squareParam.height / 2) {
          // Притиснути square до верху зображення imgRect
          newSquareTop = imgRect.top - imgWrapperRect.top;
        } else if (imgRect.top + imgRect.height - e.clientY < squareParam.height / 2) {
          // Притиснути square до низу зображення imgRect
          newSquareTop =
            imgRect.top - imgWrapperRect.top + imgRect.height - Math.floor(squareParam.height);
        } else {
          // Переміщення square по вертикалі зображення з курсором по центру square
          newSquareTop =
            imgRect.top - imgWrapperRect.top + (e.clientY - imgRect.top) - squareParam.height / 2;
        }

        // Переміщення square по горизонталі
        if (e.clientX - imgRect.left < squareParam.width / 2) {
          // Притиснути square до лівої сторони зображення imgRect (не до обгортки imgWrapperRect)
          newSquareLeft = imgRect.left - imgWrapperRect.left;
        } else if (imgRect.width + imgRect.left - e.clientX < squareParam.width / 2) {
          // Притиснути square до правої сторони зображення imgRect (не до обгортки imgWrapperRect)
          newSquareLeft =
            imgRect.left - imgWrapperRect.left + imgRect.width - Math.floor(squareParam.width);
        } else {
          // Переміщення square по горизонталі зображення з курсором по центру square
          newSquareLeft =
            imgRect.left - imgWrapperRect.left + (e.clientX - imgRect.left) - squareParam.width / 2;
        }

        setElementPosition(square, newSquareTop, newSquareLeft);

        previewImg.style.left = (squareParam.left - newSquareLeft) * zoomCoeff + 'px';
        previewImg.style.top = (squareParam.top - newSquareTop) * zoomCoeff + 'px';
      });

      img.addEventListener('mouseleave', () => {
        square.remove();
        if (previewSource) previewSource.removeAttribute('srcset');
        previewImg.removeAttribute('src');
        previewImg.style.width = '0px';
        previewImg.style.height = '0px';
        previewHolder.classList.remove('_visible');
      });

      function createSquare(parameters) {
        const square = document.createElement('div');
        square.style.top = parameters.top + 'px';
        square.style.left = parameters.left + 'px';
        square.style.width = parameters.width + 'px';
        square.style.height = parameters.height + 'px';
        square.classList.add('zoom-square');
        return square;
      }
    }
  });

  function setElementPosition(target, top = 0, left = 0) {
    target.style.top = top + 'px';
    target.style.left = left + 'px';
  }
});

//========================================================================================================================================================
//====== sticky ==========================================================================================================================================
//========================================================================================================================================================
const stickyItems = document.querySelectorAll('[data-sticky]');
stickyItems.forEach((item) => {
  if (item.hasAttribute('data-sticky-media')) {
    const [mediaType, mediaSize] = item.getAttribute('data-sticky-media').split(',');
    const mediaQuery = `(${mediaType}-width: ${mediaSize}px)`;
    const matchMedia = window.matchMedia(mediaQuery);

    matchMedia.addEventListener('change', (e) => initSticky(item, e.matches));
    initSticky(item, matchMedia.matches);
  } else {
    initSticky(item);
  }
});

function initSticky(item, matches = true) {
  let isHeader = item.hasAttribute('data-sticky-header');

  if (matches) {
    let top = item.getAttribute('data-sticky');
    top = top ? top : 0;

    item.style.position = 'sticky';
    item.style.top = top + 'px';
    if (isHeader) {
      item.style.marginTop = 'calc(-1 * (var(--header-height)))';
      item.style.marginBottom = 'var(--header-height)';
      item.style.transform = 'translateY(var(--header-height))';
    }
  } else {
    item.style.removeProperty('position');
    item.style.removeProperty('top');
    if (isHeader) {
      item.style.removeProperty('margin-top');
      item.style.removeProperty('margin-bottom');
      item.style.removeProperty('transform');
    }
  }
}

//========================================================================================================================================================
//======= Breadcrumbs ====================================================================================================================================
//========================================================================================================================================================
function breadcrumbs() {
  function setVisibleItems(breadcrumbsBlock) {
    let items = breadcrumbsBlock.querySelectorAll('.breadcrumbs__item');
    let itemsWidth = items[0].offsetWidth + 14 + items[items.length - 1].offsetWidth;
    let isEnoughItems = false;
    for (let i = items.length - 2; i > 0; i--) {
      if (!isEnoughItems) items[i].style.removeProperty('display');
      itemsWidth += items[i].offsetWidth + 14;

      if (itemsWidth > breadcrumbsBlock.offsetWidth - 30) {
        items[i].style.display = 'none';
        isEnoughItems = true;
      }
    }
  }

  const setVisibleItemsThrottle = throttle(setVisibleItems, 500);
  const resizeBreadcrumbsObserver = new ResizeObserver((entries) => {
    entries.forEach((entr) => setVisibleItemsThrottle(entr.target));
  });
  document.querySelectorAll('.breadcrumbs').forEach((el) => resizeBreadcrumbsObserver.observe(el));
}
breadcrumbs();

//========================================================================================================================================================
const tabVideo = document.querySelector('.product-tabs__title[for="#video"]');
if (tabVideo) {
  tabVideo.addEventListener('click', onClick);
  function onClick() {
    const videoItemsWrapper = document.querySelector('#video');
    if (!videoItemsWrapper) return;
    youtubeVideos(videoItemsWrapper);
    tabVideo.removeEventListener('click', onClick);
  }

  function youtubeVideos(videoItemsWrapper) {
    const videoItems = videoItemsWrapper.querySelectorAll('[data-video-id]');
    let playingItem;
    videoItems.forEach((videoItem) => {
      const player = YTPlayer(videoItem, {
        videoId: videoItem.getAttribute('data-video-id'),
        playerVars: {
          controls: 1,
          modestbranding: 1,
        },
      });
      player.on('stateChange', (e) => {
        if (e.data === 1 && playingItem !== e.target) {
          if (playingItem) {
            playingItem.i.classList.remove('_play');
            playingItem.pauseVideo();
          }
          playingItem = e.target;
          videoItem.classList.add('_play');
        } else if (e.data === 2) {
          playingItem.i.classList.remove('_play');
        } else if (e.data === 0) {
          playingItem.i.classList.remove('_play');
          playingItem = null;
        }
      });
    });
  }
}
