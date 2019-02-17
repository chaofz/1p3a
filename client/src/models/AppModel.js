const AppModel = {
  userId: localStorage.userId || '',

  saveUser(id, name) {
    localStorage.userId = id;
    localStorage.name = name;
    AppModel.userId = id;
  },

  removeUser() {
    delete localStorage.userId;
    delete localStorage.name;
    delete localStorage.profile;
    AppModel.userId = undefined;
  },

  getClientId() {
    if (!localStorage.clientID) {
      localStorage.clientID = JSON.stringify(Math.random());
    }
    if (!AppModel.clientID) {
      AppModel.clientID = JSON.parse(localStorage.clientID);
    }
    return AppModel.clientID;
  },

  checkBookmarkField() {
    if (!localStorage.bookmarks) {
      console.log('if (!localStorage.bookmarks) {');
      localStorage.bookmarks = JSON.stringify([]);
    }
    if (!AppModel.bookmarks) {
      console.log('if (!AppModel.bookmarks) {');
      AppModel.bookmarks = JSON.parse(localStorage.bookmarks);
      console.log('checkBookmarkField', AppModel.bookmarks);
    }
  },

  cacheProfile(profile) {
    localStorage.profile = JSON.stringify(profile);
  },

  getProfileCache() {
    return new Promise((resolve, reject) => {
      if (localStorage.profile) {
        resolve(JSON.parse(localStorage.profile));
      } else {
        reject({message: 'doesn\'t have profile cache'});
      }
    });
  },

  hasProfileCache() {
    return !!localStorage.profile;
  }
};

export default AppModel;

