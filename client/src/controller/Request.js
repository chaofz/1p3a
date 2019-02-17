import "whatwg-fetch";

const Request = {

  post: {
    getAll() {
      return fetch('/api/posts', option('get')).then(handleRes);
    },

    getByQuery(query) {
      return fetch('/api/posts?' + query, option('get')).then(handleRes);
    },

    getById(id) {
      return fetch(`/api/posts/${id}`, option('get')).then(handleRes);
    },

    getRank(query) {
      return fetch('/api/posts/ranking?' + query, option('get')).then(handleRes);
    },

    changeBookmark(req) {
      return fetch('/api/posts/', option('post', req)).then(handleRes);
    },

  },
  user: {
    getBookmarks(clientID) {
      return fetch(`/api/posts/bookmarks/${clientID}`, option('get')).then(handleRes);
    }
  }
};

export default Request;

function option(method, req) {
  return {
    method: method,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'x-access-token': localStorage.token || ''
    },
    body: JSON.stringify(req)
  }
}

function handleRes(res) {
  let json = res.json();
  return res.status < 400 ?
    json :
    json.then(json => {
      throw json;
    });
}
