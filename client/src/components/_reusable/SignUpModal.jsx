import React from "react";
import Identicon from "identicon.js";
import Request from "../../controller/Request";
import AppConfig from "../../models/AppConfig";
import PostButton from "./PostButton.jsx";
import utils from "../../controller/utils";

const identiconOption = AppConfig.profile.identiconOption;

export default class SignUpModal extends React.Component {

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
    const passwordRp = this.refs.passwordRp.value;
    const name = this.refs.name.value;
    const avatarEncoded = 'data:image/png;base64,' + new Identicon('', identiconOption).toString();

    if (this.validateInputs(email, password, passwordRp, name)) {
      this.setState({requesting: true});
      Request.auth.register(email, password, passwordRp, name, avatarEncoded)
        .then(res => {
          this.setState({finished: true});
          this.props.loggedIn();
        })
        .catch(err => {
          this.setState({err: err.message, requesting: false});
        })
    }
  }

  validateInputs(email, password, passwordRp, name) {
    let errState;
    if (!email) {
      errState = {err: 'Please enter your email.', emailClass: 'err'};
    } else if (!utils.validateEmail(email)) {
      errState = {err: 'Invalid email address', emailClass: 'err'};
    } else if (!password) {
      errState = {err: 'Please enter your password.', passwordClass: 'err'};
    } else if (!passwordRp) {
      errState = {err: 'Please verify your password.', passwordRpClass: 'err'};
    } else if (password !== passwordRp) {
      errState = {err: 'Passwords don\'t match', passwordClass: 'err', passwordRpClass: 'err'};
    } else if (!name) {
      errState = {err: 'Please enter your name.', nameClass: 'err'};
    }
    errState && this.setState(errState);
    return !errState;
  }

  exitModal(e) {
    e.preventDefault();
    utils.lockScroller(false);
    utils.clearInputs.call(this, ['email', 'password', 'passwordRp', 'name']);
    this.props.changeVisibility(false);
  }

  render() {
    const {finished, requesting, emailClass, passwordClass, passwordRpClass, nameClass, err} = this.state;
    const {show} = this.props;
    show && utils.lockScroller(true);
    return (
      <div onClick={this.exitModal} className={"modal-full " + (show ? "show" : "")}>
        <div onClick={(e) => e.stopPropagation()} className="modal-dialog">
          {!finished ?
            <form onSubmit={this.handleSubmit}>
              <h1 className="modal-title">Sign Up</h1>
              <input type="text" className={emailClass} ref='email' placeholder="Email" autoFocus/>
              <input type="password" className={passwordClass} ref='password' placeholder="Password"/>
              <input type="password" className={passwordRpClass} ref='passwordRp' placeholder="Verify Password"/>
              <input type="text" className={nameClass} ref='name' placeholder="Name"/>
              <div className="modal-btn-group">
                {err && <p className="msg err">{err}</p>}
                <PostButton defaultText="Sign up" requesting={requesting} />
                <button className="no" onClick={this.exitModal}>Cancel</button>
              </div>
            </form>
            :
            <div>
              <h1 className="modal-title">Thanks for signing up!</h1>
              <p className="center">Please confirm the email we just sent you. Most Fuse services are only available to
                confirmed users.</p>
              <div className="modal-one-btn">
                <button className="yes" onClick={this.exitModal}>OK</button>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}
