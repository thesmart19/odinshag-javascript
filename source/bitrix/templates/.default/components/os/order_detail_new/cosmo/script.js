$(document).ready(function () {
	if ($(".subscription form").length > 0) {
		$(".subscription form").submit(function (event) {
			var data = {}, object = $(this), subscription = object.parent();

			object.find("input").each(function (index) {
				var input = $(this);
				if (typeof input.attr("name") !== "undefined") {
					data[input.attr("name")] = input.val();
                }
			});
            
			if (!object.find(".loading").hasClass("button")) {
				object.find(".loading").addClass("button");
				$.post("/ajax/full_subscribe.php", data, function (response) {
					response = $.parseJSON(response);
					if (typeof response === "object" && typeof response.error !== "undefined" && typeof response.message !== "undefined") {
						if (!response.error) {
							subscription.html("<span><b>" + response.message + "</b></span>");
                            /* Яндекс.Метрика */
							if (typeof yaCounter10648792 !== "undefined") { yaCounter10648792.reachGoal('SUBSCRIBE_AFTER_ORDER'); }
						} else {
							object.find(".loading").removeClass("button");
							subscription.find("span").html("<b class='red'>" + response.message + "</b>");
						}
					}
				});
			}
            
			event.preventDefault();
		});
	}
    /* заказать услугу */
    if ($(".partners").length > 0) {
        $(".partners .order-service").on( "click", function (event) {
            var object = $(this);
            var address = object.attr("href");
            address = address.split("?");
            $.get( address[0], address[1], function (data) {
                data = $.parseJSON(data);
                if(typeof data === "object" && data.success == true) {
                    if(typeof systemMessages.info.serviceOrderDone !== "undefined") {
                        object.parent().html(systemMessages.info.serviceOrderDone);
                    } else {
                        object.parent().html("Ваша заявка принята и скоро будет обработана нашим оператором.");
                    }
                    /* Яндекс.Метрика */
                    if (typeof yaCounter10648792 !== "undefined") { yaCounter10648792.reachGoal('ITEM_APPLICATION_SERVICE'); }
                } else {
                    object.parent().html("<span class='red'>Ошибка</span>");
                }
            } );
            event.preventDefault();
        } );
    }
});