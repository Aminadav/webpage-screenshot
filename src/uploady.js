$(function () {
  if ($('body.uploady-init').length) {
    console.log('WA');
    uploady.init().then(updateUI);
  }
  $('.uploady-connect').click(connect);
  $('.uploady-view-screenshots').click(view);
  $('.uploady-view-screenshots-or-redirect').click(viewOrRedirect);
  $('.uploady-disconnect').click(dissconnect);

  function updateUI() {
    if (uploady.isConnected()) {
      $('.uploady-show-connected').show();
      $('.uploady-email').text(uploady.getUser().email);
    } else {
      $('.uploady-show-connected').hide();
    }
    if (uploady.isTemporary()) {
      $('.uploady-show-temporary').show();
      $('.uploady-expiration-time').text(timeLeft(uploady.getExpirationDate() - Date.now()));
    } else {
      $('.uploady-show-temporary').hide();
    }
  }

  function viewOrRedirect() {
    uploady.init().then(function () {
      if (uploady.isConnected()) {
        window.open(uploady.getFolderUrl());
      } else {
        window.open("uploady.html", "_blank");
      }
    });
  }
  function view() {
    uploady.init().then(function () {
      if (uploady.isConnected()) {
        window.open(uploady.getFolderUrl());
      } else {
        if (confirm("To view your files you have to be logged in. Would you like to login now?")) {
          connect().then(view, function () {
            alert('Could not finish login.')
          });
        }
      }
    });
  }
  function dissconnect() {
    uploady.init().then(function () {
      var message = "Once you logged out, all your screenshots will be saved to a temporary account. Would you like to proceed?";
      if (uploady.isTemporary()) {
        message = "You are currently using a temporary account, by logging out you will permanently loose access to manage your screenshots. Would you like to proceed?"
      }
      if (confirm(message)) {
        uploady.disconnectUser();
        updateUI();
      }
    });
  }
  function connect() {
    return uploady.connectUser().then(function () {
      updateUI();
      alert('Your screenshots will be saved now to ' + uploady.getUser().email);
    });
  }
});

function timeLeft(microseconds) {
  function numberEnding (number) {
    return (number > 1) ? 's' : '';
  }
  var seconds = microseconds / 1000;

  if (seconds == Number.POSITIVE_INFINITY) {
    return '-';
  }
  if (seconds < 0) {
    return '-';
  }
  var period = Math.floor(seconds / 31536000);
  if (period) {
    return period + ' year' + numberEnding(period);
  }
  period = Math.floor((seconds %= 31536000) / 2592000);
  if (period) {
    return period + ' month' + numberEnding(period);
  }
  period = Math.floor((seconds %= 2592000) / 604800);
  if (period) {
    return period + ' week' + numberEnding(period);
  }
  period = Math.floor((seconds %= 604800) / 86400);
  if (period) {
    return period + ' day' + numberEnding(period);
  }
  period = Math.floor((seconds %= 86400) / 3600);
  if (period) {
    return period + ' hour' + numberEnding(period);
  }
  period = Math.floor((seconds %= 3600) / 60);
  if (period) {
    return period + ' min' + numberEnding(period);
  }
  period = seconds % 60;
  if (period > 1) {
    return period + ' secs';
  }
  return 'just a sec';
}