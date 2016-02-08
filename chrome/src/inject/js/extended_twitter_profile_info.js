function etpiDataLoader(ownerUserID) {
    jQuery(".expanding-stream-item").each(function () {
        var that = jQuery(this);

        if(that.children(".ProfileCardStats").length === 0 && !that.hasClass("etpi-inserted")) {
            var dataUserIdElement = that.find(".original-tweet[data-user-id]");
            var dataUserID = dataUserIdElement.attr("data-user-id");

            if(dataUserID !== ownerUserID) {
                jQuery.ajax({
                    url: "https://twitter.com/i/profiles/popup",
                    type: "get",
                    data:{user_id: dataUserID, wants_hovercard: true},
                    success: function(response) {
                        this.workOnResponseJson(that, response);
                    },
                    error: function(xhr) {
                        if(xhr.status === 200) {
                            this.workOnResponseJson(that, xhr.responseText);
                        }
                    },
                    workOnResponseJson: function(that, jsonText) {
                        var response = jQuery.parseJSON(jsonText);

                        that.find(".stream-item-header")
                            .find(".time")
                            .after(jQuery(response.html).find("div.ProfileCardStats"));

                        that.addClass("etpi-inserted");
                    }
                });
            }
        }
    });
}

chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            
            var ownerUserIdElement = jQuery("#user-dropdown").find(".avatar[data-user-id]");
            var ownerUserID = ownerUserIdElement.attr("data-user-id");

            var totalCount = jQuery(".expanding-stream-item").length;
            etpiDataLoader(ownerUserID);
            $("#stream-items-id").bind("DOMSubtreeModified", function() {
                if(jQuery(".expanding-stream-item").length > totalCount) {
                    totalCount = jQuery(".expanding-stream-item").length;
                    etpiDataLoader(ownerUserID);
                }
            });
	}
    }, 10);
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36962606-5']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
