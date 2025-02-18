export default class CopyButton {
  constructor(_options) {
    this.element = _options.element;
    this.textEl = this.element.querySelector("p");
    this.text = _options.text;
    this.successText = _options.successText;
    this.errorText = _options.errorText;
    this.previousText = this.textEl.textContent;

    this.copy = this.copy.bind(this);
    this.init();
  }

  init() {
    this.element.addEventListener("click", this.copy);
  }
  copy() {
    if (!navigator.clipboard) {
      this.textEl.textContent = this.errorText;
      return;
    }

    navigator.clipboard
      .writeText(this.text)
      .then(() => {
        console.log("success");
        this.textEl.textContent = this.successText;
        setTimeout(() => {
          this.textEl.textContent = this.previousText;
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
        this.textEl.textContent = this.previousText;
      });
  }
}
