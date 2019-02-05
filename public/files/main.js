/*console.log(moment().remove(moment(), "minutes").format("hh:mm:ss"));
console.log(deleteTime);*/

var now = moment().format("hh:mm:ss");
console.log(now);
var deletedAt = deleteTime;
console.log(deletedAt);

var duration = moment.duration(moment().diff(now, deletedAt), "minutes");
var hours = duration.asMinutes();

console.log(hours);