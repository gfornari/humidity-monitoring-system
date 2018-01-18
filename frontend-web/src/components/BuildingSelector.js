import { MDCSelect } from '@material/select';
import SensorsChart from './SensorsChart';

class BuildingSelector {
  constructor(selector) {
    this.container = document.querySelector(selector);

    const strElement = `<div class="mdc-select" role="listbox">
    <div class="mdc-select__surface" tabindex="0">
    <div class="mdc-select__label">Select a building</div>
    <div class="mdc-select__selected-text"></div>
    <div class="mdc-select__bottom-line"></div>
    </div>
    <div class="mdc-simple-menu mdc-select__menu">
    <ul class="mdc-list mdc-simple-menu__items">
    </ul>
    </div>
    </div>`
    this.container.insertAdjacentHTML('beforeend', strElement);

    this.select = new MDCSelect(this.container);
  }

  addOptions(options, defaultIndex) {
    options.forEach((option, index) => {
      const strElement = `<li class="mdc-list-item" role="option" tabindex="0">${option}</li>`;
      this.container.querySelector('ul').insertAdjacentHTML('beforeend', strElement);
    });

    this.select.selectedIndex = defaultIndex;
  }

  addChangeListener(cb) {
    this.select.listen('MDCSelect:change', cb);
  }
}

export default BuildingSelector;