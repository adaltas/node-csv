var csv = require('../lib');

csv()
.from(__dirname+"/transform-async.csv")
.transform(function(record, index, callback){
  console.log(record);
  setTimeout(function(){
    callback();
  }, 1000);
}, {parallel: 1})
.on("end", function () {
  console.log("done");
});