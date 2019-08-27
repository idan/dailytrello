(function() {
  'use strict';
  var TRELLO_KEY = process.env.TRELLO_KEY;
  var TRELLO_TOKEN = process.env.TRELLO_TOKEN;
  var DESTINATION_LIST = process.env.DESTINATION_LIST_ID;
  var MEMBER_IDS = process.env.MEMBER_IDS;
  var SCHEDULE = process.env.SCHEDULE;

  var Promise = require('bluebird');
  var Trello = require('node-trello');
  var moment = require('moment-timezone');
  var t = Promise.promisifyAll(new Trello(TRELLO_KEY, TRELLO_TOKEN));

  var today = moment().utc().tz('America/Los_Angeles').startOf('day');

  SCHEDULE.split(';').forEach(function(e) {
    var entry = e.split(':');
    var day = +entry[0];
    var cardId = entry[1];
    console.log("Considering " + entry + "...");
    var targetDay = (today.day() + 3) % 7;
    if (day === targetDay) {
      console.log("   matched!");
    } else {
      console.log("   didn't match, continuing.");
      return;
    }

    var trelloParams = {
      pos: 'top',
      due: moment(today).add(73, 'hours'),
      idList: DESTINATION_LIST,
      idMembers: MEMBER_IDS,
      idCardSource: cardId
    };
    t.postAsync("/1/cards", trelloParams)
      .then(function(data) {
        console.log("Successfully cloned " + cardId + " to " + data.url);
      });
  });
})();
