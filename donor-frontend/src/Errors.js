export class FormErrors extends Error {
  constructor(errors) {
    super();
    this.errors = errors;
  }
}
