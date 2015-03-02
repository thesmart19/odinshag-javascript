$(document).ready( function()
{
	// инициализация и обработка событий фото слайдера
	$(".photo-slider").photoSlider();
	
	// счетчик количества товара
	$(".number-items").productCounter();
	
	// показать все отзывы или все ответы
	$(".tabs .pages .two .show-more").showMore(500);
	$(".tabs .pages .three .show-more").showMore(500);
	
	// переключение вкладок товара (О товаре / Отзывы / Вопрос / Ответ)
	// !!! этот обработчик должен идти после инициализации всех других обработчиков внутри вкладок (например showMore()) !!!
    $(".tabs").each( function()
    {
        var object = $(this);
        if(!object.hasClass("wide-titles") && !object.parent().hasClass("message"))
        {
            object.tabsSwitch();
        }
    });
	
	// перемещение правого блока страницы товара при прокрутке страницы
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