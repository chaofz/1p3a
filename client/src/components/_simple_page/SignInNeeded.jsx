import React from "react";
import auth from "../../controller/auth";
import routeHandler from "../../controller/routeHandler";
import SignInModal from "../_reusable/SignInModal.jsx";
import ForgetPassModal from "../_reusable/ForgetPassModal.jsx";

export default class SignInNeeded extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      for: this.props.location.query.for,
      showSignIn: true,
      showForgetPass: false,
    }
  }

  onLoggedIn() {
    auth.indexLoggedIn();
    routeHandler.redirectTo(this.state.for || '/');
  }

  onChangeSignInVisibility(showOrNot) {
    if (!showOrNot) {
      this.setState({showSignIn: showOrNot});
      if (history.length <= 2) {
        routeHandler.redirectTo('/');
      } else {
        history.go(-1);
      }
    }
  }

  onChangeForgetPassVisibility(showOrNot) {
    this.setState({showSignIn: !showOrNot, showForgetPass: showOrNot});
  }

  render() {
    const {showSignIn, showForgetPass} = this.state;
    return (
      <div>
        {showSignIn && <SignInModal show={showSignIn} title="Please sign in to continue"
                                    changeVisibility={this.onChangeSignInVisibility.bind(this)}
                                    callForgetPass={this.onChangeForgetPassVisibility.bind(this, true)}
                                    loggedIn={this.onLoggedIn.bind(this)}/>}
        {showForgetPass && <ForgetPassModal
          show={showForgetPass} changeVisibility={this.onChangeForgetPassVisibility.bind(this)}/>}
      </div>
    );
  }
}
