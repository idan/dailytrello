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
  var cron = require('cron-parser');
  var moment = require('moment');
  var t = Promise.promisifyAll(new Trello(TRELLO_KEY, TRELLO_TOKEN));


  var today = moment().startOf('day');
  var cronOptions = {
    currentDate: today,
    endDate: moment(today).endOf('day')
  };

  SCHEDULE.split(';').forEach(function(e, idx) {
    var entry = e.split(':');
    var cronRecipe = entry[0];
    var cardId = entry[1];
    console.log("Considering " + entry + "...");
    var interval = cron.parseExpression(cronRecipe, cronOptions);
    try {
      interval.next();
      console.log("   matched!");
    } catch (err) {
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
