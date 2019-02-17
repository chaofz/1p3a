import React from "react";
import Request from "../../controller/Request";
import utils from "../../controller/utils";
import routeHandler from "../../controller/routeHandler";

export default class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.params.id,
    };
  }

  componentDidMount() {
    const {posts} = this.props;
    const post = posts.find(post => post.tid === parseInt(this.state.postId));
    console.log('post', posts);
    if (post) {
      this.setState(post);
    } else {
      Request.post.getById(this.state.postId)
        .then(res => {
          console.log('SetTitle');
          console.log('PostPage', res);
          this.setState(res);
        });
    }

  }

  exitModal(e) {
    e.preventDefault();
    document.title = "1p3a";
    utils.lockScroller(false);
    routeHandler.redirectTo('/');
  }

  render() {
    const {
      tid, title, author, createdDate, views, sourceUrl, seekTime, jobField, highestDegree, jobType, companyName,
      jobSource, interviewTypes, interviewResult, freshOrSwitch, content
    } = this.state;
    title ? document.title = title : "";
    utils.lockScroller(true);
    return (
      <div id="post-page" onClick={this.exitModal}>
        <div className="card" onClick={(e) => e.stopPropagation()}>
          <i className="material-icons close" onClick={this.exitModal}>close</i>
          <h1>{title}</h1>
          <div className="post-subtitle">
            <h3 className="author">{author}</h3>
            <h3 className="date">{createdDate && createdDate.substring(0, 10)}</h3>
            <h4 className="views">{views} views</h4>
          </div>
          <div className="tag-row">
            <span className="companyName selected">{companyName}</span>
            <span className="interviewType selected">{interviewTypes}</span>
            <span className="seekTime selected">{seekTime}</span>
            <span className="jobType selected">{jobType}</span>
            <span className="freshOrSwitch selected">{freshOrSwitch}</span>
            <span className="interviewResult selected">{interviewResult}</span>
          </div>
          <div className="rich-text" dangerouslySetInnerHTML={{__html: content}}></div>
          <div className="source">
            <a href={sourceUrl} target="_blank">Source</a>
            {/*<i>- All rights belong to the author.</i>*/}
          </div>
        </div>
      </div>
    );
  }
};
