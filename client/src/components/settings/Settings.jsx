import React from "react";
import {Link} from "react-router";

export default class Settings extends React.Component {

  render() {
    return (
      <div id="settings">
        <h1 className="page-head">Settings</h1>
        <div className="row">
          <div className="left-panel t3 pm12">
            <Link activeClassName="active" to="/settings/account">Account</Link>
          </div>
          <div className="right-panel card t9 pm12">
            <div>{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }
}
