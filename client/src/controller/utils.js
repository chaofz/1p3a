const utils = {

  validateEmail(email) {
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
  },

  clearInputs(fields) {
    fields.forEach(field => {
      this.refs[field] && (this.refs[field].value = '');
    });
  },

  lockScroller(yes) {
    document.body.className = yes ? 'modal-open' : '';
  }

};

export default utils;
