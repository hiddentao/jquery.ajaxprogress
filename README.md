# AJAX Progress plugin for jQuery #

Source: [https://github.com/hiddentao/jquery.ajaxprogress](https://github.com/hiddentao/jquery.ajaxprogress)

This plugin enhances the jQuery AJAX request handler with the ability to display a user-specified progress indicator if the request takes longer than a user-specified time to complete. The motivation for adding such functionality is that sometimes the AJAX requests take longer than expected (especially on mobiles with patchy connections) and it would be good to be able to inform the user of such a delay in an easily re-usable manner.

Once enabled two new settings are available for the $.ajax call:

 * **progress_indicator**
   * Either a jQuery object, function callback or a HTML string specifying the progress indicator. If not specified then no progress indicator will be shown.
 * **progress_indicator_delay**
   * No. of milliseconds to wait from when the AJAX request has been sent before displaying the progress indicator. Default is 1000, i.e. 1 second.

The progress indicator can be one of the three types:

 * jQuery object:
   * show() will be called on it when the request is in progress and hide() will be called on it once the request completes.
 * Callback function:
   * it will be invoked with its argument as false (boolean) when the request is in progress and it will then be invoked with true (boolean) when the request has completed.
 * HTML string:
   * it will be added to the body within a DIV when the request is in progress. The DIV will then be removed once the request has completed. The DIV has the 'ajax_progress_indicator' class set on it so you can style it as you wish using CSS.

## Example: function callback ##

Use a function callback to toggle the visiblity of an element, 0.5 seconds after the AJAX request has started.

    $.ajax({
        progress_indicator : function(state) { $("#progress).toggle(state); },
        progress_indicator_delay : 500,
        ... /* other AJAX params here */
    });

## Example: jQuery object  ##

Use a jQuery object.

    $.ajax({
        progress_indicator : $("#progress),
        ... /* other AJAX params here */
    });

## Example: HTML string ##

Use a HTML string, to show after 5 seconds.

    $.ajax({
        progress_indicator : "<span class='message'>Sorry, this request is taking a long time.</span>",
        progress_indicator_delay : 5000,
        ... /* other AJAX params here */
    });


## Example: no indicator ##

If you don't supply the progress indicator parameters then it doesn't get shown.

    $.ajax({
        ... /* other AJAX params here */
    });
