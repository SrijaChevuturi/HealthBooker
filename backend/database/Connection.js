const mc=require('mongodb').MongoClient

mc.connect('mongodb://localhost:27017/healthbooker')
.then(client => {
  console.log("DB connected");
})
.catch((error) => {
  console.log("Error: ", error);

  return error;
});

module.exports = client;
