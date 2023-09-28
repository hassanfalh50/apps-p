/* Function to get parameter from URL */
const getParameter = (name) => {
  const results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results === null ? null : decodeURI(results[1]) || 0;
};

/* Safe link logic */

/* Get urlHash from parameter */
const urlHash = getParameter(safeLinkConfig.parameterName);

/* Remove hash parameter from the URL */
history.pushState(null, '', location.href.split('#')[0]);

/* Check if urlHash exists, then show countdown */
if (urlHash !== null) {
  /* Show and enable the getlink button */
  $("#getlink").removeClass('d-none');
  $("#getlink").prop('disabled', false);
} else {
  /* Remove main safelink */
  $("#main-getlink").remove();
  $("#main-gotolink").remove();
}

/* Show countdown initially but don't start loading */
const timer = $("#timer");
const delay = safeLinkConfig.countDownTimer;
const delta = 1000;
let start = 0;

window.setTimeout(function () {
  let time = delay * 1000;
  let countDown;

  const countDownInterval = setInterval(function () {
    // Pause if not started
    if (!start) {
      return;
    }

    // Pause when window is blurred
    if (window.blurred) {
      return;
    }

    // Count down
    time -= delta;

    // Update the countdown element
    $(".timer").text(time / 1000);

    // Callback when time is finished
    if (time <= 0) {
      clearInterval(countDown);

      /* Remove countdown */
      timer.remove();

      /* Show gotolink button */
      $("#gotolink").removeClass('d-none');
      $("#gotolink").prop('disabled', false);

      /* Add event after countdown finish > gotolink on click */
      $("#gotolink").on("click", function () {
        /* Decode hash */
        const urlHashDecode = aesCrypto.decrypt(trimString(urlHash), trimString(safeLinkConfig.secretKey));

        // Declare a variable to track which link is currently being used
        let currentLink = 0;

        // Define the two links in an array
        const links = [
          "https://up.v040v.com/p/blog-page_5.html?url=",
          "https://example.com/anotherLink.html?url=" // Replace this with your second link
        ];

        // Assuming there's some delta variable and a function or code before this that sets the 'urlHashDecode'
        const delta = 500; // Example value, replace with your actual value if different

        setTimeout(function () {
          // Your existing code...

          // Construct the new URL
          const newURL = links[currentLink] + encodeURIComponent(urlHashDecode);

          // Toggle the currentLink for next time
          currentLink = 1 - currentLink; // This will flip the value between 0 and 1

          // Redirect the user to the new URL
          window.location.href = newURL;

          // Rest of your existing code...
          if (/* some condition */) { // You should replace the condition placeholder with your actual condition.
            alert('hash invalid');
          }
        }, delta);
      });
    }
  }, delta);

  window.onblur = function () {
    window.blurred = true;
  };

  window.onfocus = function () {
    window.blurred = false;
  };
});

/* When getlink button is clicked */
let getlinkClick = false;
$("#getlink").on("click", function () {
  /* Scroll to gotolink */
  $('html, body').animate({
    scrollTop: eval($("#main-gotolink").offset().top - 100)
  }, 0);

  /* Run countdown if not already started */
  if (!getlinkClick) {
    // Show countdown
    timer.html(`<div class="countdown">
      <span class="timer">${delay}</span>
      <span class="seconds">seconds</span>
    </div>`);

    start = 1;

    /* Update getlinkClick to prevent double countdown */
    getlinkClick = true;
  }
});
