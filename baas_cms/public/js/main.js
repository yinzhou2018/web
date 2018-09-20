const global = {};

async function init() {
  await require('js/main_nav_view.js');
  mainNavView.init();
}

$(document).ready(function() {
  global.userName = $('#user').text();
  init();
});