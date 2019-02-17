const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  tid: Number,
  title: String,
  author: String,
  createdDate: Date,
  views: Number,
  sourceUrl: String,

  seekTime: String,
  jobField: String,
  highestDegree: String,
  jobType: String,
  companyName: String,
  jobSource: String,
  interviewTypes: [String],
  interviewResult: String,
  freshOrSwitch: String,

  content: String,
  contentScraped: Boolean,
});

postSchema.index({content: 'text'});

module.exports = mongoose.model('Post', postSchema);
