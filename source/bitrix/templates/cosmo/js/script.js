/* определение системных параметров */
if(typeof jQuery !== "undefined" && jQuery.isFunction($(window).width) && typeof systemParameters === "object")
{
    var globalViewportWidth = $(window).width();
    if(globalViewportWidth > 0 && globalViewportWidth <= 570)
    { 
        /* телефон */ systemParameters.mobileDevice.isCellPhone = true;
        if($.cookie("site_full_version") == 1)
        {
            /* при переходе к полной версии размер экрана не учитывается */
            systemParameters.mobileDevice.isCellPhone = false;
        }
    }
    else
    {
        if(globalViewportWidth <= 959) { /* планшет */ systemParameters.mobileDevice.isTabletPC = true; }
        else { /* компьютер */ systemParameters.mobileDevice.isPC = true; }
    }
}

/* если браузер не поддерживает функцию indexOf - определяем её */
if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(searchElement, fromIndex)
	{
		if (this === undefined || this === null)
		{
			throw new TypeError( '"this" is null or not defined' );
		}
		var length = this.length >>> 0; /* Hack to convert object.length to a UInt32 */
		fromIndex = +fromIndex || 0;
		if (Math.abs(fromIndex) === Infinity)
		{
			fromIndex = 0;
		}
		if (fromIndex < 0)
		{
			fromIndex += length;
			if (fromIndex < 0)
			{
				fromIndex = 0;
			}
		}
		for (;fromIndex < length; fromIndex++)
		{
			if (this[fromIndex] === searchElement)
			{
				return fromIndex;
			}
		}
		return -1;
	}
}

/* проверка поддержки браузером формата SVG */
function hasSVGSupport()
{
	var featureImage = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
	var elementSVG = (window.SVGSVGElement) ? true : false;
	if(featureImage && elementSVG)
		return true;
	return false;
}

$(function() {
    /* # Lazy Load Plugin for jQuery */
    systemParameters.lazyImages = $(".img-lazy");
    if(jQuery.isFunction(systemParameters.lazyImages.lazyload)) {
        systemParameters.lazyImages.lazyload();
    }
    /* / Lazy Load Plugin for jQuery */
});

$(document).ready( function()
{   
	/* проверка поддержки браузером формата SVG */
	if(!hasSVGSupport()) document.documentElement.className += " no-svg";
    
    /* проверка поддержки браузером CSS селекторов */
    try { document.querySelectorAll(":nth-child(1)"); }
    catch(e)
    {
        /* костыль для z-index в шапке */
        $($(".header.clearing")[1]).css( { "z-index" : 2 } );
    }
	
	/* обработчики ссылок фиксированной шапки */
	$(".header.fixed a.title").click( function()
	{
		var parent = $(this).parent();
		if(parent.hasClass("favorites") || parent.hasClass("viewed") || parent.hasClass("compare") )
		{
			/* переход по ссылке */
			return true;
		}
		else
		{
			/* обработка корзины */
			/* отображаем корзину при наведении */
			if(parent.hasClass("basket"))
			{
				/* переход по ссылке работает, если корзина активна и сумма заказа больше 500 рублей */
				if(parent.hasClass("active") && !parent.hasClass("not-available"))
					return true;
				/* иначе переход заблокирован */
				return false;
			}
			else
			{
				if(parent.hasClass("user"))
				{
					if(!parent.hasClass("active"))
					{
						parent.addClass("active");
						parent.find(".fixed-wrap").show();
						parent.find(".message").show();
					}
					else
					{
						parent.removeClass("active");
						/* скрываем форму авторизации пользователя */
						/*if(parent.hasClass("user"))*/
						parent.find(".fixed-wrap").hide();
						parent.find(".message").hide();
					}
				}
			}
			/* авторизованный пользователь переходит по ссылке */
			if(parent.hasClass("user") && parent.hasClass("authorized"))
				return true;
		}
		/* переход по ссылке заблокирован */
		return false;
	});
	
	/* наведение мыши на пункты меню фиксированной шапки */
	var basketHoverTimer, basketHoverTimerValue = 500;
	$(".header.fixed").on( "mouseover", "a.title", function(event)
	{
		var parent = $(this).parent();
		/* обработка корзины */
		if(parent.hasClass("basket"))
		{
			clearTimeout(basketHoverTimer);
			/* удаляем временное уведомление о добавлении товара */
			parent.find(".message.product-preview").remove();
			/* показываем товары */
			parent.find(".message").show();
            if(typeof systemParameters === "object" && systemParameters.mobileDevice.isCellPhone)
            {
                /* фикс ширины блока с товарами */
                /* растягиваем блок на всю ширину экрана телефона */
                var w = $(window).width() - 2;
                parent.find(".message").width(w);
                parent.find(".message ul.items").width(w);
                parent.find(".message ul.items li").width(w);
            }
            if (jQuery.isFunction( parent.find(".message ul.items").customScrollbar )) {
                parent.find(".message ul.items").customScrollbar( { preventDefaultScroll : true } );
                parent.find(".message ul.items").on("customScroll", function(event, scrollData)
                {
                    if(scrollData.scrollPercent == 0 || scrollData.scrollPercent >= 100)
                    {
                        $(this).mousewheel(function(event)
                        {
                            event.preventDefault();
                        });
                    }
                });
            }
		}
		/* отображаем форму авторизации пользователя */
		event.preventDefault();
	});
	/* наведение мыши на корзину */
	$(".header.fixed .basket").on("mouseover", ".message", function(event)
	{
		clearTimeout(basketHoverTimer);
	});
	/* скрываем корзину при потери фокуса мыши */
	$(".header.fixed .basket").on("mouseleave", ".message", function(event)
	{
		var object = $(this);
		basketHoverTimer = setTimeout( function() { object.hide(); }, basketHoverTimerValue );
		event.preventDefault();
	});
	
	/* обработка формы авторизации */
	$("form.authorization").FormValidation();
	/* / обработка формы авторизации */
	
	$(".header").on("click", ".fixed-wrap", function(event)
	{
		var parent = $(this).parent();
		
		/* обработка фиксированной шапки */
		if(parent.hasClass("basket"))
		{
			parent.find(".message").hide();
		}
		if(parent.hasClass("user"))
		{
			parent.find(".message").hide();
			parent.removeClass("active");
		}
		/* обработка меню каталога */
		if(parent.hasClass("catalog"))
		{
			parent.find(".content").hide();
			parent.find(".level").hide();
			parent.find(".button").removeClass("open");
		}
		/* обработка главного меню сайта  */
		if(parent.hasClass("item"))
		{
			parent.removeClass("hover");
			parent.removeClass("open");
			parent.find(".content").hide();
			parent.find("a.title span span.icon").removeClass("open");
			if(parent.hasClass("phone"))
			{
				parent.removeClass("hover");
				parent.find(".bottom .message").hide();
				parent.find(".bottom .icon").removeClass("active");
			}
			if(parent.hasClass("city"))
			{
				/* костыль */
				if(!systemParameters.mobileDevice.isCellPhone)
					$(".header.catalog-search").css( { "z-index" : 2 } );
				else
					$(".header.catalog-search").css( { "z-index" : 3 } );
			}
            else
            {
                if(systemParameters.mobileDevice.isCellPhone) { event.stopPropagation(); }
            }
		}
		if(parent.hasClass("icon") && parent.parent().hasClass("phone") && parent.parent().parent().hasClass("info"))
		{
			parent.find(".message").hide();
			parent.removeClass("active");
		}

		$(this).hide();
		
		event.preventDefault();
	});
	$(".box").on("click", ".fixed-wrap", function(event)
	{
		var parent = $(this).parent();
		
		/* обработка подсказок на странице товара */
		/* форма быстрого заказа */
		if(parent.parent().hasClass("quick_order") && parent.hasClass("title"))
		{
			parent.find(".message").hide();
			parent.find(".has_notification").removeClass("active");
		}
		/* бонусы */
		if(parent.parent().parent().hasClass("bonus"))
		{
			parent.find(".message").hide();
			parent.find(".icon.question").removeClass("active");
		}
		/* подсказка для доставки */
		if(parent.parent().parent().hasClass("delivery") && parent.parent().hasClass("date"))
		{
			parent.find(".message").hide();
		}
		
		/* обработка подсказок на странице скидки дня */
		/* форма подпиcки на информационную рассылку */
		if(parent.parent().parent().parent().parent().hasClass("sale-day"))
		{
			parent.find(".message").hide();
		}
		
		/* обработка подсказок на странице оформления заказа */
		if(parent.parent().hasClass("form") || parent.hasClass("drop-down-list"))
		{
			parent.find(".message").hide();
			parent.find(".icon").removeClass("active");
		}
		if(parent.hasClass("icon") && parent.hasClass("floating"))
		{
			parent.find(".message").hide();
		}
		
		/* обработка подсказок в форме отзывов */
		if(parent.parent().hasClass("files"))
		{
			parent.find(".message").hide();
		}
		
		/* обработка подсказок на странице бонусов в личном кабинете (или на странице редактирования информации) */
		if(parent.hasClass("icon") && ( parent.parent().parent().hasClass("bonus-count") || parent.parent().parent().parent().hasClass("user-data") ) )
		{
			parent.find(".message").hide();
		}
		
		/* обработка подсказок в блоке лайков и рейтинга */
		if(parent.hasClass("voting-rating-likes"))
		{
			parent.removeClass("error");
		}
		else
		{
			if(parent.parent().hasClass("voting-rating-likes"))
				parent.parent().removeClass("error");
		}
		
		/* обработка подсказок на странице товара групповой покупки */
		if(parent.parent().hasClass("text") && parent.parent().parent().parent().hasClass("special-price"))
			parent.find(".message").hide();
			
		/* меню каталога товаров на главной странице сайта в адаптивном дизайне */
		if(parent.hasClass("catalog"))
		{
			parent.find(".content").hide();
			$(".column.left .catalog a.button").removeClass("open");
		}
        
        /* экспериментальная карточка товара */
        if(parent.hasClass("icon") && (parent.parent().hasClass("bonus") || parent.parent().parent().hasClass("quick-order-block")) )
            parent.find(".message").hide();
		
		parent.removeClass("active");
		if(!$(this).hasClass("white")) $(this).hide();

		event.preventDefault();
	});
	
	/* Меню Каталог */
	var showCatalogTimer;
	$(".column.left .catalog a.button").click( function(event)
	{
		var content = $(this).parent().find(".content");
		var wrap = $(this).parent().find(".fixed-wrap");
		$(this).parent().find(".level").hide();
		/* внутренние страницы сайта */
		if(content.length == 1)
		{
			/* скрываем все вложенные уровни меню */
			if(content.css("display") == "none")
			{
				/* не показываем меню каталога на Главной странице */
				if( !$(this).parent().hasClass("index-page") )
				{
					$(this).addClass("open");
					wrap.show();
					content.show();
				}
			}
			else
			{
				$(this).removeClass("open");
				wrap.hide();
				content.hide();
			}
		}
		else
		{
			/* главная страница */
			if(content.length == 0)
			{
				/* адаптивный дизайн */
				if( $(this).parent().hasClass("index-page") && $(this).find("span.name").css("border-right-width") == "1px" )
				{
					content = $(".category.box .content .column.left .catalog .content");
					wrap = $(".category.box .content .column.left .catalog .fixed-wrap");
					if(content.css("display") == "none")
					{
						$(this).addClass("open");
						wrap.show();
						content.addClass("shadow");
						content.show();
					}
					else
					{
						$(this).removeClass("open");
						wrap.hide();
						content.removeClass("shadow");
						content.hide();
					}
				}
			}
		}
		event.preventDefault();
	});
	
	$(".catalog .content").hover( function()
	{
		clearTimeout(showCatalogTimer);
	},
	function()
	{
		var object = $(this);
		/* скрываем все вложенные уровни меню */
		showCatalogTimer = setTimeout( function() { object.find(".level").hide(); }, 500 );
	});
	
	$(".catalog .content .item a.title").hover( function()
	{
		$(this).parent().parent().find(".level").hide();
		$(this).parent().find(".level").each( function(index)
		{
			if(index == 0) $(this).show();
			else $(this).hide();
		});
	},
	function()
	{
		$(this).parent().find(".level").hide();
	});
	
	$(".catalog .content .item .level").hover( function()
	{
		var object = $(this);
		object.show();
	},
	function()
	{
		return true;
	});
	/* / Меню Каталог */
    
    /* сквозные баннеры в каталоге товаров */
    /* проверяем есть ли у баннера широкая версия */
    if($(".banner-ext").length != 0) {
        var banner = $(".banner-ext img").attr("src");
        var bannerWide = $(".banner-ext img").data("src");
        if(typeof bannerWide !== "undefined") {
            systemParameters.bannerSection.current = "wide";
            systemParameters.bannerSection.normal = banner;
            systemParameters.bannerSection.wide = bannerWide;
        } else {
            systemParameters.bannerSection.current = "normal";
            systemParameters.bannerSection.normal = banner;
            systemParameters.bannerSection.wide = 0;
        }
        if(systemParameters.mobileDevice.isPC === true)
        {
            if(systemParameters.bannerSection.current == "wide") {
                if(systemParameters.bannerSection.wide != 0)
                {
                    $(".banner-ext img").attr( { "src" : systemParameters.bannerSection.wide } );
                    if(!$(".banner-ext").hasClass("banner-wide")) {
                        $(".banner-ext").addClass("banner-wide");
                    }
                }
            }
        } else {
            if(systemParameters.mobileDevice.isTabletPC === true) {
                if(systemParameters.bannerSection.current == "wide")
                {
                    $(".banner-ext img").attr( { "src" : systemParameters.bannerSection.normal } );
                    systemParameters.bannerSection.current == "normal";
                    if($(".banner-ext").hasClass("banner-wide")) {
                        $(".banner-ext").removeClass("banner-wide");
                    }
                }
            }
        }
    }
    /* / сквозные баннеры в каталоге товаров */
	
	/* Описание категории на странице списка товаров */
	$(".box .description").showCategoryDescription(1000);
	/* / Описание категории на странице списка товаров */
	
	/* Скролл-бар в левой колонке на странице списка товаров */
	/* Сокращаем высоту блока со списком подкатегорий */
	var categoriesListHeight = $(".box .content .column.left .block .categories.subcats ul").height();
	var categoriesItemsHeight = 0;
	$(".box .content .column.left .block .categories.subcats ul li").each( function()
	{
		var object = $(this);
		categoriesItemsHeight += parseInt(object.height()) + 1; /* + 27 */
	});
    /* небольшой костыль высоты */
    categoriesItemsHeight -= 1;
	/* если высота списка подкатегорий меньше высоты блока - сокращаем */
	if( categoriesItemsHeight < categoriesListHeight)
	{
		$(".box .content .column.left .block .categories.subcats").height(categoriesItemsHeight);
		$(".box .content .column.left .block .categories.subcats ul").height(categoriesItemsHeight);
	}
	$(".box .content .column.left .block .categories ul").customScrollbar( { hScroll: false, preventDefaultScroll : true } );
	$(".box .content .column.left .block .categories ul").on("customScroll", function(event, scrollData)
	{
		if(scrollData.scrollPercent == 0 || scrollData.scrollPercent >= 100)
		{
			$(this).mousewheel(function(event) { event.preventDefault(); });
		}
	});
	/* / Скролл-бар в левой колонке на странице списка товаров */
	
	/* Главное меню сайта - пункты со стрелками */
	$(".header .column.right .menu").mainMenuManagement();
	/* / Главное меню сайта - пункты со стрелками */
    
    /* Баннеры на Главной странице */
    var slider = $(".slider");
    if(slider.length > 0)
    {
        slider.photoSlider(5000, 500);
    }
    /* / Баннеры на Главной странице */
	
	/* обработчики фиксированного футера */
	/* кнопка Наверх */
	$(".footer.fixed .button.top").windowScrollToTop(1500);
	
	/* обратная связь */
	$(".footer .wrap .block.feedback .error-description-form").FormValidation(true, "/ajax/feedback.php");
	$(".footer.fixed .feedback .message .suggestion-form").FormValidation(true, "/ajax/feedback.php", "question_success");
	/*$(".footer.fixed .feedback .message .tabs").tabsSwitch();*/
	$(".footer.fixed .feedback").popUpMenu(500);
	/* / обработчики фиксированного футера */
    
    /* переход к полной версии сайта */
    /* значение куки site_full_version: */
    /* 0 - использовать адаптивные стили */
    /* 1 - полная версия */
    $(".site-full-version").on( "click", function(event)
    {
        var cookieName = "site_full_version";
        var siteFullVersion = $.cookie(cookieName);
        if(typeof siteFullVersion === "undefined") siteFullVersion = 0;
        if(siteFullVersion == 0)
        {
            siteFullVersion = 1;
            if(typeof yaCounter10648792 !== "undefined") yaCounter10648792.reachGoal("ITEM_POLNAJA_VERSIJA");
        }
        else { siteFullVersion = 0; }
        $.cookie(cookieName, siteFullVersion, { path: "/" } );
        window.setTimeout(function() { window.location.reload(true); }, 500);
        event.preventDefault();
    });
    /* / переход к полной версии сайта */
	
	/* Новости и статьи на Главной странице */
	$(".block.frame.news, .block.frame.articles").on("mouseover", "li.item", function()
	{
		$(this).addClass("hover");
	});
	$(".block.frame.news, .block.frame.articles").on("mouseout", "li.item", function()
	{
		$(this).removeClass("hover");
	});
	/* / Новости и статьи на Главной странице */
    
    /* Популярные категории на Главной странице */
    var popularCategories = $(".block.frame.categories");
    if(popularCategories.length == 1)
    {
        popularCategories.find(".product-carousel").productCarousel(1500);
    }
    /* / Популярные категории на Главной странице */
	
	/* Страница акций */
	$(".product-list.actions").on("mouseover", "li.item", function()
	{
		$(this).addClass("hover");
	});
	$(".product-list.actions").on("mouseout", "li.item", function()
	{
		$(this).removeClass("hover");
	});
	/* / Страница акций */
	
	/* Страница новостей */
	$(".product-list.news").on("mouseover", "li.item", function()
	{
		$(this).addClass("hover");
	});
	$(".product-list.news").on("mouseout", "li.item", function()
	{
		$(this).removeClass("hover");
	});
	/* выбор даты новостей и статей*/
	$(".box.main_content.news, .box.main_content.articles").on("change", ".column.left .pager select", function()
	{
		var object = $(this);
		var selected = object.find("option:selected");
		var link = parseInt(selected.val());
		var parentClass = object.parent().parent().parent().parent().parent();
		/* переход на страницу с другим диапазоном новостей */
		if(isNaN(link)) link = 0;
		if(link > 0)
		{
			if(parentClass.hasClass("news"))
				link = "news/"+link;
			else
			{
				if(parentClass.hasClass("articles"))
					link = "articles/"+link;
			}
			window.location.href='/company/'+link+"/";
		}
	});
	/* / Страница новостей */
	
	/* Реклама в шапке сайта */
	/*$(".advertisement").showAdvertisement(500);*/
	/* / Реклама в шапке сайта */
	
	/* Обработчики личного кабинета */
	$(".personal-content").personalAccount();
	/* / Обработчики личного кабинета */
	
	/* Обработчики формы поиска на сайте */
	$("form.search").FormSearch();
	/* / Обработчики формы поиска на сайте */
	
	/* Фильтр каталога товаров */
	$(".box .column.left form").catalogFilters();
	/* / Фильтр каталога товаров */
	
	/* голосование рейтинг лайки */
	$(".voting-rating-likes").each( function(index)
	{
		$(this).ratingLikes();
	});
	/* / голосование рейтинг лайки */
	
	/* фокус и блюр для всех полей текста */
	var placeholder = "";
	$("input[type='text']:not(#search_input), input[type='password'], textarea").on("focus", function()
	{
		var object = $(this);
		object.addClass("focus");
		placeholder = object.attr("placeholder");
		object.attr( { "placeholder" : "" } );
	});
	$("input[type='text'], input[type='password'], textarea").on("blur", function()
	{
		var object = $(this);
		object.removeClass("focus");
		object.attr( { "placeholder" : placeholder } );
	});
	/* / фокус и блюр для всех полей текста */
});
$(window).on("load", function () {
    /* # Lazy Load Plugin for jQuery */
    systemParameters.lazyImages = $(".img-lazy");
    if(jQuery.isFunction(systemParameters.lazyImages.lazyload)) {
        systemParameters.lazyImages.lazyload({
            event : "onImgLazyLoad" /*,
            load: function() {
                console.log("onImgLazyLoad callback");
            } */
        });
    }
    systemParameters.lazyImages.trigger("onImgLazyLoad");
    /* / Lazy Load Plugin for jQuery */
});
/* обработчик для загрузки голосования и рейтинга в карусели товаров */
$(document).on("DOMNodeInserted", function(event)
{
	if(typeof event.target !== "undefined" && $(event.target).attr("class") == "item")
	{
		$(event.target).find(".voting-rating-likes").ratingLikes();
	}
});
/* / обработчик для загрузки голосования и рейтинга в карусели товаров */

/* Изменение размеров окна */
$(window).resize( function()
{
	WindowOnResize();
});
/* / Изменение размеров окна */