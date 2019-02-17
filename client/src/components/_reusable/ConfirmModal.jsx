import React from "react";
import utils from '../../controller/utils';

export default class ConfirmModal extends React.Component {

  handleSubmit(e) {
    e && e.preventDefault();
    this.props.dialogConfirm();
    this.exitModal();
  }

  exitModal(e) {
    utils.lockScroller(false);
    this.props.changeVisibility(false);
  }

  render() {
    const {show, title} = this.props;
    show && utils.lockScroller(true);
    return (
      <div onClick={this.exitModal.bind(this)} className={"modal-full " + (show ? "show" : "")}>
        <div onClick={() => e.stopPropagation()} className="modal-dialog">
          <h1 className="modal-title">{title}</h1>
          <div className="modal-btn-group">
            <button className="yes" onClick={this.handleSubmit.bind(this)}>Confirm</button>
            <button className="no" onClick={this.exitModal.bind(this)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}
