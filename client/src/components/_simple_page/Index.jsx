import React from "react";
import {withRouter} from "react-router";
import SignUpModal from "../_reusable/SignUpModal.jsx";

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showSignUp: false,
    };
  }

  onChangeSignUpVisibility(showOrNot) {
    this.setState({showSignUp: showOrNot});
  }

  onGlobalClick(e) {
    if (this.state.showDropdown && !e.target.matches('.dropdown')) {
      this.setState({showDropdown: false});
    }
  }

  render() {
    const {showSignUp} = this.state;
    return (
      <div onClick={this.onGlobalClick.bind(this)}>
        <div className="content">
          <div className="list container">
            {this.props.children}
          </div>
        </div>
        <div className="modals">
          {showSignUp && <SignUpModal show={showSignUp} changeVisibility={this.onChangeSignUpVisibility.bind(this)}/>}
        </div>
      </div>
    );
  }
}

export default withRouter(Index);
