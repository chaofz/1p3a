import React from "react";
import Request from "../../controller/Request";
import PostButton from "../_reusable/PostButton.jsx";
import utils from '../../controller/utils';

export default class ChangePassModal extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.exitModal = this.exitModal.bind(this);

    this.state = {};
  }

  handleSubmit(e) {
    e.preventDefault();
    const oldPass = this.refs.oldPass.value;
    const newPass = this.refs.newPass.value;
    const newPassrp = this.refs.newPassrp.value;

    if (this.validateInputs(oldPass, newPass, newPassrp)) {
      this.setState({requesting: true, msg: '', err: ''});
      Request.auth.changePassword(oldPass, newPass, newPassrp)
        .then(res => {
          this.setState({msg: res.message, finished: true, requesting: false});
        })
        .catch(err => {
          this.setState({err: err.message, requesting: false});
        });
    }
  }

  exitModal(e) {
    e.preventDefault();
    utils.lockScroller(false);
    utils.clearInputs.call(this, ['oldPass', 'newPass', 'newPassrp']);
    this.props.changeVisibility(false);
  }

  validateInputs(oldPass, newPass, newPassrp) {
    let errState;
    if (!oldPass) {
      errState = {err: 'Please enter the old password.', oldPassClass: 'err'};
    } else if (!newPass) {
      errState = {err: 'Please enter the new password.', newPassClass: 'err'};
    } else if (newPass == oldPass) {
      errState = {err: 'Please think up a new password.', oldPassClass: 'err', newPassClass: 'err'};
    } else if (!newPassrp) {
      errState = {err: 'Please verify the password.', newPassrpClass: 'err'};
    } else if (newPass !== newPassrp) {
      errState = {err: 'Failed to verify the password.', newPassClass: 'err', newPassrpClass: 'err'};
    }
    errState && this.setState(errState);
    return !errState;
  }

  render() {
    const {finished, requesting, oldPassClass, newPassClass, newPassrpClass, msg, err} = this.state;
    const {show} = this.props;
    show && utils.lockScroller(true);
    return (
      <div className={"modal-full " + (show ? "show" : "")}>
        <div className="modal-dialog">
          <h1 className="modal-title">Change Password</h1>
          {!finished ?
            <form onSubmit={this.handleSubmit}>
              <input type="password" className={oldPassClass} ref='oldPass' placeholder="Old password" autoFocus/>
              <input type="password" className={newPassClass} ref='newPass' placeholder="New Password"/>
              <input type="password" className={newPassrpClass} ref='newPassrp'
                     placeholder="Confirm New Password"/>
              <div className="modal-btn-group">
                {err && <p className="msg err">{err}</p>}
                <PostButton defaultText="Change" requesting={requesting} />
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
