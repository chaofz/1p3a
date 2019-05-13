import React from "react";
import PostList from "./PostList.jsx";
import Request from "../../controller/Request";
import utils from "../../controller/utils";
import routeHandler from "../../controller/routeHandler";
import AppModel from "../../models/AppModel";
import AppConfig from '../../models/AppConfig';
import {Link} from "react-router";

const companyOptions = AppConfig.companyOptions;
const postTypes = AppConfig.postTypes;

export default class MainApp extends React.Component {

  constructor(props) {
    super(props);
    const filter = new Map();
    filter.set('jobType', 'fulltime');
    const clientID = AppModel.getClientId();
    this.state = {
      posts: [],
      filter,
      clientID,
      postPageOpen: !!this.props.params.id,
      activeJobType: 'fulltime',
    };
  }

  onTagClick(catName, itemName) {
    const {filter} = this.state;
    filter.delete('page');
    if (filter.get(catName) === itemName || itemName === 'All') {
      filter.delete(catName);
    } else {
      filter.set(catName, itemName);
    }

    // console.log(filter.get('freshOrSwitch'));
    const cats = {
      activePostType: filter.get('postType'),
      activeCompanyName: filter.get('companyName'),
      activeInterviewType: filter.get('interviewTypes'),
      activeSeekTime: filter.get('seekTime'),
      activeJobType: filter.get('jobType'),
      activeFreshOrSwitch: filter.get('freshOrSwitch'),
      activeInterviewResult: filter.get('interviewResult'),
      activeOrder: filter.get('order'),
      activeSummary: filter.get('summary'),
      activeBookmarks: filter.get('showBookmarks'),
      activeSearchQuery: filter.get('searchQuery')
    };
    this.setState(cats);
    this.sendFilteredRequest(filter);
  }

  onChangeSignUpVisibility(showOrNot) {
    this.setState({showSignUp: showOrNot});
  }

  onGlobalClick(e) {
    if (this.state.showDropdown && !e.target.matches('.dropdown')) {
      this.setState({showDropdown: false});
    }
  }

  sendFilteredRequest(filter) {
    let query = '';
    if(filter.has('companyName'))
      filter.set('companyName', filter.get('companyName').replace(/\s/g,'').toLowerCase());
    for (const catName of filter.keys()) {
      query += `${catName}=${filter.get(catName)}&`;
    }
    query += `clientID=${AppModel.getClientId()}`;
    console.log(query)
    // console.log(filter, query)
    Request.post.getByQuery(query)
      .then(res => {
        // console.log('MainApp init', res.count);
        this.setState(res);
      })
      .catch(err => {
        this.setState({err: err.message});
      });
  }

  onClickPage(data) {
    const {page, filter} = this.state;
    if (page != data.selected) {
      this.setState({page: data.selected});
      console.log('onClickPage', this.state.page);
      filter.set('page', data.selected);
      this.sendFilteredRequest(filter);
    }
  }

  handleCompanyNameChange(e) {
    if (e.target.value !== '请选择')
      this.onTagClick('companyName', e.target.value);
  }

  handlePostTypeChange(e) {
    if (e.target.value !== '请选择')
      this.onTagClick('postType', e.target.value);
  }

  handleSeekTimeChange(e) {
    if (e.target.value !== '请选择')
      this.onTagClick('seekTime', e.target.value);
  }

  handleCompanySubmit(e) {
    e && e.preventDefault();
    if(this.refs.company.value !== this.companyInput) {
      this.companyInput = this.refs.company.value;
      this.onTagClick('companyName', this.refs.company.value);
    }
  }

  handleSearchQuerySubmit(e) {
    e && e.preventDefault();
    if(this.refs.searchQuery.value !== this.searchQueryInput) {
      this.searchQueryInput = this.refs.searchQuery.value;
      this.onTagClick('searchQuery', this.refs.searchQuery.value);
    }
  }

  componentWillReceiveProps(nextProps) {
    const postPageOpen = nextProps.params.id;
    this.setState({postPageOpen})
  }

  componentDidMount() {
    const {filter} = this.state;
    this.sendFilteredRequest(filter);
  }

  exitModal(e) {
    e.preventDefault();
    utils.lockScroller(false);
    routeHandler.redirectTo('/');
  }

  render() {
    const {
      posts, count, postsPerPage, showSignUp, content, activePostType, activeCompanyName, activeInterviewType, activeSeekTime, activeJobType,
      activeFreshOrSwitch, activeInterviewResult, activeOrder, activeSearchQuery, activeSummary, activeBookmarks, postPageOpen, clientID, page
    } = this.state;
    const activeTags = {
      activePostType,
      activeCompanyName,
      activeInterviewType,
      activeSeekTime,
      activeJobType,
      activeFreshOrSwitch,
      activeInterviewResult,
      activeOrder,
      activeSummary,
      activeBookmarks,
    };
    console.log("activePostType", activePostType);
    return (
      <div id="main" onClick={this.onGlobalClick.bind(this)}>
        <div className="filter-area">
          <h2 className="site-head">1p3a</h2>
          <div className="category" id="postType">
            <span className="category-name">论坛版块</span>
            <select value={this.state.value} onChange={this.handlePostTypeChange.bind(this)}>
              {postTypes.map(postType => <option value={postType}>{postType}</option>)}
            </select>
          </div>
          <div className="category" id="company">
            <span className="category-name">公司名称</span>
            <select value={this.state.value} onChange={this.handleCompanyNameChange.bind(this)}>
              {companyOptions.map(company => <option value={company}>{company}</option>)}
            </select>
          </div>
          <div className="category">
            <span className="category-name">手动输入</span>
            <form onSubmit={this.handleCompanySubmit.bind(this)}>
              <input type="text" id="companyInput" ref='company' placeholder="Company" />
            </form>
          </div>
          <div className="category">
            <span className="category-name">搜索内容</span>
            <form onSubmit={this.handleSearchQuerySubmit.bind(this)}>
              <input type="text" id="searchQueryInput" ref='searchQuery' />
            </form>
          </div>
          {activePostType === 'Interview Experience' &&
          <div className="category">
            <span className="category-name">面试类别</span>
            <div className="space"></div>
            <span className={`tag interviewType ${activeInterviewType === 'oa' ? 'selected' : ''}`}
                  onClick={() => this.onTagClick('interviewTypes', 'oa')}>OA</span>
            <span className={`tag interviewType ${activeInterviewType === 'campus' ? 'selected' : ''}`}
                  onClick={() => this.onTagClick('interviewTypes', 'campus')}>Campus</span>
            <span className={`tag interviewType ${activeInterviewType === 'phone' ? 'selected' : ''}`}
                  onClick={() => this.onTagClick('interviewTypes', 'phone')}>电面</span>
            <span className={`tag interviewType ${activeInterviewType === 'onsite' ? 'selected' : ''}`}
                  onClick={() => this.onTagClick('interviewTypes', 'onsite')}>昂赛</span>
          </div>}
          <hr/>
          {activePostType === 'Interview Experience' &&
          <div className="row">
            <div className="category">
              <span className="category-name">应届跳槽</span>
              <span className={`tag freshOrSwitch ${activeFreshOrSwitch === 'fresh' ? 'selected' : ''}`}
                    onClick={() => this.onTagClick('freshOrSwitch', 'fresh')}>应届</span>
              <span className={`tag freshOrSwitch ${activeFreshOrSwitch === 'switch' ? 'selected' : ''}`}
                    onClick={() => this.onTagClick('freshOrSwitch', 'switch')}>跳槽</span>
            </div>
            <div className="category">
              <span className="category-name">工作类别</span>
              <span className={`tag jobType ${activeJobType === 'fulltime' ? 'selected' : ''}`}
                    onClick={() => this.onTagClick('jobType', 'fulltime')}>全职</span>
              <span className={`tag jobType ${activeJobType === 'intern' ? 'selected' : ''}`}
                    onClick={() => this.onTagClick('jobType', 'intern')}>实习</span>
            </div>
          </div>}
          {activePostType === 'Interview Experience' && <hr/>}
          <div className="category">
            <span className="category-name">结果排序</span>
            {/*<span className={`tag order ${activeOrder === 'createdDate' ? 'selected' : ''}`}*/}
            {/*onClick={() => this.onTagClick('order', 'createdDate')}>发帖时间</span>*/}
            <span className={`tag order ${activeOrder === 'views' ? 'selected' : ''}`}
                  onClick={() => this.onTagClick('order', 'views')}>查看数量</span>
          </div>
          <div className="category">
            <span className="category-name">显示总结</span>
            <span className={`tag summary ${activeSummary === 'yes' ? 'selected' : ''}`}
                  onClick={() => this.onTagClick('summary', 'yes')}>筛选</span>
          </div>
          <div className="category">
            <span className="category-name">显示收藏</span>
            <span className={`tag clientID ${activeBookmarks === 'yes' ? 'selected' : ''}`}
                  onClick={() => this.onTagClick('showBookmarks', 'yes')}>显示</span>
          </div>
          <div className="rank-link">
            <Link to="rank">Rank</Link>
          </div>
        </div>
        <div className={`right-panel ${postPageOpen && ' blur'}`}>
          <div className="list">
            <div className="filters-row">
              <span className="col-head">Filters</span>
              {activePostType && <span className="tag postType selected">{activePostType}</span>}
              {activeCompanyName && <span className="tag companyName selected">{activeCompanyName}</span>}
              {activeInterviewType && <span className="tag interviewType selected">{activeInterviewType}</span>}
              {activeSeekTime && <span className="tag seekTime selected">{activeSeekTime}</span>}
              {activeJobType && <span className="tag jobType selected">{activeJobType}</span>}
              {activeFreshOrSwitch && <span className="tag freshOrSwitch selected">{activeFreshOrSwitch}</span>}
              {activeInterviewResult && <span className="tag interviewResult selected">{activeInterviewResult}</span>}
              {activeOrder && <span className="tag order selected">{activeOrder}</span>}
              {activeSearchQuery && <span className="tag seekTime selected">{activeSearchQuery}</span>}
            </div>
            <PostList posts={posts} count={count} postsPerPage={postsPerPage}
                      activeTags={activeTags}
                      initialPage={page}
                      onClickPage={this.onClickPage.bind(this)}/>
          </div>
          <div id="footer">
            <div className="copy-right">
              {/*All rights belong to 1point3acres.*/}
            </div>
          </div>
        </div>
        {this.props.children && React.cloneElement(this.props.children, {
          posts: posts
        })}
        <div className="modals">
          {showSignUp && <SignUpModal show={showSignUp} changeVisibility={this.onChangeSignUpVisibility.bind(this)}/>}
        </div>
      </div>
    );
  }
};
