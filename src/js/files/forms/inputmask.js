/* Маски для полів (у роботі) */

// Підключення функціоналу "Чертоги Фрілансера"
// Підключення списку активних модулів
import { flsModules } from '../modules.js';

// Підключення модуля
import IMask from 'imask';

document.querySelectorAll('[data-phone-mask]').forEach((elem) => {
  new IMask(elem, {
    mask: '+{38\\0} (00) 000-00-00',
    lazy: false,
  });
});
