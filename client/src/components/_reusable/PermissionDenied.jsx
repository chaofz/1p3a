import React from "react";
import Request from "../../controller/Request";
import routeHandler from '../../controller/routeHandler';
import PostButton from './PostButton.jsx';
import utils from '../../controller/utils';

export default class PermissionDenied extends React.Component {

  constructor(props) {
    super(props);
    const type = this.props.location.pathname.split('/')[1];
    this.state = {
      type,
      id: this.props.params.id
    }
  }

  exitModal() {
    const {type, id} = this.state;
    utils.lockScroller(false);
    routeHandler.redirectTo(`/${type}/${id}`);
  }

  render() {
    const {type} = this.state;
    utils.lockScroller(true);
    return (
      <div className={"modal-full show"}>
        <div className="modal-dialog">
          <h1 className="modal-title">Permission Denied</h1>
          <p className="center">You don't have the access permission to the page. Please consult the {type} admin about your permissions.</p>
          <div className="modal-one-btn">
            <button className="yes" onClick={this.exitModal.bind(this)}>OK</button>
          </div>
        </div>
      </div>
    );
  }
}
