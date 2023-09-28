/* Define a function to get parameter from URL */
const getParameter = (name) => {
  var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results == null ? null : decodeURI(results[1]) || 0;
}

/* SafeLink logic */

/* Get urlHash from parameter */
const urlHash = getParameter(safeLinkConfig.parameterName);

/* Push new url to browser (remove hash parameter) */
history.pushState(null, "", location.href.split("#")[0]);

/* Define an array of alternate URLs */
var alternateURLs = [
  "https://up.v040v.com/p/blog-page_5.html?url=" + encodeURIComponent(urlHashDecode),
  "https://example.com/alternate-url1?url=" + encodeURIComponent(urlHashDecode),
  "https://example.com/alternate-url2?url=" + encodeURIComponent(urlHashDecode)
];

/* Define a variable to track the current URL index */
var currentURLIndex = 0;

/* Show countdown initially but do not start it */
var timer = $("#timer"),
  delay = safeLinkConfig.countDownTimer,
  delta = 1000,
  start = 0;

window.setTimeout(function () {
  var time = delay * 1000,
    countDown;

  var countDown = setInterval(function () {
    // Pause initially
    if (!start) { return; }
    // Pause when blurred
    if (window.blurred) { return; }

    // Count down
    time -= delta;

    // Send count to element
    $(".timer").text(time / 1000);

    // Callback when time is finished
    if (time <= 0) {
      clearInterval(countDown);

      /* Remove countdown */
      timer.remove();

      /* Show go to link button */
      $("#gotolink").removeClass('d-none');
      $("#gotolink").prop('disabled', false);

      /* Add event after countdown finish > go to link on click */
      $("#gotolink").on("click", function () {
        /* Decode hash */
        var urlHashDecode = aesCrypto.decrypt(trimString(urlHash), trimString(safeLinkConfig.secretKey));

        /* Check if the decoded URL is valid */
        if (urlHashDecode) {
          // Construct the new URL
          var newURL = alternateURLs[currentURLIndex];

          // Increment the URL index for the next time
          currentURLIndex = (currentURLIndex + 1) % alternateURLs.length;

          // Redirect the user to the new URL
          window.location.href = newURL;
        } else {
          alert('Hash invalid');
        }
      });
    }
  }, delta);
}, 500);

/* Handle window blur and focus */
window.onblur = function () {
  window.blurred = true;
};
window.onfocus = function () {
  window.blurred = false;
};

/* When get link is clicked */
var getlinkClick = false;
$("#getlink").on("click", function () {
  /* Scroll to go to link section */
  $('html, body').animate({
    scrollTop: eval($("#main-gotolink").offset().top - 100)
  }, 0);

  /* Start the countdown if it hasn't already been started */
  if (!getlinkClick) {
    // Show countdown
    timer.html(`<div class="countdown">
      <span class="timer">${delay}</span>
      <span class="seconds">seconds</span>
      </div>`);

    start = 1;

    /* Update getLinkClick to prevent double countdown */
    getlinkClick = true;
  }
});
