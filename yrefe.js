/* function get parameter */
const getParameter = (name) => {
  var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(
    window.location.href
  );
  return results == null ? null : decodeURI(results[1]) || 0;
};

/* safelink logic */

/* Add the final URL here */
const finalUrl = "https://up.v040v.com/2023/03/blog-post_97.html?url=" + encodeURIComponent("رابط الهدف النهائي");

/* push new URL to the browser (remove hash parameter) */
history.pushState(null, "", location.href.split("#")[0]);

/* if urlHash exists > show countdown */
if (finalUrl != null) {
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
    if (!start) {
      return;
    }

    // pause when blurred
    if (window.blurred) {
      return;
    }

    // count
    time -= delta;

    // send count to element
    $(".timer").text(time / 1000);

    // callback when time is finished
    if (time <= 0) {
      clearInterval(countDown);

      /* remove countdown */
      timer.remove();

      /* show gotolink button */
      $("#gotolink").removeClass('d-none');
      $("#gotolink").prop('disabled', false);

      /* add event after countdown finish > gotolink on click */
      $("#gotolink").on("click", function () {
        /* decode hash */
        var urlHashDecode = aesCrypto.decrypt(
          trimString(finalUrl),
          trimString(safeLinkConfig.secretKey)
        );

        /* redirect */
        (urlHashDecode)
          ? window.location.href = urlHashDecode
          : alert('الرابط غير صحيح');

      });

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

    // show countdown
    timer.html(`<div class="countdown">
		<span class="timer">${delay}</span>
		<span class="seconds">ثانية</span>
		</div>`);

    start = 1;

    /* update getLinkClick > prevent double countdown */
    getlinkClick = true;
  }

});
