export default class LocalFileLoader {
  constructor(url) {
    this.url = url;
    this.xhr = new XMLHttpRequest();
  }

  load() {
    return new Promise((resolve, reject) => {
      this._initRequest();
      this._initListeners(resolve, reject);
      this._sendRequest();
    });
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) this.xhr.abort();
  }

  _initListeners(resolve, reject) {
    const xhr = this.xhr;

    xhr.addEventListener("error", () => {
      return reject();
    });
    xhr.addEventListener("abort", () => {
      return reject();
    });
    xhr.addEventListener("load", () => {
      try {
        const r = xhr.response;
        return resolve(r);
      } catch (err) {
        return reject(err);
      }
    });
  }

  // Initializes the XMLHttpRequest object.
  _initRequest() {
    this.xhr.open("GET", this.url, true);
    this.xhr.responseType = "text";
  }

  // Prepares the data and sends the request.
  _sendRequest(data = null) {
    if (!data) this.xhr.send();
  }
}
