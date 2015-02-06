(function() {
  'use strict';
  var TRELLO_KEY = process.env.TRELLO_KEY;
  var TRELLO_TOKEN = process.env.TRELLO_TOKEN;
  var BOARD = process.env.BOARD_ID;
  var TEMPLATE_LIST = process.env.TEMPLATE_LIST_ID;
  var DESTINATION_LIST = process.env.DESTINATION_LIST_ID;
  var MEMBER_IDS = process.env.MEMBER_IDS;
  var SCHEDULE = process.env.SCHEDULE;

  var Promise = require('bluebird');
  var Trello = require('node-trello');
  var moment = require('moment-timezone');
  var t = Promise.promisifyAll(new Trello(TRELLO_KEY, TRELLO_TOKEN));

  var today = moment().utc().tz('Asia/Jerusalem').day()

  SCHEDULE.split(';').forEach(function(e, idx) {
    var entry = e.split(':');
    var day = +entry[0];
    var cardId = entry[1];
    console.log("Considering " + entry + "...");
    if (day === today) {
      console.log("   matched!");
    } else {
      console.log("   didn't match, continuing.");
      return;
    }

    var trelloParams = {
      pos: 'top',
      due: moment(today).add(20, 'hours'),
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
