import {browserHistory} from 'react-router';

const routeHandler = {

  redirectTo(route) {
    browserHistory.push(route);
  },

  redirectIfLoggedIn(nextState, replace) {
    if (localStorage.token) {
      replace({
        pathname: '/dashboard',
        state: {nextPathname: nextState.location.pathname}
      });
    }
  }
};

export default routeHandler;
