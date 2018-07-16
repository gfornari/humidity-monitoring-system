import { MDCSelect } from '@material/select';

class BuildingSelector {
  constructor(selector) {
    this.container = document.querySelector(selector);

    const strElement =
    `<div class="mdc-select">
      <select class="mdc-select__native-control">
      </select>
       <label class="mdc-floating-label">Select a building</label>
       <div class="mdc-line-ripple"></div>
     </div>`;

    this.container.insertAdjacentHTML('beforeend', strElement);

    this.select = new mdc.select.MDCSelect(this.container);
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
