use onePoint3Acres

// general sort index
db.posts.createIndex({postType: 1, views: -1})
db.posts.createIndex({postType: 1, createdDate: -1})

// interview experience index
db.posts.createIndex({postType: 1, jobType: 1, companyName: 1, freshOrSwitch: 1, interviewTypes: 1, createdDate: -1, views: -1})

// non-interview experience index
db.posts.createIndex({postType: 1, companyName: 1, views: -1})
db.posts.createIndex({postType: 1, companyName: 1, createdDate: -1})

// interview experience ranking page index
db.posts.createIndex({companyName: 1, jobType: 1, postType: 1, freshOrSwitch: 1, interviewTypes: 1, createdDate: -1})

// non-interview experience ranking page index
db.posts.createIndex({companyName: 1, postType: 1, createdDate: -1})

db.posts.createIndex({title: 'text'})