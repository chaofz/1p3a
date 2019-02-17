import React from "react";
import Request from "../../controller/Request";
import utils from "../../controller/utils";
import routeHandler from "../../controller/routeHandler";

export default class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ranking: [],
    }
    this.request.bind(this);
  }

  componentDidMount() {
    this.request('');
  }

  request(query) {
    Request.post.getRank(query)
      .then(res => {
        this.setState({ranking: res});
      })
  }

  handleSelectChange(e) {
    if (e.target.value !== '请选择') {
      const type = e.target.value;
      this.setState({type});
      this.request(`type=${type}&start=${this.state.start || ''}&end=${this.state.end || ''}`);
    }
  }

  handleDateSubmit(e) {
    // e && e.preventDefault();
    if(e.keyCode == 13) {
      const start = this.refs.start.value;
      const end = this.refs.end.value;
      console.log(start, end);
      this.setState({start, end});
      this.request(`type=${this.state.type || ''}&start=${start || ''}&end=${end || ''}`);
    }
  }

  onStartDateFocus(e) {
    if(e.target.value === '')
      this.refs.start.value = '2017-08-01';
  }

  render() {
    const {ranking} = this.state;
    console.log(ranking)
    return (
      <div id="rank-page">
        <div className="container">
          <div className="filter">
            <select value={this.state.value} onChange={this.handleSelectChange.bind(this)}>
              <option value=''>请选择</option>
              <option value='oa'>OA</option>
              <option value='campus'>Campus</option>
              <option value='phone'>Phone</option>
              <option value='onsite'>Onsite</option>
            </select>
            {/*<form onSubmit={this.handleDateSubmit.bind(this)}>*/}
            <input type="text" id="start" ref='start'
                   onKeyDown={this.handleDateSubmit.bind(this)}
                   onFocus={this.onStartDateFocus.bind(this)} placeholder="YYYY-MM-DD"/>
            <input type="text" id="end" ref='end'
                   onKeyDown={this.handleDateSubmit.bind(this)} placeholder="YYYY-MM-DD"/>
            {/*</form>*/}
          </div>
          <div className="list">
            {
              ranking.map(company =>
                <div className="item">
                  {company._id || 'N/A'}
                  <div className="count">{company.count}</div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
};
