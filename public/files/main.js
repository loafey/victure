/*console.log(moment().remove(moment(), "minutes").format("hh:mm:ss"));
console.log(deleteTime);*/

var now = moment();
var deletedAt = now.clone().hour(10).minute(deleteTime).second(0);

console.log(deletedAt.from(now));