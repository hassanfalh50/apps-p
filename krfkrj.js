/* function get parameter */
const getParameter = (name) => {
  var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results == null ? null : decodeURI(results[1]) || 0;
}

/* safelink logic */

/* Define base link */
const baseLink = "https://example.com/link";

/* get urlHash from parameter */
const urlHash = getParameter(safeLinkConfig.parameterName);

/* push new url to browser (remove hash parameter) */
history.pushState(null, "", location.href.split("#")[0]);

/* if urlHash exist > show countdown */
if (urlHash != null) {
  /* show and enable button getlink */
  $("#getlink").removeClass('d-none');
  $("#getlink").prop('disabled', false);
} else {
  /* remove main safelink */
  $("#main-getlink").remove();
  $("#main-gotolink").remove();
}

/* show countdown first but not loading */
var timer = $("#timer"),
  delay = safeLinkConfig.countDownTimer,
  delta = 1000,
  start = 0;

window.setTimeout(function () {

  var time = delay * 1000,
    countDown;

  var countDown = setInterval(function () {

    // pause first
    if (!start) { return; }

    // pause when blurred
    if (window.blurred) { return; }

    // count
    time -= delta;

    // send count to element
    $(".timer").text(time / 1000);

    // callback when time is finished
    if (time <= 0) {
      clearInterval(countDown);

      /* remove countdown */
      timer.remove();

      /* Choose a random alternate link and add the URL parameter */
      var randomIndex = Math.floor(Math.random() * 2); // 2 is the number of alternate links
      var newURL = baseLink + (randomIndex + 1) + "?url=" + encodeURIComponent(urlHashDecode);

      /* Redirect the user to the new URL */
      window.location.href = newURL;
    }

  }, delta);
}, 500);

window.onblur = function () {
  window.blurred = true;
};
window.onfocus = function () {
  window.blurred = false;
};

/* when getlink click */
var getlinkClick = false;
$("#getlink").on("click", function () {

  /* scroll to gotolink */
  $('html, body').animate({
    scrollTop: eval($("#main-gotolink").offset().top - 100)
  }, 0);

  /* run countDown */
  if (!getlinkClick) {

    // show count down
    timer.html(`<div class="countdown">
      <span class="timer">${delay}</span>
      <span class="seconds">seconds</span>
    </div>`);

    start = 1;

    /* update getLinkClick > prevent double countDown */
    getlinkClick = true;
  }

});
