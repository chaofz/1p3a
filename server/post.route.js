const express = require('express');
const Post = require('./post.model');
const User = require('./user.model');
const router = express.Router();
module.exports = router;
const POST_NUM = 10;

router.get('/ranking', showCompanyRank);
router.get('/', checkClient, afterCheckingClient);
router.get('/:id', getPost);
router.get('/bookmarks/:clientID', findUser, getBookmarks);
router.post('/', findUser, changeBookmark);

function showCompanyRank(req, res) {
  const {postType, freshOrSwitch, type, start, end} = req.query;
  const match = {};
  if(start || end)
    match.createdDate = {}
  if (start)
    match.createdDate = {$gt: new Date(start)};
  if (end)
    match.createdDate.$lt = new Date(end);
  if (postType)
    match.postType = postType;
  if (type)
    match.interviewTypes = type;
  if (freshOrSwitch)
    match.freshOrSwitch = freshOrSwitch;

  Post.aggregate([
    {$match: match},
    {$group: {"_id": "$companyName", "count": {$sum: 1}}},
    {"$sort": {"count": -1}}
  ], (err, result) => {
    err ? res.status(500).json(err) : res.status(200).json(result);
  });
}

function checkClient(req, res, next) {
  const {clientID} = req.query;
  User.findById(clientID, (err, user) => {
    if (user) {
      req.user = user;
      next();
    } else {
      User.create({_id: clientID}, (err, user) => {
        req.user = user;
        next();
      });
    }
  });
}

function afterCheckingClient(req, res) {
  const {showBookmarks, clientID} = req.query;
  if (!showBookmarks) {
    showSortedPage(req, res);
  } else {
    bookmarksSelected(req, res);
  }
}

function bookmarksSelected(req, res) {
  const {user} = req;
  let {order, page, summary} = req.query;
  req.query.order = undefined;
  req.query.page = undefined;
  req.query.clientID = undefined;
  req.query.showBookmarks = undefined;
  let pageNum = page || 0;
  let skipCount = pageNum < 0 ? 0 : pageNum * POST_NUM;
  if (summary) {
    delete req.query.summary;
    req.query['title'] = /.*总结|汇总|整理.*/;
  }
  const orderFunc = order ? (a, b) => b.views - a.views : (a, b) => b.tid - a.tid;

  User.findOne(user)
    .populate({path: 'bookmarks', match: req.query})
    .exec((err, user) => {
      const result = {};
      result.count = user.bookmarks.length;
      result.postsPerPage = POST_NUM;
      user.bookmarks.sort(orderFunc)
      const bookmarks = user.bookmarks.splice(skipCount, skipCount + POST_NUM + 1);
      result.posts = bookmarks;

      err ? res.status(500).json(err) : res.status(200).json(result);
    });
}

function findUser(req, res, next) {
  const clientID = req.params.clientID || req.body.clientID;

  User.findById(clientID, (err, user) => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(200).json({});
    }
  });
}

function getBookmarks(req, res) {
  res.status(200).json(req.user);
}

function changeBookmark(req, res) {
  const {tid, action} = req.body;
  const {user} = req;
  const findIndex = user.bookmarks.findIndex(id => id.equals(tid));
  console.log("changeBookmark", findIndex);
  if (action === 'add' && findIndex < 0) {
    user.bookmarks.push(tid);
  } else if (action === 'remove' && findIndex >= 0) {
    user.bookmarks.splice(findIndex, 1);
  }
  user.save((err, user) => {
    console.log(user.bookmarks);
    err ? res.sendStatus(500) : res.status(200).json(user);
  });
}

function showSortedPage(req, res) {
  let {order, page, summary, searchQuery, postType, companyName} = req.query;
  req.query.order = undefined;
  req.query.page = undefined;
  req.query.clientID = undefined;
  req.query.summary = undefined;
  req.query.searchQuery = undefined;
  order = order || 'tid';
  let pageNum = page || 0;
  let skipCount = pageNum < 0 ? 0 : pageNum * POST_NUM;

  if (summary)
    req.query['title'] = /.*总结|汇总|整理.*/;

  if (postType !== 'Interview Experience') {
    req.query.freshOrSwitch = undefined;
    req.query.jobType = undefined;
  }

  if(postType === 'Company Inside' && companyName) {
    req.query['companyName'] = new RegExp('.*' + companyName + '.*');
  }
  console.log(req.query['companyName'])

  if(searchQuery)
    req.query.$text = {$search: '"' + searchQuery + '"'};

  console.log(req.query);

  const countQuery = Post.find(req.query).count((err, count) => {});
  const query = Post.find(req.query)
    .sort('-' + order)
    .skip(skipCount)
    .limit(POST_NUM);

  query.exec((err, posts) => {
    countQuery.count().exec((err, count) => {
      posts = posts.map(post => {
        return post;
      });
      const result = {};
      result.posts = posts;
      result.count = count;
      result.postsPerPage = POST_NUM;

      err ? res.status(500).json(err) : res.status(200).json(result);
    });
  });
}

function getPost(req, res) {
  const {id} = req.params;
  Post.findOne({'tid': id}, (err, post) => {
    err ? res.sendStatus(404) : res.status(200).json(post);
  });
}

