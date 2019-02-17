import React from "react";
import Request from '../../controller/Request';
import auth from '../../controller/auth';
import PostButton from '../_reusable/PostButton.jsx';
import utils from '../../controller/utils';

export default class ConfirmModal extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.exitModal = this.exitModal.bind(this);

    this.state = {};
  }

  exitModal(e) {
    e.preventDefault();
    utils.lockScroller(false);
    utils.clearInputs.call(this, ['password']);
    if (this.state.finished) {
      auth.indexLogout();
    } else {
      this.props.changeVisibility(false);
    }
  }

  validateInputs(password) {
    let errState;
    if (!password) {
      errState = {err: 'Please enter the old password.', passwordClass: 'err'};
    }
    errState && this.setState(errState);
    return !errState;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({msg: '', err: ''});
    const password = this.refs.password.value;
    if (this.validateInputs(password)) {
      this.setState({requesting: true});
      Request.profile.deleteAccount(password)
        .then(res => {
          this.setState({msg: res.message, finished: true, requesting: false});
          auth.logout();
        })
        .catch(err => {
          this.setState({err: err.message, requesting: false});
        });
    }
  }

  render() {
    const {finished, requesting, passwordClass, msg, err} = this.state;
    const {show} = this.props;
    show && (utils.lockScroller(true));
    return (
      <div className={"modal-full " + (show ? "show" : "")}>
        <div className="modal-dialog">
          <h1 className="modal-title">Please confirm your password to delete your account.</h1>
          {!finished ?
            <form onSubmit={this.handleSubmit}>
              <p className="message">Deleting your account is not reversible, please be careful.</p>
              <input type="password" className={passwordClass} ref='password' placeholder="Password" autoFocus/>
              <div className="modal-btn-group">
                {err && <p className="msg err">{err}</p>}
                <PostButton defaultText="Confirm" requesting={requesting} />
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
