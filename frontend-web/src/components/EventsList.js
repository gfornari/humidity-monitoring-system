import DialogShower from './DialogShower';

class EventsList {
  constructor(selector) {
    this.nItems = 0;
    this.container = document.querySelector(selector);
    const strElement = '<ul id="eventlist" class="mdc-list mdc-list--two-line mdc-list--avatar-list"></ul>'
    this.container.insertAdjacentHTML('beforeend', strElement);
  }

  appendItem(type, text, secondaryText) {
    const strElement = `
      <li class="mdc-list-item" role="listitem" data-mdc-auto-init="MDCRipple">
        <span class="mdc-list-item__graphic" role="presentation">
          <i class="material-icons" aria-hidden="true">${type}</i>
        </span>
        <span class="mdc-list-item__text">
          ${text}
          <span class="mdc-list-item__secondary-text">${secondaryText}</span>
        </span>
      </li>`;
    this.container.querySelector('ul').insertAdjacentHTML('beforeend', strElement);
    const items = this.container.querySelector('ul').getElementsByTagName('li');
    items[this.nItems].addEventListener(
      'click', 
      function (e) {
        if(e.target && e.target.nodeName == "LI") {
          const dialog = new DialogShower("#my-mdc-dialog");
          dialog.addTitle(text);
          dialog.addDescription(secondaryText);
          dialog.show();
        }
    })
    this.nItems++;
  }
}

export default EventsList;