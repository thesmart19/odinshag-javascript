$(document).ready( function()
{
	/* инициализация и обработка событий фото слайдера */
	$(".photo-slider").photoSlider();
	
	/* счетчик количества товара */
	$(".number-items").productCounter();
    
    /* показать все отзывы */
    (function ($) {
        $.fn.showComments = function (count) {
            var object = $(this);
            var reviewWrap = object.children(".reviews");
            var reviewWrapHeight = reviewWrap.height();
            var reviews = reviewWrap.children(".review");
            var reviewsCount = reviews.length;
            var reviewsHeight = 0;
            var paddings = 35;
            var showMore = object.children(".show-more");
            
            /* вычисляем высоту count отзывов */
            reviews.each( function (index) {
                if(index < count) {
                    reviewsHeight += $(this).height() + paddings;
                }
            } );
            
            if (reviewsCount > count) {
                /* высота обертки + padding-top + padding-bottom */
                reviewWrap.height(reviewsHeight);
                
                showMore.on("click", function (event) {
                    var obj = $(this);
                    
                    /* показываем все отзывы */
                    if (!obj.hasClass("close")) {
                        reviewWrap.animate({ "height" : reviewWrapHeight }, 500, function () {
                            obj.addClass("close");
                            obj.html("Свернуть <span class='icon close'>&nbsp;</span>");
                            obj.attr( { "title" : "Свернуть" } );
                        });
                    } else {
                        /* скрываем, оставляем только count отзывов */
                        reviewWrap.animate({ "height" : reviewsHeight }, 500, function () {
                            obj.removeClass("close");
                            obj.html("Читать все отзывы <span class='icon'>&nbsp;</span>");
                            obj.attr( { "title" : "Читать все отзывы" } );
                        });
                    }

                    event.preventDefault();
                });
            } else {
                /* скрываем кнопку читать все отзывы */
                showMore.remove();
            }
        }
    })(jQuery);
    $(".tabs .titles a.two").on("click", function (event) {
        var timer = setTimeout( function () {
            $(".tabs .pages .two .show-more .content").showComments(3);
        }, 250);
    } );
	
    /*
	переключение вкладок товара (О товаре / Отзывы / Вопрос / Ответ)
	!!! этот обработчик должен идти после инициализации всех других обработчиков внутри вкладок (например showMore()) !!!
    */
    $(".tabs").each( function()
    {
        var object = $(this);
        if(!object.hasClass("wide-titles") && !object.parent().hasClass("message"))
        {
            object.tabsSwitch();
        }
    });
	
	/* перемещение правого блока страницы товара при прокрутке страницы */
	$(".card-product-desc").customScroll();
	
	/* подсказка для бонусов */
	/* подсказка для доставки */
	/* подсказка для цены для постоянного покупателя */
	$(".bonus .count .icon.question, .delivery .date span.icon, .price-for-client span.icon, .extra .bonus span.icon, .extra .quick-order-block .title span.icon").click( function(event) /* .delivery .date span.icon */
	{
		var object = $(this);
		var message = object.find(".message");
		var fixedWrap = object.find(".fixed-wrap");
		
		if(message.css("display") == "none")
		{
			message.show();
			fixedWrap.show();
			object.addClass("active");
			// скрываем подсказку через полминуты
			var timer = setTimeout( function()
			{
				if(message.css("display") == "block")
				{
					message.hide();
					fixedWrap.hide();
					object.removeClass("active");
				}
			}, 30000);
		}
		
		/*event.preventDefault();*/
	});
	
	/* Фотографии товара */
	$(".box").on("mouseover", ".review .photo .thumbnails a", function(event)
	{
		var object = $(this);
		object.addClass("hover");
		object.find(".message").show();
		event.stopPropagation();
	});
	$(".box").on("mouseout", ".review .photo .thumbnails a", function(event)
	{
		$(this).removeClass("hover");
		event.stopPropagation();
	});
	$(".box").on("click", ".review .photo .thumbnails a", function(event)
	{
		event.preventDefault();
	});
	$(".box").on("mouseover", ".review .photo .thumbnails a .message", function(event)
	{
		$(this).hide();
		event.stopPropagation();
	});
	$(".box").on("mouseover", ".review .photo .thumbnails a .message img", function(event)
	{
		$(this).parent().hide();
		event.stopPropagation();
	});
	/* / Фотографии товара */
    
    /* Эспериментальная карточка товара */
    $(".quick-order-block").quickOrderBlockManagement(500);
    /* / Эспериментальная карточка товара */
});

