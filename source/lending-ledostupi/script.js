$(document).ready( function()
{    
    $("a.scroll-to").click( function(event)
	{
		var top = $(".characteristics.details").offset().top;
		$("html, body").animate( { scrollTop : top }, 500 );
		
		event.preventDefault();
	});
	
	(function($)
	{
		// Параметры:
		// useAjax - использовать(true) или нет(false) 
		// url - адрес скрипта для Ajax запроса
		$.fn.FormValidation = function(useAjax, url)
		{
			var object = $(this);
			/* имя класса обязательных полей */
			var reqClassName = "required";
			
			var reqText;		/* текст - input type text */
			var reqPhone;		/* номер телефона */
			var count;			/* блок количества товара */
			var maxProductCount;/* максимальное количество товара */
			var productCount;	/* количество товара */
			var countInput;
			var selectType;		/* тип ледоступов */
			
			count = object.find(".count ul");
			countInput = count.find("input");
			maxProductCount = 999;
			productCount = parseInt(countInput.val());
			if(isNaN(productCount))
			{
				productCount = 1;
				countInput.val(productCount);
			}
			
			/* поиск обязательных полей */
			reqText = object.find("input[type='text']."+reqClassName+".text");
			reqPhone = object.find("input[type='text']."+reqClassName+".phone");
			
			selectType = object.find("select[name='type']");
			
			/* проверка обязательных полей */
			reqText.each( function()
			{
				var obj = $(this);
				obj.blur( function()
				{
					CheckText(obj);
				});
				obj.focus( function()
				{
					var errorMessage = obj.attr("title");
					if(obj.hasClass("error")) obj.removeClass("error");
					if(obj.val() == errorMessage) obj.val("");
				});
			});
			reqPhone.each( function()
			{
				var obj = $(this);
				obj.mask("+7 (999) 999-99-99");
				obj.blur( function()
				{
					CheckText(obj);
				});
				obj.focus( function()
				{
					if(obj.hasClass("error")) obj.removeClass("error");
				});
			});
			/* количество товара */
			countInput.focus( function()
			{
				var value = parseInt(countInput.val());
				if(isNaN(value))
					countInput.val(productCount);
				else
					productCount = value;
				console.log( productCount );
			});
			countInput.blur( function()
			{
				var value = parseInt(countInput.val());
				if(isNaN(value) || value < 0)
					countInput.val(productCount);
				else
				{
					productCount = value;
					if(productCount > maxProductCount)
						productCount = maxProductCount;
					countInput.val(productCount);
				}
			});
			count.find(".minus").click( function(event)
			{
				var value = parseInt(countInput.val());
				productCount = value - 1;
				if(isNaN(productCount) || productCount < 1)
				{
					productCount = 1;
					countInput.val(productCount);
				}
				else
					countInput.val(productCount);
				event.preventDefault();
			});
			count.find(".plus").click( function(event)
			{
				var value = parseInt(countInput.val());
				productCount = value + 1;
				if(isNaN(productCount))
				{
					productCount = 1;
					countInput.val(productCount);
				}
				else
				{
					if(productCount > maxProductCount) productCount = maxProductCount;
					countInput.val(productCount);
				}
				event.preventDefault();
			});
			/* выбор типа ледоступов */
			if(selectType.length > 0)
			{
				selectType.change( function()
				{
					switch( $(this).find("option:selected").val() )
					{
						case "everyday":	object.find(".price").text( frostWalkers.everyDay.price.actual + " руб." ); break;
						case "pro":			object.find(".price").text( frostWalkers.pro.price.actual + " руб." ); break;
					}
				});
			}
			
			/* отправка формы */
			object.submit( function()
			{
				var hasName = true, hasPhone = true;
				
				reqText.each( function()
				{
					var obj = $(this);
					hasName = CheckText(obj);
				});
				reqPhone.each( function()
				{
					var obj = $(this);
					hasPhone = CheckText(obj);
				});
				
				/* если все поля заполнены */
				if(hasName && hasPhone)
				{
					if(typeof useAjax === "undefined")	useAjax = false;
					if(typeof url === "undefined")		url = "";
				
					/* Ajax отправка данных формы и получение/обработка ответа */
					if(useAjax)
					{
						/* url - адрес скрипта */
						/* post - метод запроса */
						/* object - объект формы */
						AjaxSubmit(url,"post",object);
						return false;
					}
					else return true; /* обычная отправка формы */
				}
				return false;
			});
			
			/* функции проверки значений */
			function CheckText(obj)
			{
				var errorMessage = obj.attr("title");
				if(obj.val() == "" || obj.val() == errorMessage)
				{
					obj.val(errorMessage);
					obj.addClass("error");
					return false;
				}
				obj.removeClass("error");
				return true;
			}
			
			function AjaxSubmit(url, method, form)
			{	
				var data = {};
				
				form.find("input").each( function()
				{
					var name = $(this).attr("name");
					var value = $(this).val();
					if(typeof name !== "undefined") data[name] = value;
				});
				
				form.find("select").each( function()
				{
					var name = $(this).attr("name");
					var value = $(this).find("option:selected").val();
					if(typeof name !== "undefined") data[name] = value;
				});
				
				if(method == "post")
				{
					$.post(url, {
									name:		data["name"],
									contact:	data["phone"],
									size:		data["size"],
									quantity:	data["quantity"],
									fw_type:	data["type"],
									pid:		data["quick_order_pid"],
									sid:		data["quick_order_sid"],
									city:		data["quick_order_city"],
									city_id:	data["quick_order_city_id"],
									type:		"lending_order"
								},
					function(data)
					{
						var response = JSON.parse(data);
						if(response.success)
						{
							if(yaCounter10648792) yaCounter10648792.reachGoal('LEDOSTUP_QUICK_ORDER');
							form.parent().html('<div class="text-after"><h3>Спасибо за заказ</h3> В ближайшее время с вами свяжется наш оператор и уточнит условия получения товара. Если вы желаете дополнить текущий заказ другим товаром, просто дождитесь звонка оператора.</div>');
						}
					});
				}			
			}
		}
	})(jQuery);
	
	$(".order-form form").FormValidation(true, "/ajax/quick_order.php");
});