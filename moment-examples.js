var moment = require('moment');

var now = moment();

now.subtract(4, 'hour');

console.log(now.format('MMM Do YYYY, hh:mm A'));
console.log(now.unix());
console.log(now.valueOf());

var timestamp = 1487238645512;

var tsMoment = moment.utc(timestamp);

console.log(tsMoment.local().format('hh:mm A'));
