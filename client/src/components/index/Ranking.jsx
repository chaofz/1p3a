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

  handlePostTypeSelectChange(e) {
    if (e.target.value !== 'Post Type') {
      const postType = e.target.value;
      this.setState({postType});
      const {freshOrSwitch, stageType, start, end} = this.state;
      this.request(`postType=${postType || ''}&freshOrSwitch=${freshOrSwitch || ''}&stageType=${stageType || ''}&start=${start || ''}&end=${end || ''}`);
    }
  }

  handleFreshOrSwitchSelectChange(e) {
    console.log('here')
    if (e.target.value !== 'Interview Stage') {
      const freshOrSwitch = e.target.value;
      this.setState({freshOrSwitch});
      const {postType, stageType, start, end} = this.state;
      this.request(`postType=${postType || ''}&freshOrSwitch=${freshOrSwitch || ''}&stageType=${stageType || ''}&start=${start || ''}&end=${end || ''}`);
    }
  }

  handleStageSelectChange(e) {
    if (e.target.value !== 'Interview Stage') {
      const stageType = e.target.value;
      this.setState({stageType});
      const {postType, freshOrSwitch, start, end} = this.state;
      this.request(`postType=${postType || ''}&freshOrSwitch=${freshOrSwitch || ''}&stageType=${stageType || ''}&start=${start || ''}&end=${end || ''}`);
    }
  }

  handleDateSubmit(e) {
    // e && e.preventDefault();
    if(e.keyCode == 13) {
      const start = this.refs.start.value || '';
      const end = this.refs.end.value || '';
      this.setState({start, end});
      const {postType, freshOrSwitch, stageType} = this.state;
      this.request(`postType=${postType || ''}&freshOrSwitch=${freshOrSwitch || ''}&stageType=${stageType || ''}&start=${start || ''}&end=${end || ''}`);
    }
  }

  onStartDateFocus(e) {
    if(e.target.value === '')
      this.refs.start.value = '2017-08-01';
  }

  render() {
    const {ranking, postType} = this.state;
    return (
      <div id="rank-page">
        <div className="container">
          <div className="filter">
            <select className="ranking-select" value={this.state.value} onChange={this.handlePostTypeSelectChange.bind(this)}>
              <option value=''>== Post Type ==</option>
              <option value='Interview Experience'>Interview Experience</option>
              <option value='Company Inside'>Company Inside</option>
              <option value='Package'>Package</option>
              <option value='Referral'>Referral</option>
            </select>
            {postType === 'Interview Experience'&&
            <select className="ranking-select" value={this.state.value} onChange={this.handleFreshOrSwitchSelectChange.bind(this)}>
              <option value=''>== Fresh/Switch ==</option>
              <option value='fresh'>Fresh</option>
              <option value='switch'>Switch</option>
            </select>}
            {postType === 'Interview Experience'&&
            <select className="ranking-select" value={this.state.value} onChange={this.handleStageSelectChange.bind(this)}>
              <option value=''>== Interview Stage ==</option>
              <option value='oa'>OA</option>
              <option value='campus'>Campus</option>
              <option value='phone'>Phone</option>
              <option value='onsite'>Onsite</option>
            </select>}
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
                  <div className="count"><span>&nbsp;</span>{company.count}</div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
};
