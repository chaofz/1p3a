import React from "react";
import {Link} from "react-router";
import ReactPaginate from "react-paginate";
import Request from "../../controller/Request";
import AppModel from "../../models/AppModel";

export default class PostList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bookmarks: []
    };
  }

  onClickStar(tid, action, e) {
    e.preventDefault();
    const req = {
      clientID: AppModel.getClientId(),
      tid,
      action
    };
    Request.post.changeBookmark(req)
      .then(res => {
        // console.log("changeBookmark", res);
        this.setState(res);
      });
  }

  componentDidMount() {
    Request.user.getBookmarks(AppModel.getClientId())
      .then(res => {
        // console.log("getBookmarks", res);
        this.setState(res);
      });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.page)
    this.setState({page: nextProps.page});
  }

  render() {
    const {
      posts, count, postsPerPage, activePostType, activeCompanyName, activeInterviewType, activeSeekTime, activeJobType,
      activeFreshOrSwitch, activeInterviewResult, activeOrder,
    } = this.props;
    const {bookmarks} = this.state;
    // console.log("refresh", bookmarks);
    return (
      <div className="project-list">
        <ul className="projects row">
          {posts.map(post => {
            postProcess(post);
            const starType = bookmarks.includes(post._id) ? 'star' : 'star_border';
            const action = starType === 'star' ? 'remove' : 'add';
            return (<li className="pm12">
                <a className="project" href={post.sourceUrl} target="_blank">
                  <div className="text-description">
                    <h3>
                      {post.title}
                      <i className={`material-icons ${starType}`}
                         onClick={this.onClickStar.bind(this, post._id, action)}>{starType}</i>
                    </h3>
                    <ul className="tags">
                      {post.createdDate.substring(0, 10)}
                      <span className="views">{post.views} views</span>
                      <li className="post-type">{post.postType}</li>
                      {/*/!*{!activeJobField && <li className="job-field">{post.jobField}</li>}*!/*/}
                      {/*{!activeJobType && <li className="job-type">{post.jobType}</li>}*/}
                      {/*{!activeInterviewType && <li className="job-source">{post.interviewTypes}</li>}*/}
                      {/*{!activeSeekTime && <li className="seek-time">{post.seekTime}</li>}*/}
                      {/*{!activeFreshOrSwitch && <li className="fresh-or-switch">{post.freshOrSwitch}</li>}*/}
                      {/*{!activeInterviewResult && <li className="interview-result">{post.interviewResult}</li>}*/}
                      {/*<span className="views">{post.views} views</span>*/}
                    </ul>
                  </div>
                </a>
              </li>);
            }
          )}
        </ul>
        {/*<div className="next-page-bar">Next Page</div>*/}
        <ReactPaginate previousLabel={<i className={"material-icons"}>chevron_left</i>}
                       nextLabel={<i className={"material-icons"}>chevron_right</i>}
                       breakLabel={<a href="">...</a>}
                       breakClassName={"break-me"}
                       pageCount={Math.ceil(count / postsPerPage)}
                       initialPage={this.props.initialPage}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       onPageChange={this.props.onClickPage}
                       containerClassName={"pagination"}
                       subContainerClassName={"pages pagination"}
                       activeClassName={"active"}/>
      </div>
    );
  }
};

function postProcess(post) {
  if (post.freshOrSwitch === 'fresh grad应届毕业生') {
    post.freshOrSwitch = '应届';
  } else if (post.freshOrSwitch === '在职跳槽') {
    post.freshOrSwitch = '跳槽';
  }
  if (post.interviewTypes) {
    post.interviewTypes = post.interviewTypes.map(type => {
      if (type.startsWith('技术电面')) {
        type = '电面';
      } else if (type.startsWith('在线笔试')) {
        type = 'OA'
      } else if (type.startsWith('HR筛选')) {
        type = 'HR面'
      }
      return type;
    });
  }
}

