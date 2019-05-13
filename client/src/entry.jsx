import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, browserHistory} from "react-router";
import MainApp from "./components/index/MainApp.jsx";
import PostPage from "./components/index/PostPage.jsx";
import Ranking from "./components/index/Ranking.jsx";

const AppRouter = (
  <Router history={browserHistory}>
    <Route path="/" component={MainApp}>
       {/*<Route path="posts/:id" component={PostPage}/>*/}
    </Route>
    <Route path="/rank" component={Ranking} />
  </Router>
);

ReactDOM.render(AppRouter, document.getElementById('app'));
