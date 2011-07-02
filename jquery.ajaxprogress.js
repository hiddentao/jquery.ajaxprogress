/**
 * Copyright (c) 2011 Ramesh Nair (www.hiddentao.com)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * AJAX Progress plugin for jQuery
 *
 * Source: https://github.com/hiddentao/jquery.ajaxprogress
 * 
 * This plugin enhances the jQuery AJAX request handler with the ability to display a user-specified progress indicator if the request takes longer
 * than a user-specified time to complete. The motivation for adding such functionality is that sometimes the AJAX requests take longer than
 * expected (especially on mobiles with patchy connections) and it would be good to be able to inform the user of such a delay in an
 * easily re-usable manner.
 *
 * Once enabled two new settings are available for the $.ajax call:
 *
 *    progress_indicator  - either a jQuery object, function callback or a HTML string specifying the progress indicator. If not specified then no
 *                                      progress indicator will be shown.
 *    progress_indicator_delay - no. of milliseconds to wait from when the AJAX request has been sent before displaying the progress
 *                                  indicator. Default is 1000, i.e. 1 second.
 *
 * The progress indicator can be one of the three types:
 *
 *      jQuery object:        show() will be called on it when the request is in progress and hide() will be called on it once the request completes.
 *
 *      Callback function:   it will be invoked with its argument as false (boolean) when the request is in progress and it will then be invoked with
 *                                  true (boolean) when the request has completed.
 *
 *      HTML string:          it will be added to the body within a DIV when the request is in progress. The DIV will then be removed once the
 *                                  request has completed. The DIV has the 'ajax_progress_indicator' class set on it so you can style it as you wish using
 *                                  CSS.
 */


(function ($) {

    /** Overridden version of original AJAX function. */
    $.ajax = (function(){
        var orig_ajax = $.ajax;
        return function() {
            var _self = this;
            var ajax_request_id = (new Date()).getTime();

            // work out which argument is the settings argument
            var settings = arguments[0];
            if (2 <= arguments.length)
                settings = arguments[1];

            // get indicator options
            var indicator = $.extend({},{
                progress_indicator : undefined,
                progress_indicator_delay : 1000
            } , settings);

            // hook the completion callback
            var orig_complete = settings.hasOwnProperty("complete") ? settings.complete : undefined;
            settings.complete = function(){
                if (undefined != indicator.progress_indicator) {
                    if (indicator.progress_indicator instanceof jQuery)
                        indicator.progress_indicator.removeClass("ajax_progress_indicator").hide();
                    else if ($.isFunction(indicator.progress_indicator))
                        indicator.progress_indicator.call(null, true);
                    else
                        $("div#ajaxrequest" + ajax_request_id).remove();
                }
                if (undefined != orig_complete)
                    orig_complete.apply(_self, arguments);
            }

            // make the call
            if (2 <= arguments.length)
                arguments[1] = settings;
            else
                arguments[0] = settings;
            orig_ajax.apply(_self, arguments);

            // show slow progress indicator?
            if (undefined != indicator.progress_indicator) {
                setTimeout(function(){
                    if (indicator.progress_indicator instanceof jQuery) {
                        indicator.progress_indicator
                                .addClass("ajax_progress_indicator")
                                .show()
                        ;
                    } else if ($.isFunction(indicator.progress_indicator)) {
                        indicator.progress_indicator.call(null, false);
                    } else {
                        $("<div />")
                                .attr("id", "ajaxrequest" + ajax_request_id)
                                .addClass("ajax_progress_indicator")
                                .append(indicator.progress_indicator)
                                .appendTo(document.body)
                        ;
                    }
                }, indicator.progress_indicator_delay);
            }
        }
    })();

})(jQuery);	
			
