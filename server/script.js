db.posts.aggregate([ 
  { $match: { 
      createdDate: { $gt: ISODate("2016-08-01T00:00:00.0Z") },
      interviewTypes: "onsite"
    },
  },
  { $group: {"_id":"$companyName", "count":{$sum:1}}}, 
  { "$sort": { "count": -1 }}
]).toArray();


