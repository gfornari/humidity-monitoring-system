import { MDCDialog } from '@material/dialog';

class DialogShower {
	constructor(dialogContainer) {
		this.dialog = new MDCDialog(document.querySelector(dialogContainer));
	}

	addTitle(title) {
		document.getElementById("my-mdc-dialog-title").innerHTML = title;
	}

	addDescription(description) {
		document.getElementById("my-mdc-dialog-description").innerHTML = description;
	}

	show() {
		this.dialog.show();
	}
}

export default DialogShower;