import React from "react";

export default class Pagination extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    }
  }

  clickPage(i) {
    this.setState({activeIndex: i});
    this.props.setPage(i + 1);
  }

  render() {
    const {activeIndex} = this.state;
    const numResults = this.props.numResults || 0;
    const itemsPerPage = this.props.itemsPerPage || 20;

    const pageList = Array(Math.ceil(numResults / itemsPerPage)).fill().map((_, idx) => 1 + idx);

    return (
      <div className="pagination clearfix">
        <i className={"material-icons " + (activeIndex === 0 && "hidden")}
           onClick={() => this.setState({activeIndex: activeIndex - 1})}>chevron_left</i>
        <ul className="page-list">
          {pageList.map((num, i) =>
            <li className={activeIndex === i && "active"} onClick={this.clickPage.bind(this, i)}>{num}</li>
          )}
        </ul>
        <i className={"material-icons " + (activeIndex >= pageList.length - 1 && "hidden")}
           onClick={() => this.clickPage(activeIndex + 1)}>chevron_right</i>
      </div>
    );
  }

}
