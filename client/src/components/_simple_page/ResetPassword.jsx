import React from "react";
import Request from "../../controller/Request";
import routeHandler from '../../controller/routeHandler';
import PostButton from '../_reusable/PostButton.jsx';
import utils from '../../controller/utils';

export default class ResetPassword extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.exitModal = this.exitModal.bind(this);

    this.state = {
      resetToken: this.props.params.resetToken,
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const newPass = this.refs.newPass.value;
    const newPassrp = this.refs.newPassrp.value;
    const {resetToken} = this.state;
    if (this.validateInputs(newPass, newPassrp)) {
      this.setState({requesting: true});
      Request.auth.resetPassword(newPass, newPassrp, resetToken)
        .then(res => {
          this.setState({msg: res.message, finished: true, requesting: false});
        })
        .catch(err => {
          this.setState({err: err.message, requesting: false});
        });
    }
  }

  exitModal(e) {
    utils.lockScroller(false);
    utils.clearInputs.call(this, ['oldPass', 'newPassrp']);
    routeHandler.redirectTo('/');
  }

  validateInputs(newPass, newPassrp) {
    let errState;
    if (!newPass) {
      errState = {err: 'Please enter the new password.', newPassClass: 'err'};
    } else if (!newPassrp) {
      errState = {err: 'Please verify the password.', newPassrpClass: 'err'};
    } else if (newPass !== newPassrp) {
      errState = {err: 'Passwords don\'t match.', newPassClass: 'err', newPassrpClass: 'err'};
    }
    errState && this.setState(errState);
    return !errState;
  }

  render() {
    const {requesting, newPassClass, newPassrpClass, finished, err, msg} = this.state;
    utils.lockScroller(true);
    return (
      <div className={"modal-full show"}>
        <div className="modal-dialog">
          <h1 className="modal-title">Reset Password</h1>
          {!finished ?
            <form onSubmit={this.handleSubmit}>
              <input type="password" className={newPassClass} ref='newPass' placeholder="New Password" autoFocus/>
              <input type="password" className={newPassrpClass} ref='newPassrp'
                     placeholder="Confirm New Password"/>
              <div className="modal-btn-group">
                {err && <p className="msg err">{err}</p>}
                <PostButton defaultText="Submit" requesting={requesting} />
                <button className="no" onClick={this.exitModal}>Cancel</button>
              </div>
            </form>
            :
            <div className="modal-one-btn">
              {msg && <p className="msg">{msg}</p>}
              <button className="yes" onClick={this.exitModal}>OK</button>
            </div>
          }
        </div>
      </div>
    );
  }
}
