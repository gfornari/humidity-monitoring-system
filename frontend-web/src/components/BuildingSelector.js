import { MDCSelect } from '@material/select';
import SensorsChart from './SensorsChart';

class BuildingSelector {
  constructor(selector) {
    this.container = document.querySelector(selector);

    const strElement =
   // `<div class="mdc-select" role="listbox">
   //  <div class="mdc-select__surface" tabindex="0">
   //  <div class="mdc-select__label">Select a building</div>
   //  <div class="mdc-select__selected-text"></div>
   //  <div class="mdc-select__bottom-line"></div>
   //  </div>
   //  <div class="mdc-simple-menu mdc-select__menu">
   //  <ul class="mdc-list mdc-simple-menu__items">
   //  </ul> 
   //  </div>
   //  </div>`
    `<div class="mdc-select">
      <select class="mdc-select__native-control">
      </select>
       <label class="mdc-floating-label">Select a building</label>
       <div class="mdc-line-ripple"></div>
     </div>`;

    this.container.insertAdjacentHTML('beforeend', strElement);

    this.select = new mdc.select.MDCSelect(this.container);
    // this.select = new MDCSelect(this.container);
  }

  addOptions(options, defaultIndex) {
    options.forEach((option, index) => {
      const strElement = `<option>${option}</option>`;
      this.container.querySelector('select').insertAdjacentHTML('beforeend', strElement);
    });

    this.select.selectedIndex = defaultIndex;
  }

  addChangeListener(cb) {
    this.select.listen('change', cb);
  }
}

export default BuildingSelector;
