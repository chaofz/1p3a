import React from "react";

export default class extends React.Component {

  onChange(e) {
    const freq = this.refs.freqSelect.value;
    this.setState({frequency: freq});
  }

  render() {
    return (
      <div className="notification">
        <p className="item">Notification frequency:</p>
        <p className="descr">You will be emailed immediately if a seat is found. This setting is to to reduce redundent
        following emails after the first email is sent.
        </p>
        <select ref='freqSelect' onChange={this.onChange.bind(this)} value={this.state.frequency}>
          <option value="1">Every 1 minute</option>
          <option value="5">Every 5 minutes</option>
          <option value="10">Every 10 minutes</option>
        </select>
        {this.state.msg && <span className="msg">{this.state.msg}</span>}
      </div>
    );
  }
};

