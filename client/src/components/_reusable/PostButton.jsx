import React from 'react';
import AppConfig from "../../models/AppConfig";

const requestText = AppConfig.button.requestText;

export default class PostButton extends React.Component {
  render() {
    const {className, defaultText, requesting, onClick} = this.props;
    return (
      <button className={className} onClick={onClick} type="submit"
              disabled={requesting}>{requesting ? requestText : defaultText}</button>
    );
  }
}

PostButton.propTypes = {
  requesting: React.PropTypes.element.isRequired
};

PostButton.defaultProps = {
  className: 'yes',
  defaultText: 'Submit'
};
