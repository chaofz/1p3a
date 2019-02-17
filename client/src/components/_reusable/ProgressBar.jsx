import React from 'react';
import pace from '../../../assets/pace/pace';

export default class Pace extends React.Component {

  componentDidMount() {
    pace.start({
      elements: false,

      // Only show the progress on regular and ajax-y page navigation,
      // not every request
      restartOnRequestAfter: false
    });
  }

  render() {
    return <div className="progress-bar"></div>;
  }
}
