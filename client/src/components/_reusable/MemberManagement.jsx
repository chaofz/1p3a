import React from "react";
import routeHandler from "../../controller/routeHandler";
import ConfirmModal from '../_reusable/ConfirmModal.jsx';
import Request from "../../controller/Request";
import AppModel from "../../models/AppModel";

export default class MemberManagement extends React.Component {

  constructor(props) {
    super(props);

    this.onMemberDragStart = this.onMemberDragStart.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.state = {
      projectId: this.props.params.id,
      userRole: '',
      members: [],
      showConfirmModal: false
    };
  }

  onMemberDragStart(e) {
    e.dataTransfer.setData("memberId", e.target.id);
    this.setState({err: ''});
  }

  onDragOverOwner(e) {
    e.preventDefault();
    this.setState({dragOverOwner: 'dragOver'});
  }

  onDragOverAdmins(e) {
    e.preventDefault();
    this.setState({dragOverAdmin: 'dragOver'});
  }

  onDragOverMembers(e) {
    e.preventDefault();
    this.setState({dragOverMember: 'dragOver'});
  }

  onDragOverToRemove(e) {
    e.preventDefault();
    this.setState({dragOverToRemove: 'dragOver'});
  }

  onDropOwner(e) {
    this.clearCardShadow();
    const memberId = e.dataTransfer.getData('memberId');
    const {userRole} = this.state;
    if (userRole === 'owner' && memberId !== AppModel.userId) {
      this.setState({
        showConfirmModal: true,
        modalTitle: 'promote this user to owner? You will not be able to demote an owner.',
        memberIdToConfirm: memberId,
        roleToConfirm: 'owner'
      });
    } else {
      this.changeRole(memberId, 'owner');
    }
  }

  onDropAdmins(e) {
    this.clearCardShadow();
    const memberId = e.dataTransfer.getData('memberId');
    const {userRole} = this.state;
    if (userRole === 'owner' && memberId === AppModel.userId) {
      this.setState({
        showConfirmModal: true,
        modalTitle: 'give up your ownership?',
        memberIdToConfirm: memberId,
        roleToConfirm: 'admin'
      });
    } else {
      this.changeRole(memberId, 'admin');
    }
  }

  onDropMembers(e) {
    this.clearCardShadow();
    const memberId = e.dataTransfer.getData('memberId');
    const {userRole} = this.state;
    if (userRole === 'owner' && memberId === AppModel.userId) {
      this.setState({
        showConfirmModal: true,
        modalTitle: 'give up your ownership?',
        memberIdToConfirm: memberId,
        roleToConfirm: 'member'
      });
    } else if (userRole === 'admin' && memberId === AppModel.userId) {
      this.setState({
        showConfirmModal: true,
        modalTitle: 'give up your admin role?',
        memberIdToConfirm: memberId,
        roleToConfirm: 'member'
      });
    } else {
      this.changeRole(memberId, 'member');
    }
  }

  onDropToRemove(e) {
    this.clearCardShadow();
    const memberId = e.dataTransfer.getData('memberId');
    if (memberId === AppModel.userId) {
      this.setState({
        showConfirmModal: true,
        modalTitle: 'quit this project?',
        memberIdToConfirm: memberId,
        roleToConfirm: 'remove'
      });
    } else {
      this.setState({
        showConfirmModal: true,
        modalTitle: 'remove this user?',
        memberIdToConfirm: memberId,
        roleToConfirm: 'remove'
      });
    }
  }

  changeRole(memberId, newRole) {
    const {modalTitle, projectId} = this.state;
    Request.project.changeMemberRole(this.state.projectId, memberId, newRole)
      .then(res => {
        res.userRole = this.getUserRole(res.members);
        this.setState(res);
        if (modalTitle === 'quit this project?') {
          routeHandler.redirectTo(`/project/${projectId}`);
        }
      })
      .catch(err => {
        this.setState({err: err.message});
      });
  }

  onDragLeave() {
    this.clearCardShadow();
  }

  clearCardShadow() {
    this.setState({dragOverOwner: '', dragOverAdmin: '', dragOverMember: '', dragOverToRemove: ''});
  }

  getMemberRoles(members) {
    const membersRole = {'owner': [], 'admin': [], 'member': []};
    members.forEach(member => {
      membersRole[member.role].push(member);
    });
    return membersRole;
  }

  getUserRole(members) {
    const userRole = members.find(x => x.member._id === AppModel.userId);
    return userRole && userRole.role;
  }

  handleSubmit() {
    const {members} = this.state;
    console.log('Current Member', members);
  }

  onModalConfirmed() {
    const {memberIdToConfirm, modalTitle, roleToConfirm} = this.state;
    this.changeRole(memberIdToConfirm, roleToConfirm);
    this.setState({showDeleteConfirmModal: false});
  }

  onChangeConfirmModalVisibility(showOrNot) {
    this.setState({showConfirmModal: showOrNot});
  }

  componentDidMount() {
    Request.project.getById(this.state.projectId)
      .then(res => {
        console.log('MemberManagement getProject', res);
        res.userRole = this.getUserRole(res.members);
        this.setState(res);
      })
      .catch(err => {
      });
  }

  render() {
    const {projectId, name, members, showConfirmModal, modalTitle, dragOverOwner, dragOverAdmin, dragOverMember, dragOverToRemove, err} = this.state;
    const membersRole = this.getMemberRoles(members);
    return (
      <div id="member-management">
        <h1 className="page-head">Member Management for {name}</h1>
        <div className="row">
          <div className="pm12 t3">
            <div className={"member card " + dragOverOwner}
                 onDragOver={this.onDragOverOwner.bind(this)}
                 onDragLeave={this.onDragLeave}
                 onDrop={this.onDropOwner.bind(this)}>
              <h2>Owner</h2>
              {membersRole.owner.map(x =>
                <div id={x.member._id} className={"memberName " + (x.member._id === AppModel.userId && 'myself')}
                     onDragStart={this.onMemberDragStart}
                     draggable="true">{x.member.profile.name}</div>
              )}
            </div>
          </div>
          <div className="pm12 t3">
            <div className={"member card " + dragOverAdmin}
                 onDragOver={this.onDragOverAdmins.bind(this)}
                 onDragLeave={this.onDragLeave}
                 onDrop={this.onDropAdmins.bind(this)}>
              <h2>Admin</h2>
              {membersRole.admin.map(x =>
                <div id={x.member._id} className={"memberName " + (x.member._id === AppModel.userId && 'myself')}
                     onDragStart={this.onMemberDragStart}
                     draggable="true">{x.member.profile.name}</div>
              )}
            </div>
          </div>
          <div className="pm12 t3">
            <div className={"member card " + dragOverMember}
                 onDragOver={this.onDragOverMembers.bind(this)}
                 onDragLeave={this.onDragLeave}
                 onDrop={this.onDropMembers.bind(this)}>
              <h2>Member</h2>
              {membersRole.member.map(x =>
                <div id={x.member._id} className={"memberName " + (x.member._id === AppModel.userId && 'myself')}
                     onDragStart={this.onMemberDragStart}
                     draggable="true">{x.member.profile.name}</div>
              )}
            </div>
          </div>
          <div className="pm12 t3">
            <div className={"member remove card " + dragOverToRemove}
                 onDragOver={this.onDragOverToRemove.bind(this)}
                 onDragLeave={this.onDragLeave}
                 onDrop={this.onDropToRemove.bind(this)}>
              <h2>To Remove</h2>
            </div>
          </div>
        </div>
        {projectId && <div className="btn-group">
          {err && <p className="panel red">{err}</p>}
        </div>}
        <ConfirmModal show={showConfirmModal}
                      title={"Are you sure you want to " + modalTitle}
                      dialogConfirm={this.onModalConfirmed.bind(this)}
                      changeVisibility={this.onChangeConfirmModalVisibility.bind(this)}/>
        <hr/>
        <div className="permission-description">
          <h2>Permissions</h2>
          <ul className="permission-description-list">
            <li>Members can view project and quit a project.</li>
            <li>Admins have members' privileges and can edit project, accept applicants, remove regular members, and give up
              admin role.
            </li>
            <li>Owners have admins' privileges and can delete project, promote owners/admins, remove/demote any member
              but a owner, and give up ownership. One project must have at least one owner.
            </li>
          </ul>
        </div>
      </div>
    );
  }
};
