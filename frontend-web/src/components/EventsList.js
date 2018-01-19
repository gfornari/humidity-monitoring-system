class EventsList {
  constructor(selector) {
    this.container = document.querySelector(selector);
    const strElement = '<ul class="mdc-list mdc-list--two-line mdc-list--avatar-list"></ul>'
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
  }
}

export default EventsList;