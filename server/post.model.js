const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  tid: Number,
  title: String,
  author: String,
  sourceUrl: String,

  createdDate: Date,
  views: Number,
  companyName: String,
  freshOrSwitch: String,

  seekTime: String,
  jobField: String,
  highestDegree: String,
  jobType: String,

  jobSource: String,
  interviewTypes: [String],
  interviewResult: String,


  content: String,
  contentScraped: Boolean,
});

//postSchema.index({content: 'text'});
postSchema.index({title: 'text'});

module.exports = mongoose.model('Post', postSchema);
