/* function get parameter */
const getParameter = (name) => {
  var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results == null ? null : decodeURI(results[1]) || 0;
}

/* safelink logic */

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

      /* show gotolink button */
      $("#gotolink").removeClass('d-none');
      $("#gotolink").prop('disabled', false);

      /* add event after countdown finish > gotolink on click */
      $("#gotolink").on("click", function () {
        /* decode hash */
        var urlHashDecode = aesCrypto.decrypt(trimString(urlHash), trimString(safeLinkConfig.secretKey));

        /* Check if the decoded URL is valid */
        if (urlHashDecode) {
          // Construct the new URL
// Declare a variable to track which link is currently being used
var currentLink = 0;

// Define the two links in an array
var links = [
  "https://up.v040v.com/p/blog-page_5.html?url=",
  "https://example.com/anotherLink.html?url=" // Replace this with your second link
];

// Assuming there's some delta variable and a function or code before this that sets the 'urlHashDecode'
var delta = 500; // Example value, replace with your actual value if different

setTimeout(function() {
  // Your existing code...

  // Construct the new URL
  var newURL = links[currentLink] + encodeURIComponent(urlHashDecode);

  // Toggle the currentLink for next time
  currentLink = 1 - currentLink; // This will flip the value between 0 and 1

  // Redirect the user to the new URL
  window.location.href = newURL;

  // Rest of your existing code...
  if (/* some condition */) { // You should replace the condition placeholder with your actual condition.
    alert('hash invalid');
  }

}, delta);

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
