import React from "react";
import ChangePassModal from "./ChangePassModal.jsx";
import DeleteAccountModal from "./DeleteAccountModal.jsx";
import Request from "../../controller/Request";
import AppModel from "../../models/AppModel";
import PostButton from '../_reusable/PostButton.jsx';

export default class LocalAccount extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      showChangePassModal: false,
      showDeleteAccountConfirmModal: false,
      emailConfirmed: true,
      requested: false,
    }
  }

  componentDidMount() {
    const profilePromise = AppModel.hasProfileCache() ? AppModel.getProfileCache() : Request.profile.getMine();
    profilePromise
      .then(res => {
        console.log('LocalAccount getMyProfile', 'cache ' + AppModel.hasProfileCache(), res);
        this.setState({profile: res, emailConfirmed: res.local.confirmed});
      })
      .catch(err => {
        this.setState({err: err.message});
      });
  }

  requestConfirm() {
    this.setState({requesting: true});
    Request.profile.requestConfirmation()
      .then(res => {
        console.log('LocalAccount email requested');
        this.setState({requested: true, requesting: false});
      })
      .catch(err => {
        console.log(err);
      });
  }

  onChangePassword() {
    this.setState({showChangePassModal: true});
  }

  onDeleteAccount() {
    this.setState({showDeleteAccountConfirmModal: true});
  }

  changePassModalVisibility(showOrNot) {
    this.setState({showChangePassModal: showOrNot});
  }

  deleteAccountModalVisibility(showOrNot) {
    this.setState({showDeleteAccountConfirmModal: showOrNot});
  }

  render() {
    const {profile, emailConfirmed, requested, requesting, showChangePassModal, showDeleteAccountConfirmModal} = this.state;
    console.log(emailConfirmed);
    return (
      <div className="local">
        <table>
          <tr>
            <td className="label">Email:</td>
            <td>{profile.local && profile.local.email}</td>
          </tr>
          <tr>
            <td className="label">Password:</td>
            <td>{profile.local &&
            <i onClick={this.onChangePassword.bind(this)} className="material-icons edit">edit</i>}</td>
          </tr>
        </table>
        <div className="email-confirm">
          {!emailConfirmed &&
          <PostButton requesting={requesting} onClick={this.requestConfirm.bind(this)} className="reconfirm yes"
                      defaultText="Request Confirmation Email"/>}
          {requested && <span> Confirmation email requested.</span>}
        </div>
        <div className="delete-user">
          <button className="no" onClick={this.onDeleteAccount.bind(this)}>Delete Account</button>
        </div>
        {showChangePassModal &&
        <ChangePassModal show={showChangePassModal} changeVisibility={this.changePassModalVisibility.bind(this)}/>}
        {showDeleteAccountConfirmModal &&
        <DeleteAccountModal show={showDeleteAccountConfirmModal}
                            changeVisibility={this.deleteAccountModalVisibility.bind(this)}/>}
      </div>
    );
  }
};

