import React from "react";
import Request from "../../controller/Request";
import PostButton from "./PostButton.jsx";
import utils from "../../controller/utils";

export default class ForgetPassModal extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.exitModal = this.exitModal.bind(this);

    this.state = {};
  }

  handleSubmit(e) {
    e && e.preventDefault();
    const email = this.refs.email.value;
    if (this.validateInputs(email)) {
      this.setState({requesting: true});
      Request.auth.requestResetPassword(email)
        .then(res => {
          this.setState({msg: res.message, finished: true, requesting: false});
        })
        .catch(err => {
          this.setState({err: err.message, emailClass: 'err', requesting: false});
        });
    }
  }

  validateInputs(email, password) {
    let errState;
    if (!email) {
      errState = {err: 'Please enter your email.', emailClass: 'err'};
    } else if(!utils.validateEmail(email)) {
      errState = {err: 'Invalid email', emailClass: 'err'};
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
    utils.clearInputs.call(this, ['email']);
    this.props.changeVisibility(false);
  }

  render() {
    const {finished, requesting, emailClass, err, msg} = this.state;
    const {show} = this.props;
    show && utils.lockScroller(true);
    return (
      <div onClick={this.exitModal} className={"modal-full " + (show ? "show" : "")}>
        <div onClick={(e) => e.stopPropagation()} className="modal-dialog">
          <h1 className="modal-title">Forget Password</h1>
          {!finished ?
            <form onSubmit={this.handleSubmit}>
              <p className="message">Enter your email here and we will send you an email to help you reset your password.</p>
              <input type="text" className={emailClass} ref="email" placeholder="Email" autoFocus/>
              <div className="modal-btn-group">
                {err && <p className="msg err">{err}</p>}
                <PostButton defaultText="Send" requesting={requesting} />
                <button className="no" onClick={this.exitModal}>Cancel</button>
              </div>
            </form>
            :
            <div className="modal-one-btn">
              {msg && <p className="msg">{msg}</p>}
              <button onClick={this.exitModal} className="yes">OK</button>
            </div>
          }
        </div>
      </div>
    );
  }
}
