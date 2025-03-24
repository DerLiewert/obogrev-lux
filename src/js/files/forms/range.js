// Підключення з node_modules
import * as noUiSlider from 'nouislider';

// Підключення стилів з scss/base/forms/range.scss
// у файлі scss/forms/forms.scss

// Підключення стилів з node_modules
// import 'nouislider/dist/nouislider.css';

function rangeInit() {
  const sidebarRanges = document.querySelectorAll('[data-range]');
  if (!sidebarRanges.length) return;

  sidebarRanges.forEach((sidebarRange) => {
    const sidebarRangeSlider = sidebarRange.querySelector('[data-range-slider]');
    const sliderInputMin = sidebarRange.querySelector('[data-range-min]');
    const sliderInputMax = sidebarRange.querySelector('[data-range-max]');
    const minValue = +sliderInputMin.getAttribute('placeholder');
    const maxValue = +sliderInputMax.getAttribute('placeholder');
    const step = sidebarRange.getAttribute('data-range-step');

    setInputMinMax([sliderInputMin, sliderInputMax]);
    function setInputMinMax(inputs) {
      inputs.forEach((input) => {
        input.setAttribute('min', minValue);
        input.setAttribute('max', maxValue);
      });
    }

    noUiSlider.create(sidebarRangeSlider, {
      start: [minValue, maxValue],
      connect: true,
      step: step ? +step : 1,
      range: {
        min: minValue,
        max: maxValue,
      },
    });

    sidebarRangeSlider.noUiSlider.on('update', function (values, handle) {
      if (handle) {
        sliderInputMax.value = formatValue(values[1]);
      } else {
        sliderInputMin.value = formatValue(values[0]);
      }
    });

    sliderInputMin.addEventListener('change', function (e) {
      let value = e.target.value;
      if (value === '' || value < minValue) value = minValue;

      sidebarRangeSlider.noUiSlider.setHandle(0, value, true, true);
      if (value > sliderInputMax.value) {
        sidebarRangeSlider.noUiSlider.setHandle(1, value, true, true);
      }
    });
    sliderInputMax.addEventListener('change', function (e) {
      let value = e.target.value;
      if (value === '' || value > maxValue) value = maxValue;

      sidebarRangeSlider.noUiSlider.setHandle(1, value, true, true);
      if (value < sliderInputMin.value) {
        sidebarRangeSlider.noUiSlider.setHandle(0, value, true, true);
      }
    });

    function formatValue(value) {
      const fixedPointValue = step
        ? step.split('.').length === 2
          ? step.split('.').pop().length
          : 0
        : 0;
      return Number.parseFloat(value).toFixed(fixedPointValue);
    }
  });
}
rangeInit();
