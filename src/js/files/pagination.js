const paginations = document.querySelectorAll('[data-pagination]');
// 1 ... 4 5 6 ... 9
if (paginations.length) {
  paginations.forEach((pagination) => {
    function createPagination() {
      let api = pagination.getAttribute('data-pagination');
      let itemsOnPage = pagination.getAttribute('data-pagination-items');
      itemsOnPage = itemsOnPage ? +itemsOnPage : 10;
      let showPages = +pagination.getAttribute('data-pagination-show-pages'); // min 3 // последовательное количество страниц (к-во страниц между точками, если 3, то будет 1 ... 3 4 5 ... 9 )
      showPages = showPages >= 3 ? showPages : 3;

      let items = 1996;

      let totalPages = Math.ceil(items / itemsOnPage);
      if (!totalPages) return;

      let currentPage = 1;

      const list = document.createElement('ul');
      list.classList.add('pagination__list');

      createListItems(currentPage);
      pagination.insertAdjacentElement('afterbegin', list);

      let prev, next;
      addButtons();

      function createListItems(page) {
        currentPage = page;

        if (totalPages <= showPages + 2) {
          for (let i = 1; i <= totalPages; i++) {
            list.insertAdjacentElement('beforeend', createItem(i));
          }
          return;
        }

        // Always print first page button
        list.insertAdjacentElement('beforeend', createItem(1));

        // Print "..." only if currentPage is > 3
        if (currentPage > showPages || (currentPage === showPages && showPages > 4)) {
          if (currentPage <= totalPages - showPages + 1) {
            list.insertAdjacentElement(
              'beforeend',
              createItem(
                currentPage - (showPages % 2 != 0 ? Math.ceil(showPages / 2) : showPages / 2 + 1),
                true,
              ),
            );
          } else {
            list.insertAdjacentElement('beforeend', createItem(totalPages - showPages, true));
          }
        }

        // Print previous number button if currentPage > 2
        if (currentPage > 2) {
          let temp;

          if (currentPage < showPages) {
            temp = 2;
          } else if (currentPage >= totalPages - showPages + 1) {
            temp = totalPages - (showPages + 2) + 1;
          } else {
            temp = currentPage - Math.floor(showPages / 2);
          }

          for (let i = temp; i < currentPage; i++) {
            list.insertAdjacentElement('beforeend', createItem(i));
          }
        }

        //Print current page number button as long as it not the first or last page
        if (currentPage != 1 && currentPage != totalPages) {
          list.insertAdjacentElement('beforeend', createItem(currentPage));
        }

        //print next number button if currentPage < lastPage - 1
        if (currentPage < totalPages - 1) {
          let temp;

          if (currentPage <= showPages) {
            temp = showPages + 2 - currentPage + 1;
          } else if (currentPage > totalPages - showPages + 1) {
            temp = totalPages - currentPage;
          } else {
            temp = Math.ceil(showPages / 2);
          }

          for (let i = 1; i < temp; i++) {
            list.insertAdjacentElement('beforeend', createItem(currentPage + i));
          }
        }

        if (
          currentPage < totalPages - showPages + 1 ||
          (currentPage === totalPages - showPages + 1 && showPages > 3) ||
          currentPage < showPages
        ) {
          if (currentPage < showPages) {
            list.insertAdjacentElement('beforeend', createItem(showPages + 1, true));
          } else {
            list.insertAdjacentElement(
              'beforeend',
              createItem(currentPage + Math.ceil(showPages / 2), true),
            );
          }
        }

        //Always print last page button if there is more than 1 page
        list.insertAdjacentElement('beforeend', createItem(totalPages));
      }

      function createItem(number, hideNumber = false) {
        const li = document.createElement('li');
        li.classList.add('pagination__item');
        li.insertAdjacentElement('beforeend', createLink(number, hideNumber));
        return li;
      }

      function createLink(number, hideNumber = false) {
        const link = document.createElement('a');
        link.setAttribute(
          'href',
          `${api}?offset=${itemsOnPage * number - itemsOnPage}&limit=${itemsOnPage}`,
        );
        //link.setAttribute("data-pagination-page", number);
        link.classList.add('pagination__link');
        if (number == currentPage) link.classList.add('_active');
        link.insertAdjacentText('beforeend', hideNumber ? '...' : number);
        link.addEventListener('click', (e) => {
          e.preventDefault();
          removePaginationChild();
          createListItems(number);
          changeLink();
        });
        return link;
      }

      function removePaginationChild() {
        while (list.lastElementChild) {
          list.removeChild(list.lastElementChild);
        }
      }

      function addButtons() {
        prev = createButton(
          //   '<svg style="transform: rotate(180deg)" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          '<svg style="transform: rotate(180deg)" width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 13L7 7L1 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        );
        prev.classList.add('pagination__btn--prev');
        prev.setAttribute('data-pagination-prev', '');
        prev.setAttribute('aria-label', 'Предыдущая страница товаров');

        next = createButton(
          //   '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          '<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 13L7 7L1 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        );
        next.classList.add('pagination__btn--next');
        next.setAttribute('data-pagination-next', '');
        next.setAttribute('aria-label', 'Следущая страница товаров');

        changeLink();

        prev.addEventListener('click', (e) => {
          e.preventDefault();
          if (currentPage > 1) {
            removePaginationChild();
            createListItems(currentPage - 1);
            changeLink();
          }
        });
        next.addEventListener('click', (e) => {
          e.preventDefault();
          if (currentPage < totalPages) {
            removePaginationChild();
            createListItems(currentPage + 1);
            changeLink();
          }
        });

        pagination.insertAdjacentElement('afterbegin', prev);
        pagination.insertAdjacentElement('beforeend', next);

        function createButton(text) {
          const button = document.createElement('a');
          button.classList.add('pagination__btn');
          button.innerHTML = text;
          return button;
        }
      }

      function changeLink() {
        let offset = itemsOnPage * (currentPage - 1) - itemsOnPage;
        prev.setAttribute(
          'href',
          `${api}?offset=${currentPage <= 1 ? 0 : offset}&limit=${itemsOnPage}`,
        );
        next.setAttribute(
          'href',
          `${api}?offset=${itemsOnPage * (currentPage + 1) - itemsOnPage}&limit=${itemsOnPage}`,
        );
      }
    }
    createPagination();
  });
}
