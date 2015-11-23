function etpiDataLoader() {
    jQuery(".expanding-stream-item").each(function () {
        var that = jQuery(this);

        if(that.children(".ProfileCardStats").length === 0 && !that.hasClass("etpi-inserted")) {
            var dataUserIdElement = that.find(".original-tweet[data-user-id]");
            var dateUserID = dataUserIdElement.attr("data-user-id");

            jQuery.ajax({
                url: "https://twitter.com/i/profiles/popup",
                type: "get",
                data:{user_id: dateUserID, wants_hovercard: true},
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
    });
}

chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            
            var totalCount = jQuery(".expanding-stream-item").length;
            etpiDataLoader();
            $("#stream-items-id").bind("DOMSubtreeModified", function() {
                if(jQuery(".expanding-stream-item").length > totalCount) {
                    totalCount = jQuery(".expanding-stream-item").length;
                    etpiDataLoader();
                }
            });
	}
    }, 10);
});