import React from "react";
import Request from "../../controller/Request";
import PostButton from "./PostButton.jsx";
import utils from "../../controller/utils";


export default class SignInModal extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.exitModal = this.exitModal.bind(this);

    this.state = {};
  }

  handleSubmit(e) {
    e && e.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    if (this.validateInputs(email, password)) {
      this.setState({requesting: true});
      Request.auth.login(email, password)
        .then(res => {
          utils.lockScroller(false);
          this.props.changeVisibility(false);
          this.props.loggedIn();
        })
        .catch(err => {
          this.setState({err: err.message, emailClass: 'err', passwordClass: 'err', requesting: false});
        });
    }
  }

  validateInputs(email, password) {
    let errState;
    if (!email) {
      errState = {err: 'Please enter your email.', emailClass: 'err'};
    } else if (!utils.validateEmail(email)) {
      errState = {err: 'Invalid email address', emailClass: 'err'};
    } else if (!password) {
      errState = {err: 'Please enter your password.', passwordClass: 'err'};
    }
    errState && this.setState(errState);
    return !errState;
  }

  onKeyPress(e) {
    e.key === 'Enter' && this.handleSubmit();
  }

  exitModal(e) {
    e.preventDefault();
    utils.lockScroller(false);
    utils.clearInputs.call(this, ['email', 'password']);
    this.props.changeVisibility(false);
  }

  render() {
    const {requesting, emailClass, passwordClass, err, msg} = this.state;
    const {title, show} = this.props;
    show && utils.lockScroller(true);
    return (
      <div onClick={this.exitModal} className={"modal-full " + (show ? "show" : "")}>
        <div onClick={(e) => e.stopPropagation()} className="modal-dialog">
          <h1 className="modal-title">{title}</h1>
          <form onSubmit={this.handleSubmit}>
            <input type="text" className={emailClass} ref='email' name="email" placeholder="Email" autoFocus/>
            <input type="password" className={passwordClass} ref='password' name="password" placeholder="Password"/>
            <div className="modal-btn-group">
              {err && <p className="msg err">{err}</p>}
              <PostButton defaultText="Sign in" requesting={requesting} />
              <button className="no" onClick={this.exitModal}>Cancel</button>
            </div>
          </form>
          <a onClick={() => this.props.callForgetPass()}>Forget Password?</a>
        </div>
      </div>
    );
  }
}

SignInModal.defaultProps = {
  title: 'Sign In',
};
