/* проверяем версию jQuery */
/* console.log("jQuery " + jQuery.fn.jquery); */
/* параметры сайта */
var systemParameters = {
    mobileDevice: {
        isCellPhone: false,
        isTabletPC: false,
        isPC: false
    },
    user: {
        isAuth: false
    }
};
/*
Если в браузере не определен метод массива indexOf - определяем его
*/
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        if (this === undefined || this === null) {
            throw new TypeError('"this" is null or not defined');
        }
        var length = this.length >>> 0; /* Hack to convert object.length to a UInt32 */
        fromIndex = +fromIndex || 0;
        if (Math.abs(fromIndex) === Infinity) {
            fromIndex = 0;
        }
        if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0) {
                fromIndex = 0;
            }
        }
        for (; fromIndex < length; fromIndex++) {
            if (this[fromIndex] === searchElement) {
                return fromIndex;
            }
        }
        return -1;
    }
}
/*
Если в браузере не определен метод строки trim - определяем его
*/
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
/* изменяем размеры картинки */
function resizeImage(width, height, maxImageWidth, maxImageHeight) {
        var marginLeftRight, marginTopBottom, ratio;
        width = parseInt(width);
        if (isNaN(width)) width = 0;
        height = parseInt(height);
        if (isNaN(height)) height = 0;
        if (width > maxImageWidth || height > maxImageHeight) {
            if (width > maxImageWidth) {
                ratio = width / maxImageWidth;
                width = maxImageWidth;
                height = parseInt(height / ratio);
            }
            if (height > maxImageHeight) {
                ratio = height / maxImageHeight;
                width = parseInt(width / ratio);
                height = maxImageHeight;
            }
            /* центрируем картинку по высоте и ширине */
            if (height < maxImageHeight) {
                marginTopBottom = parseInt((maxImageHeight - height) / 2);
            }
            if (width < maxImageWidth) {
                marginLeftRight = parseInt((maxImageWidth - width) / 2);
            }
            if (isNaN(marginTopBottom)) marginTopBottom = 0;
            if (isNaN(marginLeftRight)) marginLeftRight = 0;
            return {
                width: width,
                height: height,
                marginTopBottom: marginTopBottom,
                marginLeftRight: marginLeftRight
            };
        }
        return {
            width: width,
            height: height,
            marginTopBottom: 0,
            marginLeftRight: 0
        };
    }
    /* вычисление стоимости и условий доставки для города */
function CalculateCityDeliveryRules(updatedTotalPrice) {
        /* стоимость доставки по условиям диапазонов для города */
        /* -2	- доставка невозможна */
        /* -1	- доставка будет бесплатной при достижении суммы заказа */
        /* == 0	- доставка бесплатна */
        /* > 0	- доставка платная */
        var cityDeliveryRulesPrice = -2;
        /* сумма, которую необходимо доплатить для достижения условий диапазона */
        var cityDeliveryRulesNeedToPay = 0;
        /*cityDeliveryFree = $("input[name='FREE_DELIVERY_CITY']").val();*/
        if (typeof cityDeliveryRules === "object") {
            for (var field in cityDeliveryRules) {
                if (updatedTotalPrice >= cityDeliveryRules[field].min && updatedTotalPrice <= cityDeliveryRules[field].max) {
                    cityDeliveryRulesPrice = cityDeliveryRules[field].delivery;
                    if (cityDeliveryRulesPrice == 0) cityDeliveryRulesPrice = -1; /* доставка будет бесплатной при достижении суммы заказа */
                    cityDeliveryRulesNeedToPay = cityDeliveryRules[field].max - updatedTotalPrice;
                }
            }
            if (updatedTotalPrice >= cityDeliveryRules[field].max && cityDeliveryRules[field].delivery == 0)
                cityDeliveryRulesPrice = 0; /* доставка бесплатна */
        }
        return [cityDeliveryRulesPrice, cityDeliveryRulesNeedToPay];
    }
    /* / вычисление стоимости и условий доставки для города */
    /* Добавление товара в корзину */
    /* Сохраняем товар в куки */
function SaveProductToCookies(id, value, residue, price, todelete, source) {
        var fuser = $("input[name=fuser_id]").val();
        var itemId = $.cookie('new_global_basket_item_' + fuser); /* массив ID товара */
        var itemNumber = $.cookie('new_global_basket_quant_' + fuser); /* количество товара */
        var itemNumberAlready = $.cookie("shag_global_basket_" + fuser); /* количество товара, который уже добавлен */
        var itemResidue = residue; /* количество товара из распродажи */
        /* totalPrice и totalNumber - нужно удалить в будущем */
        var totalPrice = parseInt($("input[name=total_price]").val());
        var totalNumber = parseInt($("input[name=total_goods]").val());
        var index = 0;
        var itemSource = source; /* откуда был добавлен товар - символьный код */
        var itemPrice = price; /* цена товара */
        if (typeof itemSource === "undefined") itemSource = "";
        /* получаем количество товара, который уже был добавлен в корзину */
        if (typeof itemNumberAlready !== "undefined") {
            itemNumberAlready = itemNumberAlready.split(";");
            if (typeof itemNumberAlready === "object") {
                var found = false;
                var length = itemNumberAlready.length;
                for (var i = 0; i < length; i++) {
                    var temp = itemNumberAlready[i].split(":");
                    var tempId = temp[0]; /* ID товара */
                    var tempNumber = temp[1]; /* Количество товара */
                    var tempSource = temp[2]; /* Откуда был добавлен товар */
                    if (tempId == id) {
                        itemNumberAlready = parseInt(tempNumber);
                        found = true;
                        break;
                    }
                }
                if (!found) itemNumberAlready = 0;
            }
        } else
            itemNumberAlready = 0;
        /* количество товара, который добавляем должно быть меньше, чем количество товара из распродажи */
        /* иначе возвращаем false - товар не добавлен */
        if (itemResidue > 0) {
            var tcount = 0; /* общее количество товара */
            if (typeof itemNumber !== "undefined") {
                var iItemId = JSON.parse(itemId);
                var iNumber = JSON.parse(itemNumber);
                var iIndex = iItemId.indexOf(id);
                if (iIndex > -1) tcount += (iNumber[iIndex] + value);
            } else
                tcount += (itemNumberAlready + value);
            if (tcount > itemResidue)
                return false;
        }
        /* Удаление товара */
        if (todelete == true) {
            itemNumberAlready = 0;
            /* меняем состояние кнопки добавления в корзину */
            /* проверяем карточку товара */
            var cardProduct = $(".card-product.in-basket");
            if (cardProduct.length == 1) {
                var cardProductId = cardProduct.find(".actions input").attr("id");
                cardProductId = parseInt(cardProductId.split("_")[1]);
                if (isNaN(cardProductId)) cardProductId = 0;
                if (cardProductId == id) {
                    cardProduct.removeClass("in-basket");
                }
            }
            /* проверяем список товаров */
            var itemProduct = $(".item.in-basket");
            if (itemProduct.length > 0) {
                itemProduct.each(function () {
                    var obj = $(this);
                    var productId = obj.find(".add2basket").attr("onclick").split(";")[0];
                    productId = parseInt(productId.split(",")[1]);
                    if (isNaN(productId)) productId = 0;
                    if (productId == id) {
                        obj.removeClass("in-basket");
                    }
                });
            }
        }
        /* меняем состояние ВСЕХ кнопок добавления в корзину */
        var updatedTotalPrice = parseInt($(".header.fixed .wrap .basket a.title span span.name span.price").text());
        if (isNaN(updatedTotalPrice) || updatedTotalPrice == "") {
            updatedTotalPrice = 0;
        } else {
            /* при удалении или уменьшении количества товара */
            if (todelete == true || value < 0) {
                updatedTotalPrice -= itemPrice;
            } else {
                if (value > 0) {
                    updatedTotalPrice += itemPrice;
                }
            }
        }
        /* если сумма заказа < 500 рублей - переход к оформлению заказа не возможен */
        if (updatedTotalPrice > 0 && updatedTotalPrice < 500 && $(".main_content").hasClass("allow_order")) {
            $(".main_content").removeClass("allow_order");
            /* проверяем карточку товара */
            var cardProduct = $(".card-product.in-basket");
            if (cardProduct.length == 1) {
                var cardProductId = cardProduct.find(".actions input").attr("id");
                cardProductId = parseInt(cardProductId.split("_")[1]);
                if (isNaN(cardProductId)) cardProductId = 0;
                if (cardProductId == id) {
                    $(".number-items").show();
                }
            }
        } else {
            if (updatedTotalPrice >= 500 && !$(".main_content").hasClass("allow_order")) {
                $(".main_content").addClass("allow_order");
            }
        }
        if (typeof itemId === "undefined") itemId = [[id, itemSource]]; /* первый элемент в массиве */
        else itemId = JSON.parse(itemId);
        if (typeof itemNumber === "undefined") {
            /* количество вновь добавленного товара увеличиваем на количество товара, который уже был добавлен */
            value += itemNumberAlready;
            if(value > 999) value = 999;
            itemNumber = [value]; /* первый элемент в массиве */
        } else {
            itemNumber = JSON.parse(itemNumber);
            /*index = itemId.indexOf(id);*/
            index = -1;
            for (var i in itemId) {
                if (itemId[i][0] == id) index = i;
            }
            /* количество вновь добавленного товара увеличиваем на количество товара, который уже был добавлен */
            if (index != -1) /* товар уже добавлен */ {
                if (todelete == true) itemNumber[index] = 0;
                else itemNumber[index] += value;
                if(itemNumber[index] > 999) itemNumber[index] = 999;
                value = itemNumber[index];
            } else {
                value += itemNumberAlready;
                if(value > 999) value = 999;
                itemId.push([id, itemSource]);
                itemNumber.push(value);
            }
        }
        itemId = JSON.stringify(itemId);
        itemNumber = JSON.stringify(itemNumber);
        /* totalPrice и totalNumber - нужно удалить в будущем */
        totalPrice = JSON.stringify(totalPrice);
        totalNumber = JSON.stringify(totalNumber);
        $.cookie('new_global_basket_item_' + fuser, itemId, {
            expires: 30,
            path: "/"
        });
        $.cookie('new_global_basket_quant_' + fuser, itemNumber, {
            expires: 30,
            path: "/"
        });
        /* totalPrice и totalNumber - нужно удалить в будущем */
        $.cookie('new_global_basket_totalprice_' + fuser, totalPrice, {
            expires: 30,
            path: "/"
        });
        $.cookie('new_global_basket_totalgoods_' + fuser, totalNumber, {
            expires: 30,
            path: "/"
        });
        /*
        возвращаем:
        id товара
        его количество (с учетом обновления)
        его количество, которое уже было добавлено
        общая цена
        общее количество товара
        */
        return JSON.stringify([id, value, itemNumberAlready, totalPrice, totalNumber]);
    }
    /* общий таймер и задержка для всех пунктов фиксированной шапки */
var hideBasketTimer, hideBasketTimerValue = 5000;

function put2cart(object, id, source) {
        var object = $(object);
        var productId = id;
        var productCount = 0;
        var productPrice = 0;
        var productName;
        var productImage, productImageWidth, productImageHeight, productImageMaxHeight = 90,
            productImageMaxWidth = 90;
        var productImageMarginLeftRight = 0,
            productImageMarginTopBottom = 0;
        var productResidue;
        var productSource = source; /* откуда был добавлен товар */
        var isProductInList = false; /* товар в списке */
        var isDeliveryFree = false; /* товар с бесплатной доставкой */
        /*
        productInBasket - информация о товаре, который добавлен в корзину
        Возможные значения:
        JSON - id товара и его количество
        false - товар не добавлен
        */
        var productInBasket = false;
        /* если товар в списке */
        if (object.parent().parent().hasClass("parameters") || (object.parent().hasClass("parameters") && object.parent().parent().hasClass("item")))
            isProductInList = true;
        /* остаток товара из распродажи */
        productResidue = parseInt(object.parent().parent().find(".residue span#" + productId + "_sale_count").text());
        if (productResidue == 0 || isNaN(productResidue)) productResidue = parseInt(object.parent().parent().find("input#" + productId + "_sale_count").val());
        if (isNaN(productResidue)) productResidue = 0;
        /* количество добавляемого товара */
        productCount = parseInt(object.parent().find("#count_" + productId).val());
        if (isNaN(productCount)) productCount = 1;
        /* цена товара */
        /* для страницы товара */
        productPrice = parseInt(object.parent().find(".price span i").text());
        if (isNaN(productPrice)) productPrice = 0;
        /* для карусели товаров */
        if (isProductInList) productPrice = parseInt(object.parent().find(".price span.actual").text());
        /* для списка товаров */
        if (productPrice == 0 || isNaN(productPrice)) productPrice = parseInt(object.parent().parent().find(".price span.actual").text());
        if (isNaN(productPrice)) productPrice = 0;
        /* название товара */
        productName = $("h1").text();
        if (isProductInList) /* список товаров */
            productName = object.parent().parent().find(".name a").text();
        if (typeof (productName) == "undefined") productName = "";
        /* картинка товара */
        var image = $(".card-product-image .photo-slider ul li.active a img");
        if (isProductInList) /* список товаров */ {
            if (object.parent().hasClass("parameters") && object.parent().parent().hasClass("item"))
                image = object.parent().parent().find("a.img img");
            else
                image = object.parent().parent().parent().find("a.img img");
        }
        productImage = image.attr("src");
        productImageWidth = image.attr("width");
        productImageHeight = image.attr("height");
        var dimentions = resizeImage(productImageWidth, productImageHeight, productImageMaxWidth, productImageMaxHeight);
        productImageWidth = dimentions.width;
        productImageHeight = dimentions.height;
        productImageMarginLeftRight = dimentions.marginLeftRight;
        productImageMarginTopBottom = dimentions.marginTopBottom;
        /* проверка бесплатной доставки товара */
        /* проверка страницы товара */
        isDeliveryFree = object.parent().parent().parent().parent().find(".card-product-image .photo-slider .delivery").text();
        if (typeof isDeliveryFree !== "undefined" && isDeliveryFree != "") isDeliveryFree = true;
        else {
            /* проверка списка товаров */
            isDeliveryFree = object.parent().parent().find("span.delivery").text();
            if (typeof isDeliveryFree !== "undefined" && isDeliveryFree != "") isDeliveryFree = true;
            else {
                /* проверка карусели товаров */
                isDeliveryFree = object.parent().parent().find("a.img .labels .free-shipping").attr("title");
                if (typeof isDeliveryFree !== "undefined") isDeliveryFree = true;
            }
        }
        productInBasket = SaveProductToCookies(productId, productCount, productResidue, productPrice, false, productSource);
        if (productInBasket != false) /* Товар успешно добавлен */ {
            productInBasket = JSON.parse(productInBasket);
            var addedProductId = parseInt(productInBasket[0]); /* ID добавленного товара */
            var addedProductNumber = parseInt(productInBasket[1]); /* общее количество добавленного товара */
            var addedProductAlready = parseInt(productInBasket[2]); /* общее количество добавленного товара, который был уже добавлен */
            var addedTotalPrice = parseInt(productInBasket[3]); /* общая стоимость всех товаров */
            var addedTotalNumber = parseInt(productInBasket[4]); /* общее количество всех товаров */
            /* удаляем блок временного уведомление о добавлении товара */
            $(".header.fixed .wrap .basket .message.product-preview").remove();
            var ulItems = $(".header.fixed .wrap .basket .message ul.items");
            /* обновляем общую стоимость и общее количество товара */
            var updatedTotalPrice = $(".header.fixed .wrap .basket a.title span span.name span.price").text();
            updatedTotalPrice = parseInt(updatedTotalPrice);
            if (isNaN(updatedTotalPrice)) updatedTotalPrice = 0;
            updatedTotalPrice += productPrice * productCount;
            var updatedTotalCount = $(".header.fixed .wrap .basket a.title span span.name span.count").text();
            updatedTotalCount = parseInt(updatedTotalCount);
            if (isNaN(updatedTotalCount)) updatedTotalCount = 0;
            updatedTotalCount += productCount;
            /* стоимость доставки по условиям диапазонов для города */
            /* -2	- доставка невозможна */
            /* -1	- доставка будет бесплатной при достижении суммы заказа */
            /* == 0	- доставка бесплатна */
            /* > 0	- доставка платная */
            var cityDeliveryRulesPrice = -2;
            /* сумма, которую необходимо доплатить для достижения условий диапазона */
            var cityDeliveryRulesNeedToPay = 0;
            var temp = CalculateCityDeliveryRules(updatedTotalPrice);
            cityDeliveryRulesPrice = temp[0];
            cityDeliveryRulesNeedToPay = temp[1];
            /* добавляем сообщение, если доставка товара бесплатна */
            if (isDeliveryFree === true || cityDeliveryRulesPrice == 0) {
                $(".header.fixed .wrap .basket a.title span span.name").html('<span class="price">' + updatedTotalPrice + '</span> р. (<span class="count">' + updatedTotalCount + '</span> шт.)');
                if ($(".header.fixed .wrap .basket a.title span span.delivery").attr("class") != "delivery") {
                    $(".header.fixed .wrap .basket a.title span:not(.name, .name .price, .name .count, .icon)").append("<span class='delivery'>Бесплатная доставка</span>");
                    /* иконка корзины становится зеленой */
                    $(".header.fixed .wrap .basket a.title span span.icon").addClass("free");
                }
            } else {
                var declension = '';
                switch (updatedTotalCount % 10) {
                case 2:
                case 3:
                case 4:
                    declension = 'а';
                    break;
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 0:
                    declension = 'ов';
                    break;
                }
                $(".header.fixed .wrap .basket a.title span span.name").html('В корзине <span class="count">' + updatedTotalCount + '</span> товар' + declension + ' на сумму <span class="price">' + updatedTotalPrice + '</span> р.');
            }
            /* переход в корзину работает только при сумме заказа больше 500 рублей */
            if (updatedTotalPrice >= 500)
                $(".header.fixed .wrap .basket").removeClass("not-available");
            else
                $(".header.fixed .wrap .basket").addClass("not-available");
            ulItems.find("li.item .parameters .counter input[name='product_" + productId + "']").val(addedProductNumber);
            /* добавляем кнопку оформления заказа (если её нет) */
            /*if($(".header.fixed .wrap .basket a.order").length == 0)
            $(".header.fixed .wrap .basket").append("<a class='order' href='/personal/buy/order.php'>Оформить</a>");*/
            /* один, добавленный в корзину, элемент */
            var productPreview = '';
            productPreview += '<li class="item';
            if (isDeliveryFree === true) productPreview += ' free_delivery';
            productPreview += '">';
            productPreview += '<a class="img" href="#" title="' + productName + '">';
            productPreview += '<span class="helper">&nbsp;</span>';
            productPreview += '<img src="' + productImage + '" width="' + productImageWidth + '" height="' + productImageHeight + '" alt="' + productName + '">';
            productPreview += '</a>';
            productPreview += '<div class="parameters">';
            productPreview += '<div class="name">';
            productPreview += '<a href="#" title="' + productName + '">' + productName + '</a>';
            productPreview += '</div>';
            productPreview += '<div class="counter">';
            productPreview += '<a class="minus" href="#" title="-">-</a>';
            productPreview += '<input type="text" name="product_' + productId + '" value="' + addedProductNumber + '">';
            productPreview += '<a class="plus" href="#" title="+">+</a>';
            productPreview += '</div>';
            productPreview += '<div class="price">' + productPrice + ' р.</div>';
            productPreview += '<!--<div class="article">Артикул: <span>771-640-999</span></div>-->';
            productPreview += '</div>';
            productPreview += '<a class="delete" href="#" title="Удалить товар из корзины">&nbsp;</a>';
            if (productResidue > 0) productPreview += '<input type="hidden" name="residue" value="' + productResidue + '">';
            productPreview += '</li>';
            /* добавляем товар в общий список товаров корзины */
            if ($(".header.fixed .wrap .basket .message").length == 0) /* Первый товар */ {
                var message = '<div class="message">';
                message += '<span class="arrow">&nbsp;</span>';
                message += '<ul class="items odinshag-skin" style="height:96px;">';
                message += productPreview;
                message += '</ul>';
                message += '<div class="total">';
                message += '<div class="info-message blue"';
                if ((cityDeliveryRulesPrice == -1 || cityDeliveryRulesPrice > 0) && cityDeliveryRulesNeedToPay > 0) {
                    message += ' style="display: block;"';
                }
                message += '>';
                message += '<span class="icon">&nbsp;</span>';
                message += '<p class="text">';
                message += 'Добавьте товаров еще на <b>' + cityDeliveryRulesNeedToPay + ' р</b> ';
                if (cityDeliveryRulesPrice == -1)
                    message += 'и ваш заказ мы доставим бесплатно.';
                else {
                    if (cityDeliveryRulesPrice > 0) message += 'и мы доставим заказ всего за ' + cityDeliveryRulesPrice + 'р.';
                }
                message += '</p>';
                message += '</div>';
                if (updatedTotalPrice >= 500) {
                    message += '<a class="button green" href="/personal/buy/order.php" title="Перейти в корзину для оформления заказа">Оформить заказ</a>';
                } else {
                    message += '<span class="text">Сумма заказа должна быть более 500 р.</span>';
                }
                message += '</div>';
                message += '<div class="border">&nbsp;</div>';
                message += '</div>';
                $(".header.fixed .wrap .basket").append('<div class="fixed-wrap">&nbsp;</div>');
                $(".header.fixed .wrap .basket").append(message);
            } else /* В корзине уже есть товары */ {
                /* обновляем количество товара или добавляем новый блок с товаром */
                var temp = ulItems.find("input[name='product_" + productId + "']");
                if (typeof temp.val() !== "undefined")
                    temp.val(addedProductNumber); /* обновляем */
                else /* добавляем новый блок с товаром */ {
                    if (ulItems.find(".viewport .overview").length > 0)
                        ulItems.find(".viewport .overview").append(productPreview);
                    else
                        ulItems.append(productPreview);
                }
                /* фикс высоты и ширины блоков */
                var length = ulItems.find("li").length;
                if (length > 3)
                    ulItems.find("li").css({
                        "width": "318px"
                    });
                else {
                    ulItems.find("li").css({
                        "width": "333px"
                    });
                    switch (length) {
                    case 1:
                        ulItems.css({
                            "height": "96px"
                        });
                        break;
                    case 2:
                        ulItems.css({
                            "height": "193px"
                        });
                        break;
                    case 3:
                        ulItems.css({
                            "height": "290px"
                        });
                        break;
                    }
                }
                /* обновляем плагин прокрутки товаров */
                ulItems.customScrollbar("resize", true);
                var totalContent = "";
                totalContent += '<div class="info-message blue"';
                if ((cityDeliveryRulesPrice == -1 || cityDeliveryRulesPrice > 0) && cityDeliveryRulesNeedToPay > 0) {
                    totalContent += ' style="display: block;"';
                }
                totalContent += '>';
                totalContent += '<span class="icon">&nbsp;</span>';
                totalContent += '<p class="text">';
                totalContent += 'Добавьте товаров еще на <b>' + cityDeliveryRulesNeedToPay + ' р</b> ';
                if (cityDeliveryRulesPrice == -1)
                    totalContent += 'и ваш заказ мы доставим бесплатно.';
                else {
                    if (cityDeliveryRulesPrice > 0) totalContent += 'и мы доставим заказ всего за ' + cityDeliveryRulesPrice + 'р.';
                }
                totalContent += '</p>';
                totalContent += '</div>';
                if (updatedTotalPrice >= 500) {
                    $(".header.fixed .wrap .basket .message .total span.text").remove();
                    totalContent += '<a class="button green" href="/personal/buy/order.php" title="Перейти в корзину для оформления заказа">Оформить заказ</a>';
                    $(".header.fixed .wrap .basket .message .total").html(totalContent);
                } else {
                    $(".header.fixed .wrap .basket .message .total a.button").remove();
                    totalContent += '<span class="text">Сумма заказа должна быть более 500 р.</span>';
                    $(".header.fixed .wrap .basket .message .total").html(totalContent);
                }
            }
            /* временное уведомление */
            message = '<div class="message product-preview">';
            message += '<span class="arrow">&nbsp;</span>';
            message += '<ul class="items odinshag-skin" style="height:96px;">';
            message += productPreview;
            message += '</ul>';
            message += '<div class="total">';
            message += '<div class="info-message blue"';
            if ((cityDeliveryRulesPrice == -1 || cityDeliveryRulesPrice > 0) && cityDeliveryRulesNeedToPay > 0) {
                message += ' style="display: block;"';
            }
            message += '>';
            message += '<span class="icon">&nbsp;</span>';
            message += '<p class="text">';
            message += 'Добавьте товаров еще на <b>' + cityDeliveryRulesNeedToPay + ' р</b> ';
            if (cityDeliveryRulesPrice == -1)
                message += 'и ваш заказ мы доставим бесплатно.';
            else {
                if (cityDeliveryRulesPrice > 0) message += 'и мы доставим заказ всего за ' + cityDeliveryRulesPrice + 'р.';
            }
            message += '</p>';
            message += '</div>';
            if (updatedTotalPrice >= 500) {
                message += '<a class="button green" href="/personal/buy/order.php" title="Перейти в корзину для оформления заказа">Оформить заказ</a>';
            } else {
                message += '<span class="text">Сумма заказа должна быть более 500 р.</span>';
            }
            message += '</div>';
            message += '<div class="border">&nbsp;</div>';
            message += '</div>';
            $(".header.fixed .wrap .basket").append(message);
            /* делаем корзину активной */
            $(".header.fixed .wrap .basket").addClass("active");
            $(".header.fixed .wrap .basket .message").hide();
            $(".header.fixed .wrap .basket .message.product-preview").show();
            /* скрываем уведомление о добавленном товаре через три секунды */
            /* делаем корзину не активной */
            clearTimeout(hideBasketTimer);
            hideBasketTimer = setTimeout(function () {
                $(".header.fixed .wrap .basket .message.product-preview").remove();
                /*tooltip.hide();*/
            }, hideBasketTimerValue);
            /* изменение вида кнопки добавления в корзину */
            /* добавляем скрываем кнопку с классом add2basket и отображаем кнопку с классом goto-order */
            if (object.hasClass("add2basket")) {
                if (updatedTotalPrice >= 500) {
                    $(".main_content").addClass("allow_order");
                    if (productSource == "Card") {
                        object.parent().children(".number-items").hide();
                    }
                }
                switch (productSource) {
                case "Card":
                    $(".card-product").addClass("in-basket");
                    break;
                case "SimilarItems":
                case "CardCrossSale":
                case "Preview":
                    object.parent().parent().parent().addClass("in-basket");
                    break;
                default:
                    object.parent().parent().parent().addClass("in-basket");
                    break; /* страница сравнения */
                }
            }
            /* статистика и партнерки */
            if (typeof yaCounter10648792 !== "undefined")
                yaCounter10648792.reachGoal('ADD_TO_CART');
            if (!systemParameters.mobileDevice.isCellPhone) {
                $("body").append("<img src='//pixel.ritorno.ru/pixel?pid=4957&oid=" + productId + "&basket_action=add&sid=118' width='1' height='1' alt=''>");
                if (typeof rrApi !== "undefined") {
                    try {
                        rrApi.addToBasket(productId);
                    } catch (e) {}
                }
            }
        } else {
            /* временное уведомление */
            var tooltip = $(".header.fixed .wrap .basket .tooltip");
            tooltip.html("<span class='arrow'>&nbsp;</span>Превышено максимальное количество товара!");
            tooltip.show();
            /* скрываем сообщение об ошибке через три секунды */
            clearTimeout(hideBasketTimer);
            hideBasketTimer = setTimeout(function () {
                tooltip.hide();
            }, hideBasketTimerValue);
        }
        return false;
    }
    /* / Добавление товара в корзину */
    /* показать форму ответа администратора сайта */
function showAnswerForm(commentID, object) {
        $(object).parent().find(".answer-form").show();
        return false;
    }
    /* / показать форму ответа администратора сайта */
    /* сохранение информации о товаре в Сравнение (AddToCompared), Просмотренные (AddToViewed), Закладки (AddToFavorites) */
    /* ограничение количества товара для сравнения и закладок */
var productAddToLimit = 99;
/*
функции принимают три параметра 
object - ссылка на объект (кнопку)
subdivisionID - ID раздела
productID - ID товара
*/
/* Закладки */
function AddToFavorites(obj, subdivisionID, productID) {
    var object = $(obj);
    var favorites = $(".header.fixed .wrap .favorites");
    if (!object.hasClass("active")) /* добавляем товар */ {
        /* последний параметр - ограничение в productAddToLimit товаров */
        var response = AddToCookies("favorites", subdivisionID, productID, productAddToLimit);
        /* если товар успешно добавлен или уже существует в списке - делаем кнопку активной */
        if (response == "Product added" || response == "Product exists") {
            object.addClass("active");
            object.find("span:not(.icon)").text("Перейти");
            /* обновляем данные в фиксированной шапке */
            var count = parseInt(favorites.find(".count").text()) + 1;
            if (isNaN(count)) count = 1;
            favorites.find(".count").text(count);
            /* активируем пункт закладок */
            if (!favorites.hasClass("active")) favorites.addClass("active");
            if (!favorites.find(".count").hasClass("color")) favorites.find(".count").addClass("color");
            /* показываем сообщение */
            favorites.find(".message").html("<span class='arrow'>&nbsp;</span>" + systemMessages.info.productAdded2Favorites);
            favorites.find(".message").show();
            /* статистика и партнерки */
            if (typeof yaCounter10648792 !== "undefined") yaCounter10648792.reachGoal('ADD_2_FAVORITES');
            clearTimeout(hideBasketTimer);
            hideBasketTimer = setTimeout(function () {
                favorites.find(".message").hide();
                $(".header.fixed .wrap .compare .message").hide();
            }, hideBasketTimerValue);
        } else {
            /* если лимит превышен - кнопка не активна */
            if (response == "Limit is exceeded") {
                object.removeClass("active");
                object.find("span:not(.icon)").text("В избранное");
                /* показываем сообщение */
                favorites.find(".message").html("<span class='arrow'>&nbsp;</span>" + systemMessages.error.limitExceeted);
                favorites.find(".message").show();
                clearTimeout(hideBasketTimer);
                hideBasketTimer = setTimeout(function () {
                    favorites.find(".message").hide();
                    $(".header.fixed .wrap .compare .message").hide();
                }, hideBasketTimerValue);
            }
        }
    } else /* удаляем товар */ {
        /* вместо удаления происходит переход на страницу */
        document.location.href = "/personal/favorites/";
        /*
        object.removeClass("active");
        object.find("span:not(.icon)").text("В избранное");
        // обновляем данные в фиксированной шапке
        var count = parseInt(favorites.find(".count").text()) - 1;
        if (isNaN(count) || count < 0) {
            count = 0;
            favorites.removeClass("active");
            favorites.find("count").removeClass("color");
        }
        favorites.find(".count").text(count);
        // показываем сообщение
        favorites.find(".message").html("<span class='arrow'>&nbsp;</span>" + systemMessages.info.productDeletedFromFavorites);
        favorites.find(".message").show();
        clearTimeout(hideBasketTimer);
        hideBasketTimer = setTimeout(function () {
            favorites.find(".message").hide();
            $(".header.fixed .wrap .compare .message").hide();
        }, hideBasketTimerValue);
        DeleteFromFavorites(obj, subdivisionID, productID);
        */
    }
}

function DeleteFromFavorites(obj, subdivisionID, productID) {
    /* удаление товара */
    if (typeof subdivisionID !== "undefined" && typeof productID !== "undefined") {
        var object = $(obj);
        /* если мы находимся в списке товаров */
        if (object.parent().parent().hasClass("item") && object.hasClass("icon")) {
            /* уменьшаем количество товара в фиксированной шапке */
            span = $(".header.fixed .wrap .favorites span.count");
            count = parseInt(span.text()) - 1;
            if (isNaN(count) || count < 0) count = 0;
            span.text(count);
            /* уменьшаем количество товаров в категории */
            var span = $(".categories.compare_sections").find("li.active span span");
            var count = parseInt(span.text()) - 1;
            if (isNaN(count) || count < 0) count = 0;
            span.text(count);
            /* удаляем блок товара из списка */
            object.parent().parent().remove();
        }
        DeleteFromCookies("", "favorites", subdivisionID, productID);
    } else {
        /* удаление категории */
        if (typeof subdivisionID !== "undefined") {
            DeleteFromCookies("", "favorites", subdivisionID);
            window.location.reload(true);
        }
    }
    return;
}

function ClearFavorites(message) {
        DeleteFromCookies(message, "favorites");
    }
    /* Просмотренные */
function AddToViewed(subdivisionID, productID) {
    /* просмотренные товары не имеют лимита */
    var response = AddToCookies("viewed", subdivisionID, productID, productAddToLimit);
}

function DeleteFromViewed(obj, subdivisionID, productID) {
    /* удаление товара */
    if (typeof subdivisionID !== "undefined" && typeof productID !== "undefined") {
        var object = $(obj);
        /* если мы находимся в списке товаров */
        if (object.parent().parent().hasClass("item")) {
            /* уменьшаем количество товаров в категории */
            var span = $(".categories.compare_sections").find("li.active span span");
            var count = parseInt(span.text()) - 1;
            if (isNaN(count) || count < 0) count = 0;
            span.text(count);
            /* уменьшаем количество товара в фиксированной шапке */
            span = $(".header.fixed .wrap .viewed span.count");
            count = parseInt(span.text()) - 1;
            if (isNaN(count) || count < 0) {
                count = 0;
                $(".header.fixed .wrap .viewed span.count").removeClass("color");
            }
            span.text(count);
            /* удаляем блок товара из списка */
            object.parent().parent().remove();
        }
        DeleteFromCookies("", "viewed", subdivisionID, productID);
    } else {
        /* удаление категории */
        if (typeof subdivisionID !== "undefined") {
            DeleteFromCookies("", "viewed", subdivisionID);
            window.location.reload(true);
        }
    }
    return;
}

function ClearViewed(message) {
        DeleteFromCookies(message, "viewed");
    }
    /* Сравнение */
function AddToCompared(obj, subdivisionID, productID) {
    var object = $(obj);
    var compared = $(".header.fixed .wrap .compare");
    if (!object.hasClass("active")) /* добавляем товар */ {
        /* ограничение в productAddToLimit товаров */
        var response = AddToCookies("compared", subdivisionID, productID, productAddToLimit);
        /* если товар успешно добавлен или уже существует в списке - делаем кнопку активной */
        if (response == "Product added" || response == "Product exists") {
            object.addClass("active");
            object.find("span:not(.icon)").text("Перейти");
            /* обновляем данные в фиксированной шапке */
            var count = parseInt(compared.find(".count").text()) + 1;
            if (isNaN(count)) count = 1;
            compared.find(".count").text(count);
            /* активируем пункт закладок */
            if (!compared.hasClass("active")) compared.addClass("active");
            if (!compared.find(".count").hasClass("color")) compared.find(".count").addClass("color");
            /* показываем сообщение */
            compared.find(".message").html("<span class='arrow'>&nbsp;</span>" + systemMessages.info.productAdded2Compare);
            compared.find(".message").show();
            /* статистика и партнерки */
            if (typeof yaCounter10648792 !== "undefined") yaCounter10648792.reachGoal('ADD_2_COMPARE');
            clearTimeout(hideBasketTimer);
            hideBasketTimer = setTimeout(function () {
                compared.find(".message").hide();
                $(".header.fixed .wrap .favorites .message").hide();
            }, hideBasketTimerValue);
        } else {
            /* если лимит превышен - кнопка не активна */
            if (response == "Limit is exceeded") {
                object.removeClass("active");
                object.find("span:not(.icon)").text("Сравнить");
                /* показываем сообщение */
                compared.find(".message").html("<span class='arrow'>&nbsp;</span>" + systemMessages.error.limitExceeted);
                compared.find(".message").show();
                clearTimeout(hideBasketTimer);
                hideBasketTimer = setTimeout(function () {
                    compared.find(".message").hide();
                    $(".header.fixed .wrap .favorites .message").hide();
                }, hideBasketTimerValue);
            }
        }
    } else /* удаляем товар */ {
        /* вместо удаления происходит переход на страницу */
        document.location.href = "/personal/compare/";
        /*
        object.removeClass("active");
        object.find("span:not(.icon)").text("Сравнить");
        // обновляем данные в фиксированной шапке
        var count = parseInt(compared.find(".count").text()) - 1;
        if (isNaN(count) || count < 0) {
            count = 0;
            compared.removeClass("active");
        }
        compared.find(".count").text(count);
        // показываем сообщение
        compared.find(".message").html("<span class='arrow'>&nbsp;</span>" + systemMessages.info.productDeletedFromCompare);
        compared.find(".message").show();
        clearTimeout(hideBasketTimer);
        hideBasketTimer = setTimeout(function () {
            compared.find(".message").hide();
            $(".header.fixed .wrap .favorites .message").hide();
        }, hideBasketTimerValue);
        DeleteFromCompared(obj, subdivisionID, productID);
        */
    }
    return;
}

function DeleteFromCompared(obj, subdivisionID, productID) {
    /* удаление товара */
    if (typeof subdivisionID !== "undefined" && typeof productID !== "undefined") {
        var object = $(obj);
        /* если мы находимся в списке товаров */
        if (object.parent().parent().hasClass("item") && object.hasClass("icon")) {
            /* уменьшаем количество товаров в категории */
            var span = $(".categories.compare_sections").find("li.active span span");
            var count = parseInt(span.text()) - 1;
            if (isNaN(count) || count < 0) count = 0;
            span.text(count);
            /* уменьшаем количество товара в фиксированной шапке */
            span = $(".header.fixed .wrap .compare span.count");
            count = parseInt(span.text()) - 1;
            if (isNaN(count) || count < 0) count = 0;
            span.text(count);
            /* удаляем блок товара из списка */
            object.parent().parent().remove();
            /* обновляем скролл бар */
            var productListHeight = $(".product-list.vertical").css("height");
            $(".product-list.vertical").customScrollbar("resize", true);
            /* костыль для фикса высоты блока */
            if ($(".product-list.vertical").find("li").length >= 3) {
                productListHeight = parseInt(productListHeight) - 15;
                setTimeout(function () {
                    $(".product-list.vertical .viewport").css({
                        "height": productListHeight
                    });
                }, 5);
            }
        }
        DeleteFromCookies("", "compared", subdivisionID, productID);
    } else {
        /* удаление категории */
        if (typeof subdivisionID !== "undefined") {
            DeleteFromCookies("", "compared", subdivisionID);
            window.location.reload(true);
        }
    }
    return;
}

function ClearCompared(message) {
        DeleteFromCookies(message, "compared");
    }
    /*
    Сохранние JSON массива с данными о товаре в куки
    cookieName - название кук
    subdivisionID - ID раздела
    productID - ID товара
    */
function AddToCookies(cookieName, subdivisionID, productID, limit) {
        var cookie = $.cookie(cookieName);
        var productLimit = 0; /* ограничение на количество товаров */
        if (typeof limit !== "undefined") productLimit = limit;
        /* Если куки не сохранены - создаем новый массив */
        if (typeof cookie === "undefined") {
            cookie = {}; /* массив товаров */
            cookie.count = 1;
            cookie.items = {};
            cookie.items[subdivisionID] = [productID];
            cookie = JSON.stringify(cookie);
            if (systemParameters.user.isAuth) {
                /* для авторизованного пользователя - 30 дней */
                $.cookie(cookieName, cookie, {
                    expires: 30,
                    path: "/"
                });
            } else {
                /* для остальных - сессия */
                $.cookie(cookieName, cookie, {
                    expires: "",
                    path: "/"
                });
            }
            return "Product added";
        } else /* Обновляем данные в массиве */ {
            cookie = JSON.parse(cookie);
            if (typeof cookie === "object") {
                var count = 0; /* общее количество товаров */
                for (var field in cookie) {
                    if (field == "count") {
                        count = cookie[field]; /* количество */
                        if (typeof count === "undefined") count = 0;
                        count++; /* увеличиваем количество товара на 1 */
                    }
                    if (field == "items") {
                        var hasSubdivision = false; /* раздел не добавлен */
                        var queueLimit = 3; /* лимит очереди */
                        /* в объекте items ищем данные о товаре */
                        for (var subID in cookie[field]) {
                            /* если раздел уже существует - ищем в нем товары */
                            if (subID == subdivisionID) {
                                hasSubdivision = true;
                                /* перебираем массив товаров */
                                var c = cookie[field][subdivisionID].length;
                                var isAdded = false; /* товар не добавлен */
                                for (var i = 0; i < c; i++) {
                                    if (cookie[field][subdivisionID][i] == productID) isAdded = true;
                                }
                                /* если товар еще не добавлен - добавляем его в массив */
                                if (!isAdded) {
                                    /* если количество товаров имеет лимит */
                                    if (productLimit > 0) {
                                        if (count > productLimit) {
                                            count = productLimit;
                                            /* алгоритм очереди - первые товары удаляем */
                                            for (var i = 0; i < cookie[field][subdivisionID].length; i++) {
                                                if (cookie[field][subdivisionID][i] != null) {
                                                    cookie[field][subdivisionID][i] = null;
                                                    /* delete cookie[field][subdivisionID][i]; */
                                                    break;
                                                }
                                            }
                                        }
                                        /* добавляем товар */
                                        cookie["count"] = count;
                                        cookie[field][subdivisionID].push(productID);
                                        /* return "Limit is exceeded"; */
                                    }
                                } else
                                    return "Product exists";
                            }
                        }
                        /* если раздел еще не добавлен */
                        /* создаем раздел и добавляем товар */
                        if (!hasSubdivision) {
                            /* если количество товаров имеет лимит */
                            if (productLimit > 0) {
                                if (count > productLimit) {
                                    count = productLimit;
                                    /* алгоритм очереди - первые товары удаляем */
                                    if (field == "items") {
                                        for (var subID in cookie[field]) {
                                            if (subID != 0) {
                                                for (var i = 0; i < cookie[field][subID].length; i++) {
                                                    if (cookie[field][subID][i] != null) {
                                                        cookie[field][subID][i] = null;
                                                        delete cookie[field][subID][i];
                                                        break;
                                                    }
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                                /* добавляем раздел */
                                cookie["count"] = count;
                                cookie[field][subdivisionID] = [productID];
                            }
                        }
                    }
                }
                cookie = JSON.stringify(cookie);
                if (systemParameters.user.isAuth) {
                    /* для авторизованного пользователя - 30 дней */
                    $.cookie(cookieName, cookie, {
                        expires: 30,
                        path: "/"
                    });
                } else {
                    /* для остальных - сессия */
                    $.cookie(cookieName, cookie, {
                        expires: "",
                        path: "/"
                    });
                }
                return "Product added";
            }
        }
    }
    /*
    Удаление товара из кук
    message - сообщение, которое будет показано пользователю
    cookieName - название кук
    subdivisionID - ID раздела
    productID - ID товара
    */
function DeleteFromCookies(message, cookieName, subdivisionID, productID) {
        /* временный костыль - cookieName - viewed */
        /* cookieName = "viewed"; */
        var cookie = $.cookie(cookieName);
        /* удаляем товар если куки существуют */
        if (typeof cookie !== "undefined") {
            cookie = JSON.parse(cookie);
            if (typeof cookie === "object") {
                var count = 0; /* общее количество товаров */
                /* удаление товара */
                if (typeof subdivisionID !== "undefined" && typeof productID !== "undefined") {
                    for (var field in cookie) {
                        if (field == "count") {
                            count = cookie[field]; /* количество */
                            if (typeof count === "undefined") count = 1;
                            count--; /* уменьшаем количество товара на 1 */
                        }
                        if (field == "items") {
                            for (var subID in cookie[field]) {
                                if (subID == subdivisionID) {
                                    /* перебираем массив товаров */
                                    var c = cookie[field][subdivisionID].length;
                                    for (var i = 0; i < c; i++) {
                                        /* нашли товар и удалили */
                                        if (cookie[field][subdivisionID][i] == productID) {
                                            cookie["count"] = count;
                                            delete cookie[field][subdivisionID][i];
                                            /* считаем количество оставшися товаров */
                                            count = 0;
                                            for (var i = 0; i < cookie[field][subdivisionID].length; i++) {
                                                if (cookie[field][subdivisionID][i] != null) count++;
                                            }
                                            /* если удалены все товары - удаляем категорию */
                                            if (count == 0) {
                                                DeleteFromCookies("", cookieName, subdivisionID);
                                                /* костыль - не перезагружаем страницу на странице каталога и товара */
                                                if (window.location.href.indexOf("catalog") == -1 && window.location.href.indexOf("product") == -1) {
                                                    window.location.reload(true);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    /* удаление категории и всех товаров, которые находятся в ней */
                    if (typeof subdivisionID !== "undefined") {
                        for (var field in cookie) {
                            if (field == "items") {
                                for (var subID in cookie[field]) {
                                    if (subID == subdivisionID) {
                                        /* считаем количество товаров в категории */
                                        var c = cookie[field][subdivisionID].length;
                                        for (var i = 0; i < c; i++) {
                                            if (cookie[field][subdivisionID][i] != null) count++;
                                        }
                                        /* уменьшаем общее количество товаров */
                                        cookie["count"] -= count;
                                        if (cookie["count"] < 0) cookie["count"] = 0;
                                        /* удаляем всю категорию вместе с товарами */
                                        delete cookie[field][subdivisionID];
                                    }
                                }
                            }
                        }
                    } else {
                        /* удаление всех данных
                        и категории и товары */
                        if (typeof subdivisionID === "undefined" && typeof productID === "undefined") {
                            cookie.count = 0;
                            cookie.items = {};
                            /* редактируем данные в верстке */
                            switch (cookieName) {
                            case "favorites":
                                $(".header.fixed .wrap .favorites").removeClass("active");
                                $(".header.fixed .wrap .favorites a.title span .name .count").text("0");
                                $(".box .content").html(GetInfoMessageHtml(message));
                                break;
                            case "viewed":
                                $(".header.fixed .wrap .viewed").removeClass("active");
                                $(".header.fixed .wrap .viewed a.title span .name .count").text("0");
                                $(".box .content").html(GetInfoMessageHtml(message));
                                break;
                            case "compared":
                                $(".header.fixed .wrap .compare").removeClass("active");
                                $(".header.fixed .wrap .compare a.title span .name .count").text("0");
                                $(".box .content").html(GetInfoMessageHtml(message));
                                break;
                            }
                        }
                    }
                }
                cookie = JSON.stringify(cookie);
                if (systemParameters.user.isAuth) {
                    /* для авторизованного пользователя - 30 дней */
                    $.cookie(cookieName, cookie, {
                        expires: 30,
                        path: "/"
                    });
                } else {
                    /* для остальных - сессия */
                    $.cookie(cookieName, cookie, {
                        expires: "",
                        path: "/"
                    });
                }
            }
        }
    }
    /*
    / сохранение информации о товаре в Сравнение, Закладки, Просмотренные
    Вывод сообщения
    функция возвращает верстку html с текстом сообщения
    */
function GetInfoMessageHtml(text) {
    /* информационное сообщение синего цвета */
    return GetMessageHtml(text, "blue");
}

function GetErrorMessageHtml(text) {
    /* сообщение об ошибке красного цвета */
    return GetMessageHtml(text, "red");
}

function GetCommonMessageHtml(text) {
    /* информационное сообщение без рамок и без иконки черного цвета */
    return GetMessageHtml(text, "black no-border no-icon");
}

function GetCommonErrorMessageHtml(text) {
        /* сообщение об ошибке без рамок и без иконки красного цвета */
        return GetMessageHtml(text, "red no-border no-icon");
    }
    /*
    Параметры:
    text - текст сообщения
    className - название цвета, имя класса
    */
function GetMessageHtml(text, className) {
        return "<div class='info-message " + className + "'>" +
            "<span class='icon'>&nbsp;</span>" +
            "<p class='text'>" + text + "</p>" +
            "</div>";
    }
    /* / Вывод сообщения */
$(document).ready(function () {
    /* Счетчик количества товара */
    (function ($) {
        $.fn.productCounter = function () {
            var object = $(this);
            var maxProductCount; /* максимальное количество товара */
            maxProductCount = parseInt($(".residue span").text());
            if (isNaN(maxProductCount)) maxProductCount = 999;
            /* количество товара
            получаем значение из input */
            var productCount = parseInt(object.find("ul li input").val());
            if (isNaN(productCount)) {
                productCount = 1;
                object.find("ul li input").val(productCount);
            }
            /* кнопка уменьшения количества товара "-" */
            object.find("ul li.minus, ul li.item-minus").click(function () {
                var input = $(this).parent().find("li input");
                var value = parseInt(input.val());
                productCount = value - 1;
                if (isNaN(productCount) || productCount < 1) {
                    productCount = 1;
                    input.val(productCount);
                } else
                    input.val(productCount);
                return false;
            });
            /* кнопка увеличения количества товара "+" */
            object.find("ul li.plus, ul li.item-plus").click(function () {
                var input = $(this).parent().find("li input");
                var value = parseInt(input.val());
                productCount = value + 1;
                if (isNaN(productCount)) {
                    productCount = 0;
                    input.val(productCount);
                } else {
                    if (productCount > maxProductCount) productCount = maxProductCount;
                    input.val(productCount);
                }
                return false;
            });
            /* фокус на input */
            object.find("ul li input").focus(function () {
                var input = $(this);
                var value = parseInt(input.val());
                if (isNaN(value))
                    input.val(productCount);
                else
                    productCount = value;
            });
            /* изменение количества товара */
            object.find("ul li input").blur(function () {
                var input = $(this);
                var value = parseInt(input.val());
                if (isNaN(value) || value < 0)
                    input.val(productCount);
                else {
                    productCount = value;
                    if (productCount > maxProductCount)
                        productCount = maxProductCount;
                    input.val(productCount);
                }
            });
        }
    })(jQuery);
    /* фотослайдер */
    /* slideDuration - скорость смены слайдов */
    /* scrollDuration - скорость перемотки слайдов */
    (function ($) {
        $.fn.photoSlider = function (slideDuration, scrollDuration) {
            var object = $(this);
            var wrap = object.find(".wrap");
            var mainImage = object.find(".items");
            var mainImageCount = mainImage.find("li").length;
            var thumbnails = object.find(".thumbnails");
            var thumbnailsCount = thumbnails.find("li").length;
            var prevImage = object.find(".prev");
            var nextImage = object.find(".next");
            var prevArrow = object.find(".prev-arrow");
            var nextArrow = object.find(".next-arrow");
            var activeImageIndex = 0;
            var maxImageWidth = 500;
            var maxImageHeight = 380;
            var zoomImageHeight = mainImage.find("li a").height();
            var container = object.find(".container");
            var isSliding = false; /* перемещается ли в данный момент слайд */
            var timer, initTimer;
            var delivery = mainImage.find(".delivery");
            /* фотослайдер на странице товара */
            /* смена слайдов происходит без эффектов */
            if (wrap.length == 0) {
                /* загрузка картинок */
                mainImage.find("li a img").one("load", function () {
                    var li = $(this).parent().parent();
                    /* если картинка скрыта */
                    if (!li.hasClass("active")) {
                        li.addClass("active");
                        li.removeClass("active");
                    }
                    /* на странице пунктов выдачи плагин Zoom не подключается */
                    /* в этом случае инициализация не нужна */
                    if (document.location.href.indexOf("pickpoints") == -1) {
                        /* инициализация плагина увеличения картинок */
                        /* только если плагин подключен */
                        var sourceImg = li.find("img:not(.zoomImg)");
                        if (sourceImg.attr("src") == "/images/cosmo/no_photo.png") {
                            /* если фотографии товара нет - ссылка не кликабельна */
                            li.find("a.zoom").css({
                                "cursor": "default"
                            });
                            li.find("a.zoom .lens").css({
                                "display": "none"
                            });
                            /* li.find("a.zoom .lens").css( { "backgroundPosition" : "0 -79px" } ); */
                        } else {
                            /* инициализируем плагин */
                            li.find("a.zoom").zoom({
                                on: "mouseover",
                                touch: true,
                                duration: 250,
                                onZoomIn: function () { /* скрываем исходную картинку при увеличении */
                                    sourceImg.css({
                                        "display": "none"
                                    });
                                },
                                onZoomOut: function () {
                                    sourceImg.css({
                                        "display": "inline-block"
                                    });
                                }
                            });
                        }
                    }
                }).each(function () /* фикс кеширования картинок */ {
                    if (this.complete) $(this).load();
                });
                /* увеличение главной картинки */
                mainImage.find("li a.zoom").click(function (event) {
                    event.preventDefault();
                });
                /* скрипт работает только в том случае, если количество главных картинок и миниатюр совпадает */
                if (mainImageCount != thumbnailsCount) return false;
                /* выбор картинки миниатюры */
                thumbnails.find("li").click(function () {
                    hideImages();
                    activeImageIndex = $(this).index();
                    showImages();
                    return false;
                });
                /* предыдущая картинка */
                prevImage.hover(function () {
                    prevArrow.addClass("hover");
                }, function () {
                    prevArrow.removeClass("hover");
                });
                prevImage.click(function () {
                    hideImages();
                    activeImageIndex--;
                    if (activeImageIndex < 0)
                        activeImageIndex = mainImageCount - 1;
                    showImages();
                    return false;
                });
                prevArrow.click(function () {
                    hideImages();
                    activeImageIndex--;
                    if (activeImageIndex < 0)
                        activeImageIndex = mainImageCount - 1;
                    showImages();
                    return false;
                });
                /* следующая картинка */
                nextImage.hover(function () {
                    nextArrow.addClass("hover");
                }, function () {
                    nextArrow.removeClass("hover");
                });
                nextImage.click(function () {
                    hideImages();
                    activeImageIndex++;
                    if (activeImageIndex >= mainImageCount)
                        activeImageIndex = 0;
                    showImages();
                    return false;
                });
                nextArrow.click(function () {
                    hideImages();
                    activeImageIndex++;
                    if (activeImageIndex >= mainImageCount)
                        activeImageIndex = 0;
                    showImages();
                    return false;
                });
                /* убираем выделение активных миниатюр и скрываем главную картинку */
                function hideImages() {
                        thumbnails.find("li div").removeClass("active");
                        mainImage.find("li").removeClass("active");
                    }
                    /* делаем выбранную миниатюру активной и отображаем главную картинку, которая соответствует выбранной миниатюре */
                function showImages() {
                    thumbnails.find("li").each(function (i) {
                        if (i == activeImageIndex) {
                            var div = $(this).find("div");
                            if (div.hasClass("hover")) div.removeClass("hover");
                            div.addClass("active");
                        }
                    });
                    mainImage.find("li").each(function (i) {
                        if (i == activeImageIndex) {
                            $(this).addClass("active");
                            /* костыль */
                            if ($(this).hasClass("video"))
                                delivery.hide();
                            else
                                delivery.show();
                        }
                    });
                }
            } else {
                /* Фотослайдер на главной странице */
                /* смена слайдов с эффектом скролл */
                mainImage = object.find(".wrap .items");
                mainImageCount = mainImage.find("li").length;
                thumbnails = object.find(".thumbnails");
                thumbnailsCount = thumbnails.find("li:not(.all)").length;
                var maxImageWidth = 0;
                var maxImageHeight = 0;
                /* скрипт работает только в том случае, если количество главных картинок и миниатюр совпадает */
                if (mainImageCount != thumbnailsCount)
                    return false;
                /* копируем первый слайд в конец списка */
                var slideFirst = $(mainImage.find("li")[0]).html();
                mainImage.append("<li>" + slideFirst + "</li>");
                /* копируем последний слайд в начало списка */
                var slideLast = $(mainImage.find("li")[mainImageCount - 1]).html();
                mainImage.prepend("<li>" + slideLast + "</li>");
                /* делаем активными первый слайд и первую миниатюру */
                $(mainImage.find("li")[1]).addClass("active");
                $(thumbnails.find("li")[0]).addClass("active");
                activeImageIndex = 0;
                /* Изменение размеров окна */
                $(window).resize(function () {
                    clearTimeout(initTimer);
                    initTimer = setTimeout(function () {
                        /* в адаптивной версии сайта ширина слайдера меняется */
                        if (object.find(".wrap").width() == 741 || object.find(".wrap").width() == 758) {
                            mainImage.find("li a img").each(function (index) {
                                if (index == 0) {
                                    /* обновляем значения переменных */
                                    maxImageWidth = $(this).width();
                                    maxImageHeight = $(this).height();
                                    activeImageIndex = 0;
                                    /* ровняем положение картинки */
                                    mainImage.css({
                                        "width": mainImageCount * maxImageWidth
                                    });
                                    mainImage.css({
                                        "left": maxImageWidth * (-1)
                                    });
                                    /* делаем активной главную картинку */
                                    mainImage.find("li").removeClass("active");
                                    $(mainImage.find("li")[activeImageIndex]).addClass("active");
                                    /* делаем активной миниатюру */
                                    thumbnails.find("li").removeClass("active");
                                    $(thumbnails.find("li:not(.all)")[activeImageIndex]).addClass("active");
                                }
                            });
                        }
                    }, 250);
                });
                /* получаем размеры главной картинки */
                var index = 0;
                mainImage.find("li a img").one("load", function () {
                    index++;
                    if (index == mainImageCount) {
                        maxImageWidth = $(this).width();
                        maxImageHeight = $(this).height();
                        /* вычисляем ширину блока с главными изображениями */
                        mainImage.css({
                            "width": mainImageCount * maxImageWidth
                        });
                        /* смещаем блок с картинками влево на maxImageWidth */
                        mainImage.css({
                            "left": maxImageWidth * (-1)
                        });
                        /* перемещение картинок по таймеру с задержкой duration */
                        timer = setInterval(function () {
                            /* перемещаем картинку, если в данный момент не происходит перемещение слайдов */
                            if (!isSliding) SlideTo(0); /* перемещение слайдов влево */
                        }, slideDuration);
                    }
                }).each(function () /* фикс кеширования картинок */ {
                    if (this.complete) $(this).load();
                });
                /* смена слайдов по клику на миниатюре */
                thumbnails.find("li:not(.all) a").click(function (event) {
                    var obj = $(this);
                    var li = obj.parent();
                    activeImageIndex = li.index();
                    /* делаем активной главную картинку */
                    mainImage.find("li").removeClass("active");
                    $(mainImage.find("li")[activeImageIndex]).addClass("active");
                    /* делаем активной миниатюру */
                    thumbnails.find("li").removeClass("active");
                    li.addClass("active");
                    /* перемещаем главную картинку в заданное положение */
                    MoveTo(activeImageIndex);
                    event.preventDefault();
                });
                /* предыдущая картинка */
                prevImage.click(function (event) {
                    /* плавное перемещение картинок */
                    /* перемещаем картинку, если в данный момент не происходит перемещение слайдов */
                    if (!isSliding) SlideTo(1);
                    event.preventDefault();
                });
                /* следующая картинка */
                nextImage.click(function (event) {
                    /* плавное перемещение картинок */
                    /* перемещаем картинку, если в данный момент не происходит перемещение слайдов */
                    if (!isSliding) SlideTo(0);
                    event.preventDefault();
                });
                /* наведение мыши на слайдер */
                object.mouseover(function (event) {
                    /* выключаем таймер смены картинок */
                    clearInterval(timer);
                });
                object.mouseleave(function (event) {
                    /* включаем таймер смены картинок */
                    timer = setInterval(function () {
                        /* перемещаем картинку, если в данный момент не происходит перемещение слайдов */
                        if (!isSliding) SlideTo(0); /* перемещение слайдов влево */
                    }, slideDuration);
                });
                /* Плавное перемещение слайдов на 1 шаг */
                /* direction = 0 - влево */
                /* direction = 1 - вправо */
                function SlideTo(direction) {
                        var mainImageLeft = parseInt(mainImage.css("left"));
                        if (isNaN(mainImageLeft)) mainImageLeft = 0;
                        if (direction == 0) {
                            mainImageLeft -= maxImageWidth;
                            isSliding = true;
                            mainImage.animate({
                                left: mainImageLeft
                            }, scrollDuration, function () {
                                activeImageIndex++;
                                if (activeImageIndex >= mainImageCount) activeImageIndex = 0;
                                /* делаем активной главную картинку */
                                mainImage.find("li").removeClass("active");
                                $(mainImage.find("li")[activeImageIndex]).addClass("active");
                                /* делаем активной миниатюру */
                                thumbnails.find("li").removeClass("active");
                                $(thumbnails.find("li:not(.all)")[activeImageIndex]).addClass("active");
                                if (mainImageLeft == (mainImageCount + 1) * maxImageWidth * (-1)) mainImage.css({
                                    "left": maxImageWidth * (-1)
                                });
                                isSliding = false;
                            });
                        }
                        if (direction == 1) {
                            mainImageLeft += maxImageWidth;
                            isSliding = true;
                            mainImage.animate({
                                left: mainImageLeft
                            }, scrollDuration, function () {
                                activeImageIndex--;
                                if (activeImageIndex < 0) activeImageIndex = mainImageCount - 1;
                                /* делаем активной главную картинку */
                                mainImage.find("li").removeClass("active");
                                $(mainImage.find("li")[activeImageIndex]).addClass("active");
                                /* делаем активной миниатюру */
                                thumbnails.find("li").removeClass("active");
                                $(thumbnails.find("li:not(.all)")[activeImageIndex]).addClass("active");
                                if (mainImageLeft == 0) mainImage.css({
                                    "left": mainImageCount * maxImageWidth * (-1)
                                });
                                isSliding = false;
                            });
                        }
                    }
                    /* Быстрое перемещение к заданной картинке */
                    /* index - номер слайда */
                    /* duration - скорость перемещения */
                function MoveTo(index, duration) {
                    mainImageLeft = (index + 1) * maxImageWidth * (-1);
                    /* перемещение слайдов без задержки */
                    if (typeof duration == "undefined" || duration == 0) {
                        mainImage.css({
                            "left": mainImageLeft
                        });
                    } else /* плавное перемещение */ {
                        isSliding = true;
                        mainImage.animate({
                            left: mainImageLeft
                        }, duration, function () {
                            /* делаем активной главную картинку */
                            mainImage.find("li").removeClass("active");
                            $(mainImage.find("li")[activeImageIndex]).addClass("active");
                            /* делаем активной миниатюру */
                            thumbnails.find("li").removeClass("active");
                            $(thumbnails.find("li:not(.all)")[activeImageIndex]).addClass("active");
                            isSliding = false;
                        });
                    }
                }
            }
        }
    })(jQuery);
    /* выпадающее меню "Каталог по категориям" */
    var showCatalogTimer;
    $(".menu-category_new").click(function () {
        var object = $(this);
        var menu = object.parent().find(".product-card-menu");
        if (menu.css("display") == "none")
            menu.css({
                "display": "block"
            });
        else
            menu.css({
                "display": "none"
            });
    });
    $(".product-card-menu").mouseover(function () {
        clearTimeout(showCatalogTimer);
    });
    $(".product-card-menu").mouseleave(function () {
        showCatalogTimer = setTimeout(function () {
            $(".product-card-menu").hide();
        }, 500);
    });
    /* / выпадающее меню "Каталог по категориям" */
    /* события и обработчики для всего списка товаров */
    /* пейджер */
    /* переключение вида */
    /* сортировка товаров */
    (function ($) {
        $.fn.productListManagement = function () {
            var object = $(this);
            var pages = object.find(".pages");
            var dropDownList = object.find(".drop-down-list");
            var dropDownListHeight = 0;
            var dropDownListMinHeight = 27;
            var dropDownListOpen = false;
            var viewModes = object.find(".view-modes a");
            var productList = object.parent().find(".product-list:not(.collective-buying)"); /* не обрабатываем список коллективной покупки */
            var productListWidth = parseInt(productList.width());
            var productItem = productList.find("li.item");
            var productItemWidth = parseInt(productItem.width());
            var select = object.find("select");
            /* переключение вида списка товаров */
            viewModes.click(function (event) {
                var object = $(this);
                viewModes.removeClass("active");
                /* object.addClass("active"); */
                /* вертикальный список */
                if (object.hasClass("vertical")) {
                    object.parent().parent().parent().find(".pager .view-modes .vertical").addClass("active");
                    $(".product-list").removeClass("horizontal");
                    $(".product-list").addClass("vertical");
                    $.cookie("os_catalog_view", 0, {
                        expires: '',
                        path: "/"
                    });
                } else {
                    if (object.hasClass("horizontal")) {
                        object.parent().parent().parent().find(".pager .view-modes .horizontal").addClass("active");
                        $(".product-list").removeClass("vertical");
                        $(".product-list").addClass("horizontal");
                        $.cookie("os_catalog_view", 1, {
                            expires: '',
                            path: "/"
                        });
                    }
                }
                event.preventDefault();
            });
            /* / переключение вида списка товаров */
            /* сортировка товаров */
            /* скрываем список товаров */
            dropDownListHeight = dropDownList.find(".options").height();
            dropDownList.find(".options").css({
                "height": dropDownListMinHeight + "px"
            });
            dropDownList.find(".options .icon, .options a.selected").click(function (event) {
                var object = $(this);
                var options = object.parent();
                if (!dropDownListOpen) {
                    /* открываем список */
                    options.animate({
                        height: dropDownListHeight
                    }, 500, function () {
                        dropDownListOpen = true;
                    });
                } else {
                    /* закрываем список */
                    options.animate({
                        height: dropDownListMinHeight
                    }, 500, function () {
                        dropDownListOpen = false;
                    });
                }
                event.preventDefault();
            });
            /* / сортировка товаров */
            /* обработка товаров в списке */
            productItem.on("mouseover", function () {
                $(this).addClass("hover");
                $(this).find(".button").addClass("pre-hover");
            });
            productItem.on("mouseout", function () {
                $(this).removeClass("hover");
                $(this).find(".button").removeClass("pre-hover");
            });
            /* кнопки */
            productItem.find(".button").on("mouseover", function () {
                $(this).addClass("hover");
            });
            productItem.find(".button").on("mouseout", function () {
                $(this).removeClass("hover");
            });
            /* / обработка товаров в списке */
            /* обработка select для страницы Групповых покупок */
            select.change(function () {
                var sid = parseInt($(this).find("option:selected").val());
                if (!isNaN(sid) && sid > 0) window.location.search = "?sid=" + sid;
            });
        }
    })(jQuery);
    /* / события и обработчики для всего списка товаров */
    /* переключение вкладок товара (О товаре / Отзывы / Вопрос / Ответ) */
    (function ($) {
        $.fn.tabsSwitch = function (number) {
            if (typeof number === "undefined") number = 0;
            var object = $(this);
            var titles = object.children(".titles").children("a");
            var pages = object.children(".pages").children(".page");
            pages.hide(); /* скрываем все страницы */
            pages.each(function (pageIndex) {
                if (pageIndex == number) /* отображаем первую */ {
                    $(this).show();
                    return true;
                }
            });
            titles.click(function (event) {
                if (!$(this).hasClass("active")) {
                    titles.removeClass("active");
                    $(this).addClass("active");
                    pages.hide();
                    var tabIndex = $(this).index();
                    pages.each(function (pageIndex) {
                        if (tabIndex == pageIndex) $(this).show();
                    });
                }
                event.preventDefault();
            });
        }
    })(jQuery);
    /* / переключение вкладок товара (О товаре / Отзывы / Вопрос / Ответ) */
    /* открыть заданную вкладку по index 0...N */
    (function ($) {
        $.fn.tabsShow = function (Index) {
            var object = $(this);
            var titles = object.find(".titles a");
            var pages = object.find(".pages .page");
            titles.each(function (index) {
                if (index == Index) $(this).addClass("active");
                else $(this).removeClass("active");
            });
            pages.each(function (index) {
                if (index == Index) $(this).show();
                else $(this).hide();
            });
        }
    })(jQuery);
    /* / открыть заданную вкладку по index 0...N */
    /* переключение вкладок в виде аккордиона */
    /* number */
    (function ($) {
        $.fn.tabsAccordionSwitch = function (number) {
            var object = $(this);
            if (typeof number === "undefined") number = 0;
            var pages = object.find(".page");
            var titles = pages.children("a.title");
            var contents = pages.children(".content");
            if (pages.length) {
                pages.each(function (index) {
                    var title = $(this).children("a.title");
                    var content = $(this).children(".content");
                    if (index == number) {
                        title.addClass("active");
                        content.show();
                    }
                });
            }
            /* инициализация вкладок на широком экране */
            if (systemParameters.mobileDevice.isPC) {
                if (pages.length) {
                    var tabWidth = Math.ceil(100 / pages.length);
                    /* позиционирование заголовков вкладок */
                    pages.each(function (index) {
                        var title = $(this).children("a.title");
                        title.css({
                            "left": (tabWidth * index) + "%"
                        });
                        title.css({
                            "width": tabWidth + "%"
                        });
                    });
                    $(pages[pages.length - 1]).find("a.title").css({
                        "left": "auto"
                    });
                    $(pages[pages.length - 1]).find("a.title").css({
                        "right": "0px"
                    });
                    /* переключение вкладок */
                    titles.on("click", function (event) {
                        /* закрываем все вкладки */
                        titles.removeClass("active");
                        contents.hide();
                        /* открываем выбранную вкладку */
                        $(this).addClass("active");
                        $(this).parent().children(".content").show();
                        event.preventDefault();
                    });
                }
            } else {
                /* инициализация вкладок на экране телефона */
                if (systemParameters.mobileDevice.isCellPhone) {
                    /* переключение вкладок */
                    titles.on("click", function (event) {
                        if (!$(this).hasClass("active")) {
                            /* закрываем все вкладки */
                            titles.removeClass("active");
                            contents.hide();
                            /* открываем выбранную вкладку */
                            $(this).addClass("active");
                        } else {
                            /* закрываем выбранную вкладку */
                            $(this).removeClass("active");
                        }
                        $(this).parent().children(".content").slideToggle(500);
                        event.preventDefault();
                    });
                }
            }
        }
    })(jQuery);
    /* / переключение вкладок в виде аккордиона */
    /* показать все отзывы или все ответы */
    (function ($) {
        $.fn.showMore = function (delay) {
            var object = $(this);
            var title = object.find("a.more");
            var titleBorder = object.find("a.more .border");
            var content = object.find(".content");
            var contentHeight = 0;
            var contentBorder = object.find(".content .border");
            /* скорость анимации списка */
            var duration = delay;
            /* получаем высоту списка */
            contentHeight = content.height();
            /* если контент расположен ниже, чем ссылка "Показать" */
            if (content.hasClass("bottom")) {
                /* скрываем список */
                content.css({
                    "height": "0px"
                });
            }
            /* показать / скрыть контент */
            title.click(function () {
                var icon = $(this).find("span.arrow");
                /* если контент расположен выше, чем ссылка "Показать" */
                if (content.hasClass("top")) {
                    /* тут можно написать код вызова для Ajax обработчика
                    который вернет данные в переменную htmlContent */
                    var htmlContent = '<div class="review"><div class="name"><b>Константин Константинопольский</b></div><div class="rating"><span class="active">&nbsp;</span><span class="active">&nbsp;</span><span class="active">&nbsp;</span><span class="active">&nbsp;</span><span>&nbsp;</span></div><div class="description"><div class="parameter"><div class="type">Достоинства:</div><div class="amount">Очень удобное меню, красивый дизайн</div><div class="clear">&nbsp;</div></div><div class="parameter"><div class="type">Недостатки:</div><div class="amount">Пару раз подгорели овощи</div><div class="clear">&nbsp;</div></div><div class="parameter"><div class="type">Комментарий:</div><div class="amount">Положительный отзыв о качественном товаре. За словесными горами далеко-далеко в стране гласных и согласных живут рыбные тексты. Вдали от всех живут они в буквенных домах на берегу большого языкового океана. В стране гласных и согласных живут.</div><div class="clear">&nbsp;</div></div></div><div class="vote"><span>Полезный отзыв?</span><a href="#">Да</a><span>(5)</span><span>|</span><a href="#">Нет</a><span>(0)</span></div></div>';
                    /* добавляем новый контент */
                    content.append(htmlContent);
                    /* после того, как новый контент добавлен */
                    /* плавно показываем вновь добавленный контент */
                    var tempHeight = contentHeight;
                    contentHeight = content.height();
                    content.css({
                        "height": tempHeight
                    });
                    content.animate({
                        height: contentHeight
                    }, duration, function () {
                        content.css({
                            "height": "auto"
                        });
                    });
                }
                /* если контент расположен ниже, чем ссылка "Показать" */
                if (content.hasClass("bottom")) {
                    if (content.height() == 0) {
                        content.animate({
                            height: contentHeight
                        }, duration);
                        icon.addClass("close");
                        titleBorder.hide();
                        contentBorder.show();
                    } else {
                        content.animate({
                            height: "0px"
                        }, duration);
                        icon.removeClass("close");
                    }
                }
                return false;
            });
            /* если контент расположен ниже, чем ссылка "Показать" */
            if (content.hasClass("bottom")) {
                title.hover(function () {
                    if (content.height() == 0) titleBorder.show();
                }, function () {
                    titleBorder.hide();
                });
            }
        }
    })(jQuery);
    /* / показать все отзывы или все ответы */
    /* перемещение правого блока страницы товара при прокрутке страницы */
    (function ($) {
        $.fn.customScroll = function () {
            var object = $(this);
            var height = 0;
            var images = object.find("img");
            var imagesCount = images.length;
            var imagesCounter = 0;
            var cartProductTopOffset = $(".card-product .card-product-details").offset();
            cartProductTopOffset = cartProductTopOffset.top - 50;
            /* если в правой части есть картинки - то инициализируем скролл только после загрузки всех изображений */
            if (imagesCount > 0) {
                /* обработчик загрузки картинок */
                images.one("load", function () {
                    imagesCounter++;
                    /* инициализируем скролл только после загрузки всех картинок */
                    if (imagesCounter == imagesCount) {
                        $(window).scroll(function () {
                            height = object.height(); /* высота всего правого блока */
                            var heightLeftBlock = object.parent().height(); /* find(".card-product-image") */
                            var top = $(document).scrollTop() - cartProductTopOffset;
                            if (top > 0) {
                                object.addClass("absolute");
                                /* перемещение */
                                if (top < (heightLeftBlock - height))
                                    object.css({
                                        "top": top
                                    });
                                else
                                    object.css({
                                        "top": (heightLeftBlock - height)
                                    });
                            } else {
                                object.removeClass("absolute");
                                object.css({
                                    "top": "auto"
                                });
                            }
                        });
                    }
                }).each(function () {
                    if (this.complete) $(this).load();
                });
            } else {
                /* инициализируем скролл сразу же */
                $(window).scroll(function () {
                    height = object.height(); /* высота всего правого блока */
                    var heightLeftBlock = object.parent().height(); /* find(".card-product-image") */
                    var top = $(document).scrollTop() - cartProductTopOffset;
                    if (top > 0) {
                        object.addClass("absolute");
                        /* перемещение */
                        if (top < (heightLeftBlock - height))
                            object.css({
                                "top": top
                            });
                        else
                            object.css({
                                "top": (heightLeftBlock - height)
                            });
                    } else {
                        object.removeClass("absolute");
                        object.css({
                            "top": "auto"
                        });
                    }
                });
            }
        }
    })(jQuery);
    /* / перемещение правого блока страницы товара при прокрутке страницы */
    /* перемещение карты при прокрутке страницы */
    (function ($) {
        $.fn.customMapScroll = function () {
            var object = $(this);
            var height = object.height(); /* высота карты */
            var pickpoints = object.parent();
            var mapTopOffset = object.offset();
            if (typeof mapTopOffset !== "undefined") mapTopOffset = mapTopOffset.top - 50;
            else mapTopOffset = 0;
            $(window).scroll(function () {
                var top = $(document).scrollTop() - mapTopOffset;
                pickpointsHeight = pickpoints.height();
                if (top > 0) {
                    if (top < (pickpointsHeight - height))
                        object.css({
                            "top": top
                        });
                    else
                        object.css({
                            "top": pickpointsHeight - height - 2
                        });
                } else {
                    object.css({
                        "top": "auto"
                    });
                }
            });
        }
    })(jQuery);
    /* / перемещение карты при прокрутке страницы */
    /* карусель товаров */
    (function ($) {
        $.fn.productCarousel = function (duration) {
            var object = $(this);
            var ulItems = object.find("ul.items");
            var item = object.find(".items-block ul.items .item");
            var isMoving = false;
            var initTimer;
            if (item.length) /* функция работает если есть хотябы один товар */ {
                var animationDuration = duration; /* задержка анимации */
                var wrapWidth = object.find(".items-block").width(); /* вычисляем ширину обертки */
                var blockWidth = item.width() + 1; /* вычисляем ширину одного блока + 1 пиксель правый бордер */
                var productsPerBlock = Math.round(wrapWidth / blockWidth); /* количество товаров в блоке */
                if (isNaN(productsPerBlock) || productsPerBlock === -Infinity) productsPerBlock = 0;
                var productsTotalCount = item.length; /* общее количество товаров */
                /* дальнейшая работа скрипта возможна только в том случае,
                если общее количество товаров превышает количество товаров в блоке */
                if (productsTotalCount > productsPerBlock && productsPerBlock > 0) {
                    /* вычисляем общее количество блоков */
                    var blocksTotalCount = Math.ceil(productsTotalCount / productsPerBlock);
                    if (isNaN(blocksTotalCount)) blocksTotalCount = 1;
                    /* количество товаров может быть не кратно числу товаров в одном блоке
                    вычисляем количество недостающих товаров */
                    var need = (blocksTotalCount * productsPerBlock) - productsTotalCount;
                    if (productsTotalCount >= productsPerBlock) {
                        /* выбираем первые need товаров и добавляем их в конец списка */
                        item.each(function (index) {
                            if (index < need) {
                                object.find(".items-block ul.items").append("<li class='item'>" + $(this).html() + "</li>");
                            }
                        });
                    } else {
                        if (productsTotalCount == 1) {
                            var tries = 0;
                            for (var i = 0; i < need && tries < need; i++) {
                                while (typeof item[i] == "undefined") {
                                    i--;
                                    tries++;
                                }
                                object.find(".items-block ul.items").prepend("<li class='item'>" + $(item[i]).html() + "</li>");
                            }
                        }
                    }
                    /* на этом этапе мы получили количество товаров, кратное числу товаров в одном блоке */
                    /* выбираем первые productsPerBlock товаров и добавляем их в конец списка */
                    var tries = 0;
                    for (var i = 0; i < productsPerBlock && tries < productsPerBlock; i++) {
                        while (typeof item[i] == "undefined") {
                            i = 0;
                            tries++;
                        }
                        object.find(".items-block ul.items").append("<li class='item'>" + $(item[i]).html() + "</li>");
                    }
                    /* добавляем в начало списка недостающие до кратного количества товары
                    выбираем первые need товаров и добавляем их в начало списка */
                    var tries = 0;
                    for (var i = need - 1; i >= 0 && tries < need; i--) {
                        while (typeof item[i] == "undefined") {
                            i--;
                            tries++;
                        }
                        object.find(".items-block ul.items").prepend("<li class='item'>" + $(item[i]).html() + "</li>");
                    }
                    /* выбираем последние productsPerBlock товаров и добавляем их в начало списка */
                    var start = (productsTotalCount + need) - productsPerBlock;
                    var tries = 0;
                    for (var i = productsTotalCount - 1; i >= start && tries < productsTotalCount; i--) {
                        while (typeof item[i] == "undefined") {
                            i--;
                            tries++;
                        }
                        object.find(".items-block ul.items").prepend("<li class='item'>" + $(item[i]).html() + "</li>");
                    }
                    /* устанавливаем ширину блока со списком товаров */
                    var itemsBlockWidth = (productsTotalCount + need + productsPerBlock * 2) * blockWidth;
                    object.find(".items-block ul.items").width(itemsBlockWidth);
                    /* перематываем блок со списком товаров влево на ширину одного блока */
                    object.find(".items-block ul.items").css({
                        "left": -(productsPerBlock * blockWidth)
                    });
                    /* обработчики событий */
                    /* перемотка вправо на productsPerBlock */
                    object.find("a.right-nav").click(function () {
                        if (!isMoving) {
                            isMoving = true;
                            var itemsBlock = $(this).parent().find("ul.items");
                            $(this).parent().find("ul.items").animate({
                                left: "-=" + (productsPerBlock * blockWidth)
                            }, animationDuration, function () {
                                /* смещаем блок со списком товаров вправо
                                величина смещения = ширине всего блока * ширину блока */
                                if (ulItems.css("left") == -(itemsBlockWidth - productsPerBlock * blockWidth) + "px")
                                    itemsBlock.css({
                                        "left": -(productsPerBlock * blockWidth)
                                    });
                                isMoving = false;
                            });
                        }
                        return false;
                    });
                    /* перемотка влево на productsPerBlock */
                    object.find("a.left-nav").click(function () {
                        if (!isMoving) {
                            isMoving = true;
                            var itemsBlock = $(this).parent().find("ul.items");
                            $(this).parent().find("ul.items").animate({
                                left: "+=" + (productsPerBlock * blockWidth)
                            }, animationDuration, function () {
                                /* смещаем блок со списком товаров влево
                                величина смещения = ширине всего блока - ширине блока из productsPerBlock товаров * 2 */
                                if (ulItems.css("left") == "0px")
                                    itemsBlock.css({
                                        "left": -(itemsBlockWidth - (productsPerBlock * 2) * blockWidth)
                                    });
                                isMoving = false;
                            });
                        }
                        return false;
                    });
                    /* Изменение размеров окна */
                    $(window).resize(function () {
                        clearTimeout(initTimer);
                        initTimer = setTimeout(function () {
                            /* в адаптивной версии сайта ширина блока с товарами меняется */
                            wrapWidth = object.find(".items-block").width();
                            blockWidth = item.width() + 1;
                            productsPerBlock = Math.round(wrapWidth / blockWidth);
                            object.find(".items-block ul.items").css({
                                "left": -(productsPerBlock * blockWidth)
                            });
                        }, 250);
                    });
                } else /* количество товаров не превышает ширину области прокрутки */ {
                    /* скрываем ссылки, перемещающие товары */
                    object.find("a.right-nav").hide();
                    object.find("a.left-nav").hide();
                    /* перемещаем блок с товарами влево */
                    object.find(".items-block").css({
                        "left": "0px"
                    });
                    object.find(".items-block").css({
                        "width": (productsTotalCount * blockWidth)
                    });
                    /* object.find("ul.items").css( { "right" : "0px" } ); */
                }
                /* обработчики событий */
                item.on("mouseover", function () {
                    $(this).addClass("hover");
                    $(this).find(".button").addClass("pre-hover");
                });
                item.on("mouseout", function () {
                    $(this).removeClass("hover");
                    $(this).find(".button").removeClass("pre-hover");
                });
                /* кнопки */
                item.find(".button").on("mouseover", function () {
                    $(this).addClass("hover");
                });
                item.find(".button").on("mouseout", function () {
                    $(this).removeClass("hover");
                });
                /* / обработчики событий */
            }
        }
    })(jQuery);
    /* / карусель товаров */
    /* Обновление данных корзины */
    function UpdateCartTotals(price, count, operation) {
            var updatedTotalPrice = $(".header.fixed .wrap .basket a.title span span.name span.price").text();
            if (isNaN(updatedTotalPrice) || updatedTotalPrice == "") updatedTotalPrice = 0;
            if (operation == "plus") updatedTotalPrice = parseInt(updatedTotalPrice) + price * count;
            if (operation == "minus") updatedTotalPrice = parseInt(updatedTotalPrice) - price * count;
            var updatedTotalCount = $(".header.fixed .wrap .basket a.title span span.name span.count").text();
            updatedTotalCount = parseInt(updatedTotalCount);
            if (isNaN(updatedTotalCount) || updatedTotalCount == "") updatedTotalCount = 0;
            if (operation == "plus") updatedTotalCount = updatedTotalCount + count;
            if (operation == "minus") updatedTotalCount = updatedTotalCount - count;
            var isDeliveryFree = false;
            if (updatedTotalPrice > 0 && updatedTotalCount > 0) {
                /* проверяем есть ли в корзине товары с бесплатной доставкой */
                $(".header.fixed .wrap .basket .message ul.items li").each(function () {
                    if ($(this).hasClass("free_delivery")) isDeliveryFree = true;
                });
                /* стоимость доставки по условиям диапазонов для города */
                /* -2	- доставка невозможна */
                /* -1	- доставка будет бесплатной при достижении суммы заказа */
                /* == 0	- доставка бесплатна */
                /* > 0	- доставка платная */
                var cityDeliveryRulesPrice = -2;
                var cityDeliveryRulesNeedToPay = 0; /* сумма, которую необходимо доплатить для достижения условий диапазона */
                var temp = CalculateCityDeliveryRules(updatedTotalPrice);
                cityDeliveryRulesPrice = temp[0];
                cityDeliveryRulesNeedToPay = temp[1];
                /* добавляем сообщение, если доставка товара бесплатна */
                if (isDeliveryFree == true || cityDeliveryRulesPrice == 0) {
                    $(".header.fixed .wrap .basket a.title span span.name").html('<span class="price">' + updatedTotalPrice + '</span> р. (<span class="count">' + updatedTotalCount + '</span> шт.)');
                    if ($(".header.fixed .wrap .basket a.title span span.delivery").attr("class") != "delivery") {
                        $(".header.fixed .wrap .basket a.title span:not(.name, .name .price, .name .count, .icon)").append("<span class='delivery'>Бесплатная доставка</span>");
                        /* иконка корзины становится зеленой */
                        $(".header.fixed .wrap .basket a.title span span.icon").addClass("free");
                    }
                } else {
                    $(".header.fixed .wrap .basket a.title span span.name").html('В корзине <span class="count">' + updatedTotalCount + '</span> товаров на сумму <span class="price">' + updatedTotalPrice + '</span> р.');
                    $(".header.fixed .wrap .basket a.title span span.delivery").remove();
                    $(".header.fixed .wrap .basket a.title span span.icon").removeClass("free");
                }
                if ((cityDeliveryRulesPrice == -1 || cityDeliveryRulesPrice > 0) && cityDeliveryRulesNeedToPay > 0) {
                    var message = 'Добавьте товаров еще на <b>' + cityDeliveryRulesNeedToPay + ' р</b> ';
                    if (cityDeliveryRulesPrice == -1) message += 'и ваш заказ мы доставим бесплатно.';
                    else {
                        if (cityDeliveryRulesPrice > 0) message += 'и мы доставим заказ всего за ' + cityDeliveryRulesPrice + 'р.';
                    }
                    $(".header.fixed .wrap .basket .message .total .info-message .text").html(message);
                    $(".header.fixed .wrap .basket .message .total .info-message").show();
                } else
                    $(".header.fixed .wrap .basket .message .total .info-message").hide();
                if (updatedTotalPrice >= 500) {
                    $(".header.fixed .wrap .basket .message .total span.text").remove();
                    $(".header.fixed .wrap .basket .message .total a.button").remove();
                    var totalContent = $(".header.fixed .wrap .basket .message .total").html();
                    totalContent += '<a class="button green" href="/personal/buy/order.php" title="Перейти в корзину для оформления заказа">Оформить заказ</a>';
                    $(".header.fixed .wrap .basket .message .total").html(totalContent);
                    /* переход в корзину работает только при сумме заказа больше 500 рублей */
                    $(".header.fixed .wrap .basket").removeClass("not-available");
                } else {
                    $(".header.fixed .wrap .basket .message .total span.text").remove();
                    $(".header.fixed .wrap .basket .message .total a.button").remove();
                    var totalContent = $(".header.fixed .wrap .basket .message .total").html();
                    totalContent += '<span class="text">Сумма заказа должна быть более 500 р.</span>';
                    $(".header.fixed .wrap .basket .message .total").html(totalContent);
                    $(".header.fixed .wrap .basket").addClass("not-available");
                }
            } else {
                $(".header.fixed .wrap .basket a.title").remove();
                $(".header.fixed .wrap .basket a.order").remove();
                $(".header.fixed .wrap .basket .message").remove();
                $(".header.fixed .wrap .basket .message.product-preview").remove();
                var basketEmpty = '<a class="title" href="#" onclick="return false;">';
                basketEmpty += '<span>';
                basketEmpty += '<span class="name">Корзина пустая</span>';
                basketEmpty += '<span class="icon">&nbsp;</span>';
                basketEmpty += '</span>';
                basketEmpty += '<div class="border">&nbsp;</div>';
                basketEmpty += '</a>';
                $(".header.fixed .wrap .basket").append(basketEmpty);
            }
        }
        /* Удаление товара из Корзины */
    $(".header.fixed .wrap .basket").on("click", ".message ul.items li.item a.delete", function () {
        var object = $(this);
        var productId = object.parent().find(".parameters .counter input").attr("name");
        productId = productId.split("_");
        productId = parseInt(productId[1]);
        var productPrice = parseInt(object.parent().find(".parameters .price").text());
        var productCount = parseInt(object.parent().find(".parameters .counter input").val());
        var ulItems = $(".header.fixed .wrap .basket").find(".message ul.items");
        var isDeliveryFree = false;
        /* обновляем данные в корзине */
        UpdateCartTotals(productPrice, productCount, "minus");
        /* Если цена и количество товара в козине превышает макс ширину - уменьшаем шрифт блока Бесплатная доставка */
        var spanNameWidth = parseInt($(".header.fixed .wrap .basket a.title span span.name").width());
        if (isNaN(spanNameWidth)) spanNameWidth = 0;
        var spanDelivery = $(".header.fixed .wrap .basket a.title span span.delivery");
        if (spanNameWidth > 95) spanDelivery.css({
            "font-size": "10px"
        });
        else spanDelivery.css({
            "font-size": "12px"
        });
        /* Удаляем блок товара */
        object.parent().remove();
        /* проверяем наличие бесплатной доставки у товаров */
        $(".header.fixed .wrap .basket .message ul.items li.item").each(function () {
            if ($(this).hasClass("free_delivery")) isDeliveryFree = true;
        });
        /* если товаров с бесплатной доставкой не осталось - удаляем текст и меняем цвет иконки */
        if (!isDeliveryFree) {
            $(".header.fixed .wrap .basket a.title span span.delivery").remove();
            $(".header.fixed .wrap .basket a.title span span.icon").removeClass("free");
        }
        /*  фикс ширины блоков */
        var lis = ulItems.find("li");
        if (lis.length <= 3) {
            lis.css({
                "width": "333px"
            });
            switch (lis.length) {
            case 1:
                ulItems.css({
                    "height": "96px"
                });
                break;
            case 2:
                ulItems.css({
                    "height": "193px"
                });
                break;
            case 3:
                ulItems.css({
                    "height": "290px"
                });
                break;
            }
            /* Если товаров не осталось - закрываем корзину */
            if (lis.length == 0) {
                $(".header.fixed .wrap .basket").removeClass("active");
                $(".header.fixed .wrap .basket .fixed-wrap").hide();
                ulItems.parent().hide();
            }
        }
        ulItems.customScrollbar("resize", true);
        /* Удаляем товар из кук */
        SaveProductToCookies(productId, 0, 0, productPrice, true);
        /* статистика и партнерки */
        $("body").append("<img src='//pixel.ritorno.ru/pixel?pid=4957&oid=" + productId + "&basket_action=del&sid=118' width='1' height='1' alt=''>");
        return false;
    });
    /* / Удаление товара из Корзины */
    /* Изменение количества товара в корзине */
    $(".header.fixed .wrap .basket").on("click", ".message ul.items li.item .parameters .counter a", function () {
        var object = $(this);
        var productId = object.parent().find("input").attr("name");
        productId = productId.split("_");
        productId = parseInt(productId[1]);
        var productPrice = object.parent().parent().find(".price").text();
        productPrice = parseInt(productPrice);
        var productCountInput = object.parent().find("input");
        var productCount = productCountInput.val();
        productCount = parseInt(productCount);
        if (isNaN(productCount)) productCount = 0;
        var productResidue = parseInt(object.parent().parent().parent().find("input[name='residue']").val());
        if (isNaN(productResidue)) productResidue = 0;
        var error = false;
        /* обновляем данные в корзине */
        if (object.hasClass("minus")) {
            productCount--;
            if (productCount > 0) {
                if (SaveProductToCookies(productId, -1, productResidue, productPrice, false) != false) {
                    productCountInput.val(productCount);
                    UpdateCartTotals(productPrice, 1, "minus");
                } else
                    error = true;
            } else {
                if (SaveProductToCookies(productId, 0, productResidue, productPrice, true) != false) {
                    productCountInput.val(0);
                    /* удаляем блок товара */
                    object.parent().parent().parent().remove();
                    var ulItems = $(".header.fixed .wrap .basket").find(".message ul.items");
                    /* фикс ширины блоков */
                    var lis = ulItems.find("li");
                    if (lis.length <= 3) {
                        lis.css({
                            "width": "333px"
                        });
                        switch (lis.length) {
                        case 1:
                            ulItems.css({
                                "height": "96px"
                            });
                            break;
                        case 2:
                            ulItems.css({
                                "height": "193px"
                            });
                            break;
                        case 3:
                            ulItems.css({
                                "height": "290px"
                            });
                            break;
                        }
                        /* Если товаров не осталось - закрываем корзину */
                        if (lis.length == 0) {
                            $(".header.fixed .wrap .basket").removeClass("active");
                            $(".header.fixed .wrap .basket .fixed-wrap").hide();
                            ulItems.parent().hide();
                        }
                    }
                    ulItems.customScrollbar("resize", true);
                    UpdateCartTotals(productPrice, 1, "minus");
                    /* статистика и партнерки */
                    $("body").append("<img src='//pixel.ritorno.ru/pixel?pid=4957&oid=" + productId + "&basket_action=del&sid=118' width='1' height='1' alt=''>");
                } else
                    error = true;
            }
        }
        if (object.hasClass("plus")) {
            if (SaveProductToCookies(productId, 1, productResidue, productPrice, false) != false) {
                productCount++;
                if(productCount > 999) productCount = 999;
                productCountInput.val(productCount);
                UpdateCartTotals(productPrice, 1, "plus");
            } else
                error = true;
        }
        if (error == true) {
            $(".header.fixed .wrap .basket").removeClass("active");
            $(".header.fixed .wrap .basket").find(".message").hide();
            /* временное уведомление */
            var tooltip = $(".header.fixed .wrap .basket .tooltip");
            tooltip.html("<span class='arrow'>&nbsp;</span>Превышено максимальное количество товара!");
            tooltip.show();
            /* скрываем сообщение об ошибке через три секунды */
            clearTimeout(hideBasketTimer);
            hideBasketTimer = setTimeout(function () {
                tooltip.hide();
            }, hideBasketTimerValue);
        }
        return false;
    });
    /* / Изменение количества товара в корзине */
    /* Описание категории на странице списка товаров */
    (function ($) {
        $.fn.showCategoryDescription = function (duration) {
            var object = $(this);
            var content = object.find(".content"); /* весь контент */
            var contentHeight = content.height();
            var contentPreview = content.children(".preview-text");
            var contentDetail = content.children(".detail-text");
            var showMore = object.find("a.show-more"); /* ссылка "показать всё" */
            var showMoreHtml = showMore.html();
            var showMoreTitle = showMore.prop("title");
            /* страница со списком товаров */
            if (contentPreview.length == 0 && contentDetail.length == 0) {
                if ((content.text().length > 400 && systemParameters.mobileDevice.isPC) || (content.text().length > 300 && systemParameters.mobileDevice.isTabletPC) || (content.text().length > 200 && systemParameters.mobileDevice.isCellPhone)) {
                    /* при клике по ссылке показываем или скрываем подробное описание */
                    showMore.click(function (event) {
                        /* показываем весь контент */
                        if (!content.hasClass("open")) {
                            content.addClass("open");
                            content.animate({
                                height: content.prop("scrollHeight")
                            }, duration, function () {
                                showMore.html("Свернуть<span class='icon close'>&nbsp;</span>");
                                showMore.prop("title", "Свернуть");
                            });
                        } else /* скрываем до короткого описания */ {
                            content.animate({
                                height: contentHeight
                            }, duration, function () {
                                showMore.html(showMoreHtml);
                                showMore.prop("title", showMoreTitle);
                                content.removeClass("open");
                            });
                        }
                        event.preventDefault();
                    });
                } else {
                    showMore.removeClass("button");
                    showMore.hide();
                }
            } else {
                /* страница Бренда */
                showMore.click(function (event) {
                    contentDetail.slideToggle(duration, function () {
                        if (!contentDetail.hasClass("open")) {
                            contentDetail.addClass("open");
                            showMore.html("Свернуть<span class='icon close'>&nbsp;</span>");
                            showMore.prop("title", "Свернуть");
                        } else {
                            contentDetail.removeClass("open");
                            showMore.html(showMoreHtml);
                            showMore.prop("title", showMoreTitle);
                        }
                    });
                    event.preventDefault();
                });
            }
        }
    })(jQuery);
    /* / Описание категории на странице списка товаров */
    /* Главное меню сайта - пункты со стрелками */
    (function ($) {
        $.fn.mainMenuManagement = function (duration) {
            var object = $(this);
            var item = object.find(".item");
            var aTitle = item.find("a.title");
            var itemPhone = object.find(".item.phone");
            var itemPhoneTop = itemPhone.find(".top");
            var itemPhoneBottom = itemPhone.find(".bottom");
            var iconInformation = itemPhone.find(".bottom .icon");
            var itemCity = object.find(".item.city");
            var itemsAggregator = object.find(".items-aggregator");
            var cityQuestion = itemCity.find(".question");
            var cityQuestionButton = cityQuestion.find(".button");
            var tooltipIndex = 0;
            var zIndex = $(".header.catalog-search").css("z-index");
            var cityNameInputValue = "";
            var cityDataJSON;
            /* обработка списка городов и обычных пунктов меню */
            aTitle.click(function (event) {
                var obj = $(this);
                var parent = obj.parent();
                var content = parent.find(".content:not(.question)");
                var fixedWrap = parent.find(".fixed-wrap");
                var spanIcon = obj.find("span span.icon");
                if (content.css("display") == "none") {
                    /* список городов */
                    if (parent.hasClass("city")) {
                        if (content.html() == "" || content.html() == "&nbsp;") {
                            $.post("/ajax/city_list.php", {
                                "action": "get_cities",
                                "current_url": window.location.href
                            }, function (data) {
                                content.html(data);
                                fixedWrap.show();
                                content.show();
                                spanIcon.addClass("open");
                                parent.addClass("open");
                                parent.find(".content.question").hide();
                                /* получаем список городов */
                                cityDataJSON = itemCity.find(".content .city-data");
                                cityDataJSON = $.parseJSON(decodeURIComponent(cityDataJSON.html()));
                                var ul = content.find(".cities.other ul");
                                ul.customScrollbar({
                                    preventDefaultScroll: true
                                });
                                ul.on("customScroll", function (event, scrollData) {
                                    if (scrollData.scrollPercent == 0 || scrollData.scrollPercent >= 100) {
                                        $(this).mousewheel(function (event) {
                                            event.preventDefault();
                                        });
                                    }
                                });
                                /* костыль */
                                $(".header.catalog-search").css({
                                    "z-index": 1
                                });
                            });
                        } else {
                            fixedWrap.show();
                            content.show();
                            spanIcon.addClass("open");
                            parent.addClass("open");
                            parent.find(".content.question").hide();
                            /* костыль */
                            $(".header.catalog-search").css({
                                "z-index": 1
                            });
                        }
                    } else /* другие пункты меню */ {
                        fixedWrap.show();
                        content.show();
                        spanIcon.addClass("open");
                        parent.addClass("hover");
                        parent.find(".content.question").hide();
                        if (systemParameters.mobileDevice.isCellPhone) {
                            event.stopPropagation();
                        }
                    }
                } else {
                    /* список городов */
                    if (parent.hasClass("city")) {
                        fixedWrap.hide();
                        content.hide();
                        spanIcon.removeClass("open");
                        parent.removeClass("open");
                        /* костыль */
                        $(".header.catalog-search").css({
                            "z-index": zIndex
                        });
                    }
                    if (systemParameters.mobileDevice.isCellPhone) {
                        fixedWrap.hide();
                        content.hide();
                        spanIcon.removeClass("open");
                        parent.removeClass("hover");
                        event.stopPropagation();
                    }
                }
                /* переход по ссылке с нового пункта меню Распродажа */
                if (obj.hasClass("wholesale"))
                    return true;
                event.preventDefault();
            });
            /* обработка окна подтверждения выбора города */
            cityQuestionButton.click(function (event) {
                var obj = $(this);
                /* если пользователь отказался от предложенного города */
                if (obj.hasClass("no")) {
                    itemCity.find("a.title").click();
                    cityQuestion.hide();
                    event.preventDefault();
                }
            });
            iconInformation.click(function (event) {
                var obj = $(this);
                var message = obj.parent().find(".message");
                var fixedWrap = obj.parent().parent().find(".fixed-wrap");
                if (message.css("display") == "none") {
                    fixedWrap.show();
                    message.show();
                    obj.addClass("active");
                    /* скрываем подсказку через полминуты */
                    var timer = setTimeout(function () {
                        if (message.css("display") == "block") {
                            message.hide();
                            fixedWrap.hide();
                            obj.removeClass("active");
                        }
                    }, 30000);
                }
                event.preventDefault();
            });
            $(".header .column.right .menu .item.new.info .phone .icon").click(function (event) {
                var obj = $(this);
                var message = obj.find(".message");
                var fixedWrap = obj.find(".fixed-wrap");
                if (message.css("display") == "none") {
                    fixedWrap.show();
                    message.show();
                    obj.addClass("active");
                    /* скрываем подсказку через полминуты */
                    var timer = setTimeout(function () {
                        if (message.css("display") == "block") {
                            message.hide();
                            fixedWrap.hide();
                            obj.removeClass("active");
                        }
                    }, 30000);
                }
                event.preventDefault();
            });
            /* выбор города при вводе букв */
            itemCity.on("keyup", "form input[type='text']", function (event) {
                var tooltip = itemCity.find(".content .tooltip");
                /* ввод букв */
                if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
                    var value = $(this).val();
                    if (value.length >= 2) {
                        /* перебираем первые буквы */
                        if (typeof cityDataJSON === "object") {
                            var firstLetterExist = false;
                            for (var letter in cityDataJSON) {
                                /* сравниваем первую букву */
                                if (value[0].toLowerCase() == letter.toLowerCase()) {
                                    firstLetterExist = true;
                                    tooltip.find("ul").html("");
                                    /* поиск по названию города среди городов на букву N */
                                    var cityExist = false;
                                    for (var name in cityDataJSON[letter]) {
                                        /* заменяем символ + на пробел в URL кодированном названии города */
                                        cityDataJSON[letter][name] = cityDataJSON[letter][name].replace("+", " ");
                                        /* если первые буквы города совпадают с введенными символами */
                                        if (cityDataJSON[letter][name].substring(0, value.length).toLowerCase() == value.toLowerCase()) {
                                            cityExist = true;
                                            /* отображаем подсказки */
                                            tooltip.addClass("data");
                                            tooltip.find("ul").append("<li><a href='?city=" + name + "' title='" + cityDataJSON[letter][name] + "'>" + cityDataJSON[letter][name] + "</a></li>");
                                            itemCity.find("form").removeClass("error");
                                        }
                                    }
                                    if (!cityExist) {
                                        itemCity.find("form").addClass("error");
                                        tooltip.removeClass("data");
                                        tooltip.find("ul").html("<li><span class='error'>Данного города нет в базе магазина</span></li>");
                                    }
                                }
                            }
                            /* если после перебора всех букв ни одна не найдена */
                            if (!firstLetterExist) {
                                itemCity.find("form").addClass("error");
                                tooltip.removeClass("data");
                                tooltip.find("ul").html("<li><span class='error'>Данного города нет в базе магазина</span></li>");
                            }
                        }
                        /*
                        $.post(	"/ajax/citys.php", { "action" : "get_city_header", "str": value }, function(data, textStatus, jqXHR)
                        {
                        if(data != "")
                        {
                        tooltip.addClass("data");
                        tooltip.find("ul").html(data);
                        itemCity.find("form").removeClass("error");
                        }
                        else
                        {
                        itemCity.find("form").addClass("error");
                        tooltip.removeClass("data");
                        tooltip.find("ul").html("<li><span class='error'>Данного города нет в базе магазина</span></li>");
                        }
                        });
                        */
                    }
                } else /* выбор результатов поиска клавишами вверх/вниз */ {
                    switch (event.keyCode) {
                    case 38:
                        /* вверх */
                        tooltipIndex--;
                        break;
                    case 40:
                        /* вниз */
                        tooltipIndex++;
                        break;
                    }
                    if (tooltipIndex < 0)
                        tooltipIndex = 0;
                    else {
                        if (tooltipIndex > tooltip.find("a").length - 1)
                            tooltipIndex = tooltip.find("a").length - 1;
                    }
                    tooltip.find("ul li a").removeClass("hover");
                    tooltip.find("ul li a").each(function (index) {
                        if (index == tooltipIndex) {
                            $(this).addClass("hover");
                            /* клавиша Enter */
                            if (event.keyCode == 13) {
                                SubmitCity($(this).attr("href"));
                            }
                        }
                    });
                }
            });
            itemCity.on("submit", "form", function () {
                return false;
            });
            itemCity.on("mousedown", "form input[type='submit']", function (event) {
                var input = $(this).parent().find("input[type='text']");
                var value = input.val();
                var cityID;
                if (value.length >= 2) {
                    $.post("/ajax/citys.php", {
                        "action": "get_city_header",
                        "str": value
                    }, function (data, textStatus, jqXHR) {
                        if (data != "") {
                            /* получаем ID города */
                            var city = $($(data)[0]).find("a");
                            cityID = city.attr("href");
                            input.val(city.text());
                            SubmitCity(cityID);
                        }
                    });
                }
            });
            itemCity.on("mouseover", ".tooltip ul li a", function () {
                $(this).addClass("hover");
            });
            itemCity.on("mouseleave", ".tooltip ul li a", function () {
                $(this).removeClass("hover");
            });

            function SubmitCity(cityID) {
                if (typeof cityID !== "undefined") {
                    cityID = cityID.split("=");
                    if (typeof cityID[1] !== "undefined") {
                        cityID = parseInt(cityID[1]);
                        if (isNaN(cityID)) cityID = 0;
                        if (cityID != 0) {
                            var url = "";
                            if (document.location.search == "")
                                url = "?city=" + cityID;
                            else
                                url = document.location.href + "&city=" + cityID;
                            document.location.href = url;
                        }
                    }
                }
                return false;
            }
            if (systemParameters.mobileDevice.isCellPhone) {
                itemsAggregator.children("a.title").on("click", function (event) {
                    if (!itemsAggregator.hasClass("hover")) {
                        itemsAggregator.addClass("hover");
                    } else {
                        itemsAggregator.removeClass("hover");
                    }
                    event.preventDefault();
                    event.stopPropagation();
                });
                $("body").on("click", function () {
                    if (itemsAggregator.hasClass("hover")) {
                        itemsAggregator.removeClass("hover");
                    }
                });
            }
        }
    })(jQuery);
    /* / Главное меню сайта - пункты со стрелками */
    /* обработчики фиксированного футера */
    /* кнопка Наверх */
    (function ($) {
        $.fn.windowScrollToTop = function (duration) {
            var object = $(this);
            object.click(function (event) {
                var top = $(document).scrollTop();
                if (top > 0) $("html, body").animate({
                    scrollTop: 0
                }, duration);
                event.preventDefault();
            });
            $(window).scroll(function () {
                var top = $(document).scrollTop();
                if (top > 0) object.addClass("visible");
                else object.removeClass("visible");
            });
        }
    })(jQuery);
    /* / кнопка Наверх */
    /* меню выпадающее вверх */
    (function ($) {
        $.fn.popUpMenu = function (duration) {
            var object = $(this);
            var objectHeight = object.height();
            var title = object.find("a.title");
            var titleHeight = title.height();
            var message = object.find(".message");
            var messageHeight = message.height();
            var parent = object.parent();
            /* делаем меню не активным */
            if (object.hasClass("active")) object.removeClass("active");
            /* скрываем контент меню */
            /* message.css( { "height" : "0px" } ); */
            title.click(function (event) {
                /* закрываем меню */
                if (object.hasClass("active")) {
                    message.slideToggle(duration, function () {
                        object.removeClass("active");
                    });
                } else /* открываем меню */ {
                    /* закрываем активные (открытые) пункты меню */
                    parent.find(".item").each(function () {
                        var obj = $(this);
                        if (obj.hasClass("active") || obj.find(".message").css("display") == "block") {
                            obj.find(".message").slideToggle(duration, function () {
                                obj.removeClass("active");
                            });
                        }
                    });
                    /* закрываем LiveTex */
                    if ($(".lt-invite").hasClass("lt-active")) {
                        $(".lt-label").trigger("click");
                    }
                    message.slideToggle(duration, function () {
                        object.addClass("active");
                    });
                }
                event.preventDefault();
            });
        }
    })(jQuery);
    /* / меню выпадающее вверх */
    /* / обработчики фиксированного футера */
    /* Список пунктов выдачи - Забрать сегодня */
    (function ($) {
        $.fn.pickToday = function () {
            var object = $(this);
            var title = object.find(".title a");
            /*var titleBorder = object.find(".title a .border");*/
            var locationList = object.find(".locations");
            var locationHeight = 0;
            var locations = object.find(".locations ul li");
            /*var locationsBorder = object.find(".locations .border");*/
            var cardProductDesc = $(".card-product-desc");
            var cardProductDescHeight = cardProductDesc.height();
            var id = object.attr("id");
            var duration = 500; /* скорость анимации списка */
            /* получаем высоту списка магазинов */
            locationHeight = locationList.height();
            if (object.hasClass("open")) locationList.show();
            /* открытие / закрытие списка магазинов */
            title.click(function () {
                var icon = $(this).find("span.icon");
                /* если правый блок страницы товара "плавает" */
                if (cardProductDesc.hasClass("absolute")) {
                    /* поднимаем его выше */
                    var top = cardProductDesc.css("top");
                    top = parseInt(top.substring(0, top.length - 2));
                    top -= locationHeight;
                    cardProductDesc.animate({
                        top: top
                    }, duration);
                }
                /* если на странице имеются другие списки - закрываем их */
                var pickToday = $(".pick-today:not(#" + id + ")");
                if (pickToday.length > 1) {
                    pickToday.find(".locations").hide();
                    pickToday.find(".title a span.icon").removeClass("close");
                    pickToday.find(".locations ul li").removeClass("active");
                }
                /* открываем данный, текущий список */
                locationList.slideToggle(duration);
                if (icon.hasClass("close")) icon.removeClass("close");
                else icon.addClass("close");
                /*titleBorder.hide();*/
                /*locationsBorder.show();*/
                return false;
            });
            title.mouseover(function () {
                $(this).addClass("hover");
            });
            title.mouseleave(function () {
                $(this).removeClass("hover");
            });
            /* выбор магазина */
            locations.click(function () {
                locations.removeClass("active");
                $(this).addClass("active");
            });
        }
    })(jQuery);
    /* / Список пунктов выдачи - Забрать сегодня */
    /* Список пунктов выдачи - Забрать сегодня */
    (function ($) {
        $.fn.dropDown = function (duration) {
            var object = $(this);
            var title = object.children(".title").children("a");
            var icon = title.find("span.icon");
            var content = object.children(".content");
            var contentHeight = 0;
            contentHeight = content.height(); /* получаем высоту контента */
            if (contentHeight != null) {
                if (object.hasClass("open")) {
                    content.show();
                    icon.addClass("close");
                }
                /* открытие / закрытие списка магазинов */
                title.on("click", function (event) {
                    var ico = $(this).find("span.icon");
                    content.slideToggle(duration, function () {
                        if (ico.hasClass("close")) {
                            ico.removeClass("close");
                            object.removeClass("open");
                        } else {
                            ico.addClass("close");
                            object.addClass("open");
                        }
                    });
                    event.preventDefault();
                });
            } else {
                var options = object.find(".options");
                var optionCount = 0,
                    minOptionHeight = 1000,
                    maxOptionHeight = 0,
                    minHeight = 0,
                    maxHeight = 0;
                object.find("a:not(.icon)").each(function () {
                    var height = $(this).height() + 2;
                    optionCount++;
                    maxHeight += height;
                    if (height <= minOptionHeight) minOptionHeight = height;
                    if (height >= maxOptionHeight) maxOptionHeight = height;
                });
                /* минимальная и максимальная высота открытого списка */
                minHeight = minOptionHeight;
                /* если в списке больше одной опции */
                if (minHeight != maxHeight) {
                    /* закрываем список */
                    options.css({
                        "height": minHeight
                    });
                    options.find("a").click(function (event) {
                        if ($(this).hasClass("selected") || $(this).hasClass("icon")) {
                            if (options.height() == minHeight) options.animate({
                                height: maxHeight
                            }, duration); /* открываем список */
                            else options.animate({
                                height: minHeight
                            }, duration); /* закрываем список */
                        } else {
                            /* обрабатываем ссылку */
                            options.find("a.selected").text($(this).text());
                            options.find("a.selected").attr({
                                "id": $(this).attr("id")
                            });
                            /* закрываем список */
                            options.css({
                                "height": minHeight
                            });
                        }
                        event.preventDefault();
                    });
                } else /* в списке только одна опция */ {
                    options.find("a").removeClass("active");
                    options.find("a").addClass("selected");
                    options.find("a").css({
                        "cursor": "default"
                    });
                    options.find("a").click(function (event) {
                        event.preventDefault();
                    });
                    options.find(".icon").hide();
                }
            }
        }
    })(jQuery);
    /* / Список пунктов выдачи - Забрать сегодня */
    /* Реклама в шапке сайта */
    (function ($) {
        $.fn.showAdvertisement = function (duration) {
            var object = $(this);
            var title = object.find("a.title");
            var content = object.find(".content");
            var contentHeight = content.height();
            var isAnimating = false;
            var opened = $.cookie('shag_SITE_ADS'); /* видел ли пользователь уже рекламу */
            /* если страница открыта впервые - медленно раскрываем рекламу */
            if (typeof opened === "undefined" && !isAnimating) {
                isAnimating = true;
                content.height(0);
                object.removeClass("open");
                content.animate({
                    height: contentHeight
                }, duration * 3, function () {
                    object.addClass("open");
                    opened = true;
                    $.cookie('shag_SITE_ADS', opened, {
                        expires: 30,
                        path: "/"
                    });
                    isAnimating = false;
                });
            } else {
                /* при следующих открытиях страницы - проверяем открыт или закрыт баннер */
                opened = $.cookie('shag_SITE_ADS');
                if (opened === "true") opened = true;
                else if (opened === "false") opened = false;
                if (!opened) {
                    object.removeClass("open"); /* закрываем */
                }
            }
            title.click(function (event) {
                if (!isAnimating) {
                    isAnimating = true;
                    if (object.hasClass("open")) {
                        content.animate({
                            height: 0
                        }, duration, function () {
                            object.removeClass("open");
                            isAnimating = false;
                            $.cookie('shag_SITE_ADS', false, {
                                expires: 30,
                                path: "/"
                            });
                        });
                    } else {
                        content.animate({
                            height: contentHeight
                        }, duration, function () {
                            object.addClass("open");
                            isAnimating = false;
                            $.cookie('shag_SITE_ADS', true, {
                                expires: 30,
                                path: "/"
                            });
                        });
                    }
                }
                event.preventDefault();
            });
        }
    })(jQuery);
    /* / Реклама в шапке сайта */
    /* Обработчики личного кабинета */
    (function ($) {
        $.fn.personalAccount = function () {
            var object = $(this);
            if (object.length > 0) {
                var address = object.find(".address");
                var addressInputCount = object.find("input.adress-input").length;
                var addressAddButton = address.find(".item .input-wrap .button.address");
                var phoneInput = object.find("input[name='PERSONAL_PHONE']");
                var addressCount = 1; /* количество клонированных полей */
                var addressMaxCount = 5; /* ограничение */
                var addressInputLastID = $(object.find("input.adress-input")[addressInputCount - 1]).attr("name");
                var cityButton = object.find(".city .button.change");
                var iconMessage = object.find("span.icon");
                var formOrderCancel = object.find(".invoice .footer .total form");
                /* уменьшаем ограничение на количество уже добавленных адресов */
                addressMaxCount -= addressInputCount;
                /* получаем ID последнего -уже- добавленного инпута с адресом */
                if (typeof addressInputLastID === "undefined") addressInputLastID = 0;
                if (addressInputLastID != 0) {
                    addressInputLastID = addressInputLastID.split("_");
                    addressInputLastID = parseInt(addressInputLastID[addressInputLastID.length - 1]);
                    if (isNaN(addressInputLastID)) addressInputLastID = 0;
                }
                addressInputLastID++;
                /* маска для телефона */
                if (phoneInput.length > 0) {
                    phoneInput.mask("+7 (999) 999-99-99");
                }
                /* выделение поля с датой рождения */
                /*object.find("#PERSONAL_BIRTHDAY").addClass("focus");*/
                /* чекбоксы */
                object.on("change", "input[type='checkbox']", function () {
                    var object = $(this);
                    var icon = object.parent().find("span.icon");
                    /* var name = object.attr("name");
                    name = name.split("_"); /* 0 - название / 1 - id */
                    /*
                    var id = 0; */
                    /* обрабатываем значение аттрибута name */
                    /*
                    if(typeof name[1] !== "undefined")	id = parseInt(name[1]);
                    if(typeof name[0] !== "undefined")	name = name[0];
                    if(typeof id === "undefined")		id = 0;
                    if(typeof name === "undefined")		name = "";
                    */
                    if (object.prop("checked")) {
                        icon.addClass("active");
                        /* if(name != "")	$.cookie("shag_"+name+"_"+id, 1, {expires: 30, path: "/"} ); */
                    } else {
                        icon.removeClass("active");
                        /* if(name != "")	$.cookie("shag_"+name+"_"+id, 0, {expires: 30, path: "/"} ); */
                    }
                });
                object.on("click", "label span.icon", function (event) {
                    var icon = $(this);
                    icon.parent().find("input[type='checkbox']").click();
                    event.preventDefault();
                });
                /* / чекбоксы */
                /* поля адреса */
                addressAddButton.on("click", function (event) {
                    if (addressCount <= addressMaxCount) {
                        var object = $(this);
                        /* клонируем обертку и поле для ввода адреса вместе с кнопкой */
                        var inputWrap = object.parent().clone();
                        /* редактируем */
                        inputWrap.find(".button").remove(); /* удаляем кнопку */
                        inputWrap.find("input").val(""); /* удаляем данные из поля для ввода текста */
                        inputWrap.find("input").attr("name", "NEW_CITY_ADDRESS_" + addressInputLastID); /* изменяем значение атрибута name */
                        /* добавляем копию обертки */
                        object.parent().parent().append(inputWrap);
                        addressCount++;
                        addressInputLastID++;
                    }
                    event.preventDefault();
                });
                /* / поля адреса */
                /* выбор города */
                cityButton.on("click", function (event) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 500, function () {
                        $(".header .item.city a.title").click();
                    });
                    event.preventDefault();
                });
                /* / выбор города */
                /* подсказки */
                iconMessage.on("click", function (event) {
                    var object = $(this);
                    var message = object.find(".message");
                    var fixedWrap = object.find(".fixed-wrap");
                    var timer;
                    if (message.css("display") == "none") {
                        fixedWrap.show();
                        message.show();
                        object.addClass("active");
                        timer = setTimeout(function () {
                            fixedWrap.hide();
                            message.hide();
                            object.removeClass("active");
                        }, 30000);
                    }
                });
                /* / подсказки */
                /* Форма отмены заказа */
                formOrderCancel.each(function () {
                    var form = $(this);
                    var step1 = form.find(".step.one");
                    var step2 = form.find(".step.two");
                    var button = form.find(".button");
                    var select = form.find("select");
                    button.on("click", function (event) {
                        /* по клику переходим от одного шага к другому */
                        step1.hide();
                        step2.show();
                    });
                    select.change(function () {
                        /* отправляем данные после выбора причины отказа */
                        var value = $(this).val();
                        if (value != 0) form.submit();
                    });
                    form.submit(function () {
                        return true;
                    });
                });
                /* / Форма отмены заказа */
            }
        }
    })(jQuery);
    /* / Обработчики личного кабинета */
    /* Новый обработчик для валидации всех форм на сайте */
    (function ($) {
        /* Параметры: */
        /* useAjax - использовать(true) или нет(false) */
        /* url - адрес скрипта для Ajax запроса */
        /* ymTarget - код цели для Яндекс.Метрики */
        $.fn.FormValidation = function (useAjax, url, ymTarget) {
            var object = $(this);
            /* имя класса обязательных полей */
            var reqClassName = "required";
            /* виды обязательных полей */
            var reqSessionID; /* ID сессии */
            var reqRating; /* рейтинг - звездочки */
            var reqRatingInput;
            var reqRatingCurrent;
            var reqRatingMessage;
            var reqText; /* текст - input type text */
            var reqEmail; /* email */
            var reqDate; /* дата */
            var reqPhone; /* номер телефона */
            var reqInn; /* ИНН */
            var reqKpp; /* КПП */
            var reqCurAcc; /* Расчетный счет */
            var reqBik; /* БИК */
            var reqPassword; /* Пароль */
            var reqTextarea; /* Любое текстовое поле */
            var reqCheckbox; /* Checkbox */
            var reqSelect; /* Select */
            /* необязательные поля */
            var file; /* Файл */
            var fileSuccess = true;
            /* поиск обязательных полей */
            reqSessionID = $("input#sessid");
            reqRating = object.find(".rating span");
            reqRatingInput = object.find("input[name='rating']");
            reqRatingCurrent = 0;
            reqRatingMessage = object.find(".rate .error-message");
            reqText = object.find("input[type='text']." + reqClassName + ".text");
            reqTextarea = object.find("textarea." + reqClassName);
            reqEmail = object.find("input[type='text']." + reqClassName + ".email");
            reqPassword = object.find("input[type='password']." + reqClassName + ".text");
            reqPhone = object.find("input[type='text']." + reqClassName + ".phone");
            /* поиск необязательных полей */
            file = object.find("input[type='file']");
            /* обработчики рейтинга */
            if (reqRating.length > 0) {
                reqRating.hover(function () {
                    var Index = $(this).index();
                    reqRating.removeClass("active");
                    /* выделяем все предыдущие звездочки */
                    reqRating.each(function (index) {
                        if (index <= Index) $(this).addClass("active");
                    });
                }, function () {
                    reqRating.removeClass("active");
                    /* выделяем необходимое количество звезд, согласно выбранному рейтингу */
                    reqRating.each(function () {
                        if ($(this).index() < reqRatingCurrent) $(this).addClass("active");
                    });
                });
                reqRating.click(function (event) {
                    if (reqRatingInput.length > 0) {
                        reqRatingCurrent = $(this).index() + 1;
                        reqRatingInput.val(reqRatingCurrent);
                        reqRatingMessage.hide();
                    }
                    event.preventDefault();
                });
            }
            /* обработчики файлов */
            if (file.length > 0) {
                file.each(function () {
                    $(this).on("change", function () {
                        if (typeof $(this)[0].files === "object") {
                            var success = true;
                            for (var i in $(this)[0].files) {
                                i = parseInt(i);
                                if (!isNaN(i) && success == true) {
                                    /* проверяем MIME тип файла */
                                    switch ($(this)[0].files[i].type) {
                                    case "text/plain":
                                        success = true;
                                        break; /* txt */
                                    case "application/vnd.oasis.opendocument.text":
                                        success = true;
                                        break; /* odt */
                                    case "application/pdf":
                                        success = true;
                                        break; /* pdf */
                                    default:
                                        /* дополнительная проверка для форматов doc, docx, rtf */
                                        if (typeof $(this)[0].files[i].name === "string") {
                                            var ext = $(this)[0].files[i].name.split(".");
                                            if (typeof ext === "object") {
                                                if ($(this)[0].accept.indexOf(ext[ext.length - 1]) != -1) success = true;
                                                else success = false;
                                            }
                                        } else
                                            success = false;
                                        break;
                                    }
                                }
                            }
                            if (!success) {
                                object.find("label.note").show();
                                fileSuccess = false;
                            } else {
                                object.find("label.note").hide();
                                fileSuccess = true;
                            }
                        }
                    });
                });
            }
            /* проверка обязательных полей */
            reqText.each(function () {
                var obj = $(this);
                obj.blur(function () {
                    CheckText(obj);
                });
                obj.focus(function () {
                    var errorMessage = obj.attr("title");
                    if (obj.hasClass("error")) obj.removeClass("error");
                    if (obj.val() == errorMessage) obj.val("");
                });
            });
            reqTextarea.each(function () {
                var obj = $(this);
                obj.blur(function () {
                    CheckText(obj);
                });
                obj.focus(function () {
                    var errorMessage = obj.attr("title");
                    if (obj.hasClass("error")) obj.removeClass("error");
                    if (obj.val() == errorMessage) obj.val("");
                });
            });
            reqPassword.each(function () {
                var obj = $(this);
                obj.blur(function () {
                    CheckPassword(obj);
                });
                obj.focus(function () {
                    if (obj.hasClass("error")) obj.removeClass("error");
                });
            });
            reqEmail.each(function () {
                var obj = $(this);
                obj.blur(function () {
                    CheckText(obj);
                    CheckEmail(obj);
                });
                obj.focus(function () {
                    var errorMessage = obj.attr("title");
                    if (obj.hasClass("error")) obj.removeClass("error");
                    if (obj.val() == errorMessage) obj.val("");
                });
            });
            reqPhone.each(function () {
                var obj = $(this);
                obj.mask("+7 (999) 999-99-99");
                obj.blur(function () {
                    CheckText(obj);
                });
                obj.focus(function () {
                    if (obj.hasClass("error")) obj.removeClass("error");
                });
            });
            /* отправка формы */
            object.submit(function () {
                var hasName = true,
                    hasEmail = true,
                    hasComment = true,
                    hasPassword = true,
                    hasPhone = true;
                var hasRating = CheckRating();
                reqText.each(function () {
                    var obj = $(this);
                    hasName = CheckText(obj);
                });
                reqPassword.each(function () {
                    var obj = $(this);
                    hasPassword = CheckPassword(obj);
                });
                reqTextarea.each(function () {
                    var obj = $(this);
                    hasComment = CheckText(obj);
                });
                reqEmail.each(function () {
                    var obj = $(this);
                    hasEmail = CheckText(obj);
                    hasEmail = CheckEmail(obj);
                });
                reqPhone.each(function () {
                    var obj = $(this);
                    hasPhone = CheckText(obj);
                });
                /* если все поля заполнены */
                if (hasName && hasEmail && hasComment && hasRating && hasPassword && hasPhone) {
                    if (typeof useAjax === "undefined") useAjax = false;
                    if (typeof url === "undefined") url = "";
                    /* Ajax отправка данных формы и получение/обработка ответа */
                    if (useAjax) {
                        /* url - адрес скрипта */
                        /* post - метод запроса */
                        /* object - объект формы */
                        /* ymTarget - код цели для Яндекс.Метрики */
                        AjaxSubmit(url, "post", object);
                        return false;
                    } else {
                        if (typeof ymTarget !== "undefined" && typeof yaCounter10648792 !== "undefined")
                            yaCounter10648792.reachGoal(ymTarget);
                        return true; /* обычная отправка формы */
                    }
                }
                return false;
            });
            /* функции проверки значений */
            function CheckText(obj) {
                var errorMessage = obj.attr("title");
                if (obj.val() == "" || obj.val() == errorMessage) {
                    obj.val(errorMessage);
                    obj.addClass("error");
                    return false;
                }
                obj.removeClass("error");
                return true;
            }

            function CheckPassword(obj) {
                if (obj.val() == "") {
                    obj.addClass("error");
                    return false;
                }
                obj.removeClass("error");
                return true;
            }

            function CheckEmail(obj) /* проверка на наличие символов @ и . */ {
                var value = obj.val();
                var indexOfDog = value.indexOf("@");
                var indexOfDot = value.indexOf(".");
                if (indexOfDog <= 0 ||
                    indexOfDot < 1 ||
                    indexOfDog == value.length - 1 ||
                    indexOfDot == value.length - 1 ||
                    indexOfDot == indexOfDog + 1) {
                    obj.addClass("error");
                    return false;
                }
                obj.removeClass("error");
                return true;
            }

            function CheckRating() {
                    if (reqRatingInput.length > 0) {
                        var ratingValue = parseInt(reqRatingInput.val());
                        if (!isNaN(ratingValue) && ratingValue === 0) {
                            reqRatingMessage.show();
                            return false;
                        }
                        reqRatingMessage.hide();
                    }
                    return true;
                }
                /* Ajax отправка данных формы и получение/обработка ответа в формате JSON */
            function AjaxSubmit(url, method, form) {
                    var data = {},
                        formHeight = 0;
                    formHeight = form.height();
                    /* собираем данные из полей */
                    form.find("input, textarea").each(function () {
                        var name = $(this).attr("name");
                        var value = $(this).val();
                        if (typeof name !== "undefined") data[name] = value;
                    });
                    /* добавляем ID сессии */
                    if (typeof reqSessionID.attr("name") !== "undefined") {
                        data[reqSessionID.attr("name")] = reqSessionID.val();
                    }
                    if (method == "post") {
                        $.post(url, data, function (data) {
                            var response = JSON.parse(data);
                            if (typeof response === "object") {
                                /* сообщение об ошибке */
                                if (response["error"] == true)
                                    form.html(GetCommonErrorMessageHtml(response["message"]));
                                else /* сообщение успешно добавлено */ {
                                    if (typeof response["message"] !== "undefined")
                                        form.html(GetCommonMessageHtml(response["message"]));
                                    else {
                                        /* ответы от формы быстрого заказа */
                                        if (typeof response.redirect_url !== "undefined") {
                                            document.location.href = response.redirect_url;
                                        } else {
                                            /* Сообщение для оферты */
                                            if (form.parent().parent().hasClass("quick_order_offer")) {
                                                form.html(GetCommonMessageHtml("Ваша заявка на оферту принята. В ближайшее время с вами свяжется наш менеджер по работе с корпоративными клиентами. Вы также можете ознакомиться с <a href='/offers/'>остальными товарами для оферт на Портале Поставщиков</a>."));
                                            } else {
                                                /* сообщение для обычной формы */
                                                form.html(GetCommonMessageHtml("Спасибо за заказ. В ближайшее время с вами свяжется наш оператор и уточнит условия получения товара. Если вы желаете дополнить текущий заказ другим товаром, просто дождитесь звонка оператора."));
                                            }
                                        }
                                    }
                                    if (typeof ymTarget !== "undefined" && typeof yaCounter10648792 !== "undefined")
                                        yaCounter10648792.reachGoal(ymTarget);
                                }
                                form.addClass("message");
                                form.height(formHeight);
                                form.show();
                            }
                        });
                    }
                }
                /* / Ajax отправка данных формы и получение/обработка ответа */
        }
    })(jQuery);
    /* / Новый обработчик для валидации всех форм на сайте */
    /* Обработчики формы поиска на сайте */
    (function ($) {
        $.fn.FormSearch = function () {
            var object = $(this);
            var searchInput = $("#search_input");
            var searchInputValue = searchInput.val();
            var searchSuggestions = object.find(".search-suggestions");
            var searchSuggestionsTimer;
            var placeholder = "";
            var currentPosition = -1;
            object.submit(function () {
                return FormSubmit(object);
            });
            searchInput.keyup(function (event) {
                switch (event.keyCode) {
                case 13:
                    /* отправка формы */
                    MoveToResult($(this), 0);
                    break;
                case 38:
                    /* вверх */
                    MoveToResult($(this), 1);
                    break;
                case 40:
                    /* вниз */
                    MoveToResult($(this), -1);
                    break;
                default:
                    /* при использовании любых других клавиш - поиск */
                    makePreSearch($(this), searchSuggestions);
                    break;
                }
            });
            searchInput.hover(function () {
                searchSuggestions.show();
            });
            searchInput.focus(function () {
                object.addClass("focus");
                placeholder = searchInput.attr("placeholder");
                searchInput.attr({
                    "placeholder": ""
                });
            });
            searchInput.blur(function () {
                object.removeClass("focus");
                searchInput.attr({
                    "placeholder": placeholder
                });
            });
            searchSuggestions.mouseleave(function () {
                var object = $(this);
                searchSuggestionsTimer = setTimeout(function () {
                    object.hide();
                }, 500);
            });

            function makePreSearch(object, searchSuggestions) {
                var query = object.val();
                if (query.length > 2 && typeof searchSuggestions !== "undefined") {
                    if (!object.hasClass("is_busy")) {
                        object.addClass("is_busy");
                        $.post("/ajax/search.php", {
                            action: 'search',
                            query: query
                        }, function (data) {
                            object.removeClass("is_busy");
                            if (data) {
                                searchSuggestions.addClass("box-shadow-suggestions");
                                searchSuggestions.addClass("border-suggestions");
                                searchSuggestions.html(data).show();
                                searchSuggestions.find(".suggestion-block .suggestion-content ul li a, .search-total a").each(function () {
                                    $(this).mouseover(function () {
                                        $(this).addClass("hover");
                                    });
                                    $(this).mouseleave(function () {
                                        $(this).removeClass("hover");
                                    });
                                });
                            } else {
                                searchSuggestions.removeClass("box-shadow-suggestions");
                                searchSuggestions.removeClass("border-suggestions");
                            }
                        });
                    }
                }
            }

            function MoveToResult(input, direction) {
                if (input.val().length > 2) {
                    if (searchSuggestions.html().length > 1 && searchSuggestions.html().indexOf("search_empty_result") == -1) {
                        var links = searchSuggestions.find(".suggestion-block .suggestion-content ul li a, .search-total a");
                        /* делаем не активной предыдущую ссылку */
                        if (typeof links[currentPosition] !== "undefined")
                            $(links[currentPosition]).removeClass("hover");
                        if (direction == 1) currentPosition--;
                        else if (direction == -1) currentPosition++;
                        if (currentPosition < 0)
                            currentPosition = 0;
                        else if (currentPosition > searchSuggestions.find(".suggestion-block .suggestion-content ul li a").length)
                            currentPosition = searchSuggestions.find(".suggestion-block .suggestion-content ul li a").length;
                        links.each(function (index) {
                            if (index == currentPosition) {
                                $(this).addClass("hover");
                                /* если нажата клавиша Enter - направление не определено - отправляем форму */
                                if (direction == 0) FormSubmit(object, $(this).attr("href"));
                            }
                        });
                    }
                }
            }

            function FormSubmit(form, url) {
                if (typeof url !== "undefined") {
                    window.location.href = url;
                    return false;
                }
                return true;
            }
        }
    })(jQuery);
    /* / Обработчики формы поиска на сайте */
    /* Фильтр каталога товаров */
    (function ($) {
        $.fn.catalogFilters = function () {
            var object = $(this);
            if (object.length > 0) {
                var dropDown = object.find(".drop-down:not(.tags)");
                var dropDownClosed = object.find(".drop-down:not(.tags,.open)");
                var label = object.find("label");
                var checkBox = object.find("label input[type='checkbox']");
                var values = object.find(".values input[type='text']");
                var keyupTimer;
                var isNewsLetter = false;
                /* ------------------------------------------------------------------------------------------------------------------------------------------- */
                /* объединяем закрытые списки в новый блок "Остальные фильтры" */
                object.each(function () {
                    if ($(this).parent().parent().parent().hasClass("newsletter")) {
                        isNewsLetter = true;
                    }
                });
                if (dropDownClosed.length > 0 && !isNewsLetter && systemParameters.mobileDevice.isCellPhone) {
                    object.find(".drop-down:not(.tags,.open)").remove();
                    /* создаем новый блок */
                    var newBlock = "<div class='drop-down aggregate'><div class='title'><a href='#' title='Цена'><span>Остальные фильтры<span class='icon'>&nbsp;</span></span></a></div><div class='content' style='overflow:visible;'>";
                    dropDownClosed.each(function () {
                        newBlock += "<div class='drop-down'>";
                        newBlock += $(this).html(); /* добавляем несколько фильтров */
                        newBlock += "</div>";
                    });
                    newBlock += "</div></div>";
                    object.append(newBlock);
                    /* инициализация */
                    object.find(".drop-down:not(.tags,.open) .drop-down").each(function (index) {
                        $(this).dropDown(500); /* открытие вложенных блоков */
                    });
                    object.children(".drop-down:not(.tags,.open)").dropDown(500); /* открытие родительского блока "Остальные фильтры" */
                    object.find("label input[type='checkbox']").on("change", function () /* изменение чекбокса */ {
                        var input = $(this);
                        var form = object;
                        var dropDown = input.parent().parent().parent().parent().parent().parent().parent();
                        var label = input.parent();
                        if (input.prop("checked")) label.addClass("active");
                        else label.removeClass("active");
                        FilterSubmit(form, dropDown, dropDown.offset().top, input.parent().parent().offset().top);
                    });
                    object.find(".values input[type='text']").on("keyup", function () {
                        var input = $(this);
                        clearTimeout(keyupTimer);
                        keyupTimer = setTimeout(function () {
                            var value = parseFloat(input.val());
                            if (isNaN(value)) value = 0;
                            input.val(value);
                            var minValue = 0,
                                maxValue = 0;
                            var slider = input.parent().parent().find(".slider");
                            var range = input.parent().parent();
                            input.parent().find("input").each(function () {
                                $(this).addClass("changed");
                                var currentValue = $(this).val();
                                if (currentValue < value) {
                                    minValue = currentValue;
                                    maxValue = value;
                                }
                                if (currentValue > value) {
                                    maxValue = currentValue;
                                    minValue = value;
                                }
                            });
                            slider.slider("option", "values", [minValue, maxValue]);
                            Range(range, minValue, maxValue);
                        }, 1500);
                    });
                }
                /* ------------------------------------------------------------------------------------------------------------------------------------------- */
                /* выпадающие списки */
                dropDown.each(function () {
                    $(this).dropDown(500);
                });
                /* изменение чекбокса */
                checkBox.change(function () {
                    var input = $(this);
                    var form = object;
                    var dropDown = input.parent().parent().parent().parent().parent().parent().parent();
                    var label = input.parent();
                    if (input.prop("checked")) label.addClass("active");
                    else label.removeClass("active");
                    FilterSubmit(form, dropDown, dropDown.offset().top, input.parent().parent().offset().top);
                });
                /* костыль для IE 8 */
                if (navigator.userAgent.match(/msie/i) && navigator.userAgent.match(/8.0/)) {
                    label.click(function (event) {
                        $(this).find("input").click();
                        event.preventDefault();
                    });
                }
                /* / изменение чекбокса */
                /* изменение значения в полях диапазона */
                values.keyup(function () {
                    var input = $(this);
                    clearTimeout(keyupTimer);
                    keyupTimer = setTimeout(function () {
                        var value = parseFloat(input.val());
                        if (isNaN(value)) value = 0;
                        input.val(value);
                        var minValue = 0,
                            maxValue = 0;
                        var slider = input.parent().parent().find(".slider");
                        var range = input.parent().parent();
                        input.parent().find("input").each(function () {
                            $(this).addClass("changed");
                            var currentValue = $(this).val();
                            if (currentValue < value) {
                                minValue = currentValue;
                                maxValue = value;
                            }
                            if (currentValue > value) {
                                maxValue = currentValue;
                                minValue = value;
                            }
                        });
                        slider.slider("option", "values", [minValue, maxValue]);
                        Range(range, minValue, maxValue);
                    }, 1500);
                });
                /* / изменение значения в полях диапазона */
            }
        }
    })(jQuery);
    /* / Фильтр каталога товаров */
    /* Лайки и рейтинг материалов сайта */
    (function ($) {
        $.fn.ratingLikes = function () {
            var object = $(this);
            /* кнопки */
            var buttonPlus = object.find(".plus");
            var buttonMinus = object.find(".minus");
            var buttonLogin = object.find(".login");
            /* голоса */
            var votePlus = object.find(".vote-plus");
            var voteMinus = object.find(".vote-minus");
            var voteTotal = object.find(".vote-total");
            /* параметры */
            var parameterBlockType = object.find(".data .block-type").text();
            var parameterBlockId = parseInt(object.find(".data .block-id").text());
            var parameterUserId = parseInt(object.find(".data .user-id").text());
            var parameterVoted = parseInt(object.find(".data .voted").text());
            /* сообщения */
            var messageVoteCounted = object.find(".vote-counted");
            var messageVoteCompleted = object.find(".vote-completed");
            /* необязательные элементы */
            var progress = object.find(".progress");
            var progressBar = progress.find(".bar");
            var progressText = progress.find(".text");
            var numberItems = object.find(".number-items");
            buttonPlus.on("click", function (event) {
                /* сразу несколько голосов */
                if (numberItems.length > 0)
                    SendVote($(this), parseInt(numberItems.find("input").val()));
                else
                    SendVote($(this), 1);
                event.preventDefault();
            });
            buttonMinus.on("click", function (event) {
                SendVote($(this), 0);
                event.preventDefault();
            });
            buttonLogin.on("click", function (event) {
                $(".header.fixed .user a.title").click();
                event.preventDefault();
            });

            function SendVote(obj, vote) {
                var rating = 0;
                if (parameterUserId != 0 && parameterVoted == 0) {
                    object.find(".data .voted").text("1"); /* проголосовал */
                    obj.addClass("loading");
                    /* сделаем кнопку серой */
                    if (obj.hasClass("red")) {
                        obj.removeClass("red");
                        obj.addClass("grey");
                    }
                    $.post("/ajax/like.php", {
                        "type": parameterBlockType,
                        "id": parameterBlockId,
                        "user_id": parameterUserId,
                        "sign": vote
                    }, function (data) {
                        data = JSON.parse(data);
                        if (typeof data === "object") {
                            if (data.success === true) /* голос учтен */ {
                                /* считаем рейтинг */
                                switch (vote) {
                                case 0:
                                    if (voteMinus.length > 0) {
                                        rating = parseInt(voteMinus.text()) + 1;
                                        if (typeof rating === "undefined") rating = 0;
                                        voteMinus.text(rating);
                                        buttonMinus.remove();
                                    }
                                    break;
                                default:
                                    if (votePlus.length > 0) {
                                        rating = parseInt(votePlus.text()) + 1;
                                        if (typeof rating === "undefined") rating = 0;
                                        votePlus.text(rating);
                                        buttonPlus.remove();
                                    }
                                    break;
                                }
                                obj.remove(); /* удаляем кнопку */
                                /* показываем текст про учет голоса */
                                if (messageVoteCounted.length > 0) messageVoteCounted.removeClass("hide");
                                if (numberItems.length > 0) numberItems.remove();
                                /* прогресс-бар */
                                if (progress.length > 0) {
                                    /* меняем положение прогресс-бара */
                                    var percent = (100 / parseInt(voteTotal.text())) * rating;
                                    if (isNaN(percent) || percent < 0) percent = 0;
                                    else {
                                        if (percent > 100) percent = 100;
                                    }
                                    progressBar.animate({
                                        "width": percent + "%"
                                    }, 500, function () {
                                        /* если голосование завершено */
                                        if (percent == 100) {
                                            /*progress.remove();*/
                                            messageVoteCounted.remove();
                                            messageVoteCompleted.removeClass("hide");
                                            progressText.text("Голосование окончено. Коллективная покупка активирована!");
                                        }
                                    });
                                }
                            } else /* обработка сообщения об ошибке */ {
                                obj.removeClass("loading");
                                object.addClass("error");
                                object.find(".fixed-wrap").show();
                                object.find(".message").html('<span class="arrow">&nbsp;</span>' + data.error);
                            }
                        } else /* обработка сообщения об ошибке */ {
                            obj.removeClass("loading");
                            object.addClass("error");
                            object.find(".fixed-wrap").show();
                            object.find(".message").html('<span class="arrow">&nbsp;</span>' + 'Ошибка');
                        }
                    });
                } else /* обработка сообщения об ошибке */ {
                    object.addClass("error");
                    object.find(".fixed-wrap").show();
                    if (parameterVoted == 1) object.find(".message").html('<span class="arrow">&nbsp;</span>' + 'Вы уже голосовали за этот элемент.');
                }
            }
        }
    })(jQuery);
    /* / Лайки и рейтинг материалов сайта */
    /* Обработка Clipboard */
    (function ($) {
        $.fn.customClipboardEvents = function () {
            var object = $(this);
            var refLink = object.attr("href");
            if (typeof ZeroClipboard !== "undefined") {
                ZeroClipboard.config({
                    swfPath: "/bitrix/templates/cosmo/css/img/ZeroClipboard.swf"
                });
                var client = new ZeroClipboard(object);
                client.on("ready", function (event) {
                    client.on('aftercopy', function (event) {
                        $(event.target).parent().find(".done").removeClass("hide");
                        $(event.target).remove();
                    });
                });
                client.on("error", function (event) {
                    ShowPromptBox();
                });
            } else ShowPromptBox();

            function ShowPromptBox() {
                object.on("click", function (event) {
                    window.prompt("Вы можете скопировать ссылку на страницу, используя сочетание клавиш Ctrl+C", /*document.location.href*/ refLink);
                });
            }
        }
    })(jQuery);
    /* / Обработка Clipboard */
    /* обработка списка брендов */
    (function ($) {
        $.fn.brandsManagement = function () {
            var object = $(this);
            var letter = object.find(".alphabet a");
            var brandsList = object.find(".block.frame ul");
            letter.click(function (event) {
                var id = $(this).attr("id");
                id = id.split("_");
                if (typeof id[1] !== "undefined") id = parseInt(id[1]);
                if (isNaN(id)) id = 0;
                /* все буквы не активны */
                letter.removeClass("active");
                /* скрываем все списки брендов */
                brandsList.each(function () {
                    if (!$(this).hasClass("hide")) $(this).addClass("hide");
                });
                /* выбранная буква активна */
                $(this).addClass("active");
                /* отображаем выбранный список брендов */
                $("#brand_block_" + id).removeClass("hide");
                event.preventDefault();
            });
        }
    })(jQuery);
    /* обработка списка брендов */
    /* Эспериментальная карточка товара */
    (function ($) {
        $.fn.quickOrderBlockManagement = function (duration) {
            var object = $(this);
            if (object.length > 0) {
                var title = object.find(".title a");
                var titleIcon = title.find(".icon");
                var content = object.find(".content");
                var form = object.find("form");
                /* показываем сообщение после оформления быстрого заказа */
                if (typeof document.location.search !== "undefined" && document.location.search.indexOf("success_order") != -1) {
                    titleIcon.addClass("close");
                    content.show();
                }
                /* третий параметр - цель для Яндекс.Метрики */
                form.FormValidation(true, "/ajax/quick_order.php", "REAL_QUICK_ORDER");
                title.click(function (event) {
                    content.slideToggle(duration, function () {
                        if (!titleIcon.hasClass("close")) {
                            titleIcon.addClass("close");
                        } else {
                            titleIcon.removeClass("close");
                        }
                    });
                    event.preventDefault();
                });
            }
        }
    })(jQuery);
    /* / Эспериментальная карточка товара */
    /* Товарные рекомендации от Retail Rocket */
    /* Параметры */
    /* data - массив параметров */
    /* data.type - тип рекомендации */
    /* data.productID */
    /* data.sectionID */
    /* data.userID */
    /* delay - задержка */
    /* Типы рекомендаций */
    /* CategoryToItems - для страницы товарной категории */
    (function ($) {
        $.fn.getRetailRocketRecommendation = function (data, delay) {
            var object = $(this);
            if (!systemParameters.mobileDevice.isCellPhone) {
                var rrData = {};
                /* проверка значений */
                if (typeof data.action !== "undefined") {
                    rrData.action = data.action;
                }
                if (typeof data.title !== "undefined") {
                    rrData.title = data.title;
                }
                if (typeof data.productID !== "undefined") {
                    rrData.product_id = data.productID;
                }
                if (typeof data.sectionID !== "undefined") {
                    rrData.section_id = data.sectionID;
                }
                if (typeof data.searchType !== "undefined") {
                    rrData.search_type = data.searchType;
                }
                if (typeof data.searchValue !== "undefined") {
                    rrData.search_value = data.searchValue;
                }
                if (typeof data.userID !== "undefined") {
                    rrData.user_id = data.userID;
                }
                /* отправляем запрос с задержкой */
                var timeout = window.setTimeout(function () {
                    $.post("/ajax/recommendations.php", rrData, function (response) {
                        if (response.length > 1) {
                            object.append(response);
                            /* инициализация каруселей товаров */
                            object.find(".product-carousel").each(function (index) {
                                /* ширина блока товаров до инициализации */
                                /* 844 - полная версия сайта */
                                /* 675 - адаптивная версия 760 */
                                var width = $(this).find("ul.items").width();
                                if ((width <= 846 && width >= 844) || (width <= 676 && width >= 674) || width == 507 || width == 338 || width == 169 || width == 0) {
                                    $(this).productCarousel(1500);
                                }
                            });
                            /* Передача данных о взаимодействии пользователей с рекомендациями */
                            /* Клик по гиперссылке с товарной рекомендацией */
                            $("." + rrData.action).on("click", "li.item a.img, li.item .parameters .name a", function (event) {
                                var itemID = 0;
                                if ($(this).hasClass("img"))
                                    itemID = $(this).parent().find(".add2basket").attr("onclick");
                                else
                                    itemID = $(this).parent().parent().parent().find(".add2basket").attr("onclick");
                                if (typeof itemID === "string") {
                                    itemID = itemID.split(")");
                                    itemID = itemID[0];
                                    itemID = itemID.split(",");
                                    itemID = parseInt(itemID[1]);
                                    if (isNaN(itemID)) itemID = 0;
                                }
                                if (typeof rrApi !== "undefined" && typeof itemID !== "undefined" && itemID != 0) {
                                    try {
                                        rrApi.recomMouseDown(itemID, rrData.action);
                                    } catch (e) {}
                                }
                            });
                            /* Добавление товара в корзину из блока с рекомендациями */
                            $("." + rrData.action).on("click", "li.item .add2basket", function (event) {
                                var itemID = 0;
                                itemID = $(this).attr("onclick");
                                if (typeof itemID === "string") {
                                    itemID = itemID.split(")");
                                    itemID = itemID[0];
                                    itemID = itemID.split(",");
                                    itemID = parseInt(itemID[1]);
                                    if (isNaN(itemID)) itemID = 0;
                                }
                                if (typeof rrApi !== "undefined" && typeof itemID !== "undefined" && itemID != 0) {
                                    try {
                                        rrApi.recomAddToCart(itemID, rrData.action);
                                    } catch (e) {}
                                }
                            });
                        } else {
                            /* рекомендации не получены - скрываем родительский блок на странице оформления заказа */
                            if (object.parent().hasClass("accordion")) {
                                object.parent().hide();
                            }
                        }
                    });
                }, delay);
            } else {
                /* рекомендации не получены - скрываем родительский блок на странице оформления заказа */
                if (object.parent().hasClass("accordion")) {
                    object.parent().hide();
                }
            }
        }
    })(jQuery);
    /* / Товарные рекомендации от Retail Rocket */
    /*
    # orderFormMVC
    принцип MVC
    Model - orderFormData
    View - события и обработчики пользовательского интерфейса
    Controller - пользовательские события, функция InitOrderForm(), SetCartTotal() и т.п.
    */
    (function ($) {
        $.fn.orderFormMVC = function () {
            var object = $(this);
            var MVC = {};
            /* ************************************************************* */
            /* # Object */
            /* ************************************************************* */
            /* виды пользовательских событий */
            object.customEvents = {
                /* изменение цены товаров */
                0: "onChangeInvoicePrice",
                /* изменение стоимости доставки */
                1: "onChangeDeliveryPrice",
                /* изменение способа оплаты */
                2: "onChangePaymentType",
                /* изменение бонусов */
                3: "onChangeBonusCount",
                /* изменение итоговой стоимости */
                4: "onChangeTotalPrice",
                /* получить тип доставки */
                5: "onGetDeliveryType",
                /* получить тип оплаты */
                6: "onGetPaymentType",
                /* получить стоимость товаров */
                7: "onGetInvoicePrice",
                /* получить количество бонусов */
                8: "onGetBonusCount",
                /* получить количество бонусов, кот разрешено тратить */
                9: "onGetBonusCountCanPay",
                /* получить данные об ошибках */
                10: "onGetOrderFormErrors",
                /* сохранить данные формы заказа */
                11: "onSaveOrderForm",
                /* отправить данные для партнерки */
                12: "onSendPartnerData",
                /* получить тип плательщика */
                13: "onGetPersonType",
                /* получить тип безналичной оплаты */
                14: "onGetPaymentCashlessType",
                /* ошибка */
                500: "onError"
            };
            /* ************************************************************* */
            /* / Object */
            /* ************************************************************* */
            /* ************************************************************* */
            /* # Model */
            /* ************************************************************* */
            MVC.Model = function () {
                /* параметры */
                this.orderFormData = {
                    /* стоимость всех товаров в корзине */
                    invoicePrice: 0,
                    /* стоимость доставки */
                    deliveryPrice: 0,
                    /* тип доставки */
                    deliveryType: 0,
                    /* адрес доставки */
                    deliveryID: 0,
                    /* дата доставки */
                    deliveryDate: 0,
                    /* дата доставки в формате 00.00.0000 */
                    deliveryDateStr: 0,
                    /* дата доставки в формате 00.00.0000 которую выбрал пользователь */
                    deliveryDateStrUser: 0,
                    /* возможность бесплатной доставки в данном городе */
                    deliveryCityIsFree: 0,
                    /* правила доставки для данного города */
                    deliveryRules: 0,
                    /* дата самовывоза = дате доставки */
                    /* дата самовыза */
                    pickupDate: 0,
                    /* дата самовывоза в формате 00.00.0000 */
                    pickupDateStr: 0,
                    /* дата самовывоза в формате 00.00.0000 которую выбрал пользователь */
                    pickupDateStrUser: 0,
                    /* общее количество бонусов */
                    bonusCount: 0,
                    /* сколько бонусов можно потратить */
                    bonusCountCanPay: 0,
                    /* количество бонусов для оплаты заказа */
                    bonusCountToPay: 0,
                    /* способ оплаты */
                    paymentType: 0,
                    /* способ оплаты электронными деньгами */
                    paymentElectroMoney: 0,
                    /* тип безналичной оплаты */
                    paymentCashlessType: 0,
                    /* тип плательщика */
                    personType: 0,
                    /* город пользователя плательщика */
                    personLocationID: 0,
                    /* ID плательщика */
                    personFID: 0,
                    /* общая стоимость заказа */
                    cartTotal: 0,
                    /* общая стоимость заказа без скидок */
                    cartTotalNoDiscounts: 0
                };
                /* типы ошибок */
                this.orderFormErrors = {
                    /* не заполнено одно из обязательных полей */
                    requiredDataMissing: false,
                    requiredDataType: [],
                    requiredEmailMissing: false,
                    /* не выбран способ доставки или адрес самовывоза */
                    deliveryIDMissing: false,
                    /* онлайн оплата не возможна */
                    onlinePaymentNotAvailable: false,
                    /* оплата картой при получении не возможна */
                    offlineCardPaymentNotAvailable: false,
                    /* не выбран тип плательщика */
                    personFIDMissing: false,
                    /* не выбран тип безналичной оплаты */
                    paymentCashlessTypeMissing: false
                };
            };
            /* ************************************************************* */
            /* / Model */
            /* ************************************************************* */
            /* ************************************************************* */
            /* # View */
            /* ************************************************************* */
            MVC.View = function (object) {
                this.objectForm = object;
                this.initPlugins;
                this.setInvoiceTotalPrice;
                this.setOrderTotalPrice;
                this.showDeliveryNotice;
                this.showDeliveryMessage;
                this.showDeliveryError;
                this.showPickupMessage;
                this.showPickupError;
                this.showPaymentCashless;
                this.showOnlinePaymentError;
                this.showPaymentCashlessError;
                this.showPaymentCashlessTypeError;
                this.showCover;
                this.onChangeCheckBox;
                this.sendRitorno;
                this.reloadOrderForm;
                /* количество товара и ограничения */
                var productCount = 0;
                var minProductCount = 1;
                var maxProductCount = 999;
                /* инициализация плагинов */
                this.initPlugins = function () {
                    this.objectForm.find(".accordion").each(function () {
                        $(this).dropDown(500);
                    });
                    this.objectForm.find("input[name='PHONE']").mask("+7 (999) 999-99-99");
                    this.objectForm.find("input[name='F_OFFICE_PHONE']").mask("+7 (999) 999-99-99");
                    this.objectForm.find(".calendar input").datepicker({
                        option: $.datepicker.regional["ru"],
                        /* локализация */
                        changeMonth: false,
                        /* запрет изменения месяца и года в виде select */
                        changeYear: false,
                        beforeShowDay: $.datepicker.noWeekends,
                        /* запрет выбора выходного дня */
                        showOtherMonths: true,
                        /* показать другие месяцы */
                        selectOtherMonths: true,
                        /* другие месяцы можно выбирать */
                        dateFormat: "dd.mm.yy",
                        /* формат даты */
                        onClose: function (selectedDate) /* закрытие календаря */ {
                            /* обработчик события закрытия календаря и изменения даты */
                            var data = {
                                newDateStr: selectedDate
                            };
                            /* onChangeDeliveryPrice */
                            object.trigger(object.customEvents[1], [data]);
                            /* календарь не активен */
                            var icon = $(".box .section .select .calendar span.icon");
                            if (icon.hasClass("active")) {
                                icon.removeClass("active");
                            }
                        }
                    });
                    var deliveryType = {};
                    /* onGetDeliveryType */
                    this.objectForm.trigger(this.objectForm.customEvents[5], [deliveryType]);
                    if (deliveryType.data == "pickup") {
                        deliveryType = 1;
                    } else {
                        deliveryType = 0;
                    }
                    this.objectForm.find("#DELIVERY_TYPE").tabsSwitch(deliveryType);
                    this.showDeliveryMessage();
                    var tabID = 0;
                    var paymentType = {};
                    /* onGetPaymentType */
                    this.objectForm.trigger(this.objectForm.customEvents[6], [paymentType]);
                    switch (paymentType.data) {
                    case "cash":
                        tabID = 0;
                        break;
                    case "cardoffline":
                    case "electromoney":
                    case "cashless":
                        tabID = 1;
                        break;
                    default:
                        tabID = 0;
                        break;
                    }
                    this.objectForm.find("#PAYMENT_TYPE").tabsSwitch(tabID);
                    if (tabID == 1) {
                        var data = { paymentType : paymentType.data };
                        /* onGetPaymentCashlessType */
                        var paymentCashlessType = {};
                        this.objectForm.trigger(this.objectForm.customEvents[14], [paymentCashlessType]);
                        data.paymentCashlessType = paymentCashlessType.data;
                        if(paymentType.data == "cashless") {
                            var personType = {};
                            /* onGetPersonType */
                            this.objectForm.trigger(this.objectForm.customEvents[13], [personType]);
                            data.personType = personType.data;
                        }
                        this.showPaymentCashless(data);
                    }
                    this.showPickupMessage();
                    SetBackgroundSize();
                };
                /* обработчики стандартных событий DOM */
                /* стандартные события отвечают за обработку интерфейса и инициализацию пользовательских событий */
                /* #resize */
                $(window).resize(function () {
                    SetBackgroundSize();
                });
                /* /resize */
                /* #клик */
                this.objectForm.on("click", function (event) {
                    var target = $(event.target);
                    var targetClass = target.attr("class");
                    if (typeof targetClass === "undefined") {
                        target = target.parent();
                        targetClass = target.attr("class");
                    }
                    if (typeof targetClass !== "undefined") {
                        while (targetClass.indexOf(" ") != -1) {
                            targetClass = targetClass.replace(" ", "");
                        }
                        switch (targetClass) {
                            /* #изменение количества товара */
                        case "plus":
                        case "minus":
                            var input = target.parent().find("input");
                            var changePriceValue = 0;
                            /* product - временный объект */
                            var product = {
                                id: 0,
                                count: parseInt(input.val()),
                                price: parseInt(target.parent().parent().parent().find(".price").text()),
                                priceTotalHtml: target.parent().parent().parent().find(".total"),
                                residue: parseInt(input.attr("size"))
                            };
                            if (isNaN(product.count)) product.count = 0;
                            if (isNaN(product.price)) product.price = 0;
                            product.id = input.attr("name").split("_");
                            product.id = parseInt(product.id[1]);
                            if (isNaN(product.id)) product.id = 0;
                            if (isNaN(product.residue)) product.residue = 0;
                            if (targetClass == "minus") {
                                product.count--;
                                if (product.count <= 0) {
                                    product.count = 1;
                                    target.addClass("inactive");
                                } else {
                                    target.removeClass("inactive");
                                    changePriceValue = product.price * (-1);
                                    SaveProductToCookies(product.id, -1, product.residue, product.price, false);
                                }
                            } else {
                                product.count++;
                                if (product.count > 999) product.count = 999;
                                else {
                                    target.parent().find("a.minus").removeClass("inactive");
                                    SaveProductToCookies(product.id, 1, product.residue, product.price, false);
                                    changePriceValue = product.price;
                                }
                            }
                            /* количество товара не может превышать остаток распродажи */
                            if (product.residue > 0 && product.count > product.residue) product.count = product.residue;
                            /* заполняем значения */
                            input.val(product.count); /* количество товара */
                            product.priceTotalHtml.text((product.price * product.count) + " р."); /* общая стоимость товара */
                            delete product;
                            /* onChangeInvoicePrice - изменение цены товаров */
                            /* передаем в обработчик события значение = на сколько изменилась стоимость всех товаров в корзине */
                            $(this).trigger(object.customEvents[0], [changePriceValue]);
                            event.preventDefault();
                            break;
                            /* /изменение количества товара */
                            /* #удаление товара */
                        case "delete":
                            /* product - временный объект */
                            var product = {
                                id: 0,
                                price: parseInt(target.parent().find(".price").text()) * parseInt(target.parent().find(".counter input").val()) * (-1),
                                row: target.parent()
                            };
                            product.id = target.parent().find(".count .counter input").attr("name")
                            product.id = product.id.split("_");
                            product.id = parseInt(product.id[1]);
                            product.row.remove();
                            SaveProductToCookies(product.id, 0, 0, 0, true);
                            /* onChangeInvoicePrice - изменение цены товаров */
                            /* передаем в обработчик события значение = на сколько изменилась стоимость всех товаров в корзине */
                            $(this).trigger(object.customEvents[0], [product.price]);
                            /* onSendPartnerData - отправить данные для партнерки */
                            /* отправляем ID товара для Ritorno */
                            var data = {
                                partner: "Ritorno",
                                product: product.id
                            };
                            $(this).trigger(object.customEvents[12], [data]);
                            delete product;
                            event.preventDefault();
                            break;
                            /* /удаление товара */
                            /* #перезагрузка формы оформления заказа */
                        case "coverwhite":
                            var loader = target.parent().find(".loader");
                            loader.show();
                            /* заполняем поля формы данными перед отправкой */
                            /* onSaveOrderForm */
                            var success = {
                                data: false
                            };
                            $(this).trigger(object.customEvents[11], function (result) {
                                /* возвращаем значение-  true */
                                success.data = result;
                            });
                            if (success.data === true) {
                                /* #собираем данные из формы */
                                var formData = {};
                                $(this).find("input").each(function () {
                                    var input = $(this);
                                    formData[input.attr("name")] = input.val();
                                });
                                $(this).find("textarea").each(function () {
                                    var input = $(this);
                                    formData[input.attr("name")] = input.val();
                                });
                                formData["refresh"] = 1;
                                var cityID = parseInt($.cookie("shag_OS_CITY_ID_NEW"));
                                if (isNaN(cityID)) cityID = 0;
                                formData["city"] = cityID;
                                /* /собираем данные из формы */
                                $.post("/ajax/refresh_order.php", formData, function (data) {
                                    $(".order-form").remove();
                                    $(".main_content").append(data);
                                    $(".order-form").orderFormMVC();
                                });
                            }
                            event.preventDefault();
                            break;
                            /* /перезагрузка формы оформления заказа */
                            /* #открытие формы авторизации пользователя */
                        case "buttongreyfloatinglogin":
                            $(".header.fixed .user a.title").click();
                            event.preventDefault();
                            break;
                            /* /открытие формы авторизации пользователя */
                            /* #подсказки */
                        case "icon":
                        case "iconquestion":
                        case "iconfloating":
                            var message = target.parent().find(".message");
                            var fixedWrap = target.parent().find(".fixed-wrap");
                            var timer;
                            if (message.css("display") == "none") {
                                fixedWrap.show();
                                message.show();
                                target.addClass("active");
                                timer = setTimeout(function () {
                                    fixedWrap.hide();
                                    message.hide();
                                    target.removeClass("active");
                                }, 30000);
                            }
                            /* иконка-замена для чекбокса */
                            if (target.parent().hasClass("checkbox")) {
                                target.parent().find("input").click();
                            }
                            /* календарь */
                            if (target.parent().hasClass("calendar")) {
                                /* устанавливаем дату доставки для календаря */
                                SetUpCalendar(model.orderFormData.deliveryType);
                                target.parent().find("input").datepicker("show");
                                target.addClass("active");
                            }
                            event.preventDefault();
                            break;
                        case "iconactive":
                            /* иконка-замена для чекбокса */
                            if (target.parent().hasClass("checkbox")) {
                                target.parent().find("input").click();
                            }
                            event.preventDefault();
                            break;
                            /* закрытие подсказок */
                        case "fixed-wrap":
                            var message = target.parent().find(".message");
                            if (message.css("display") == "block") {
                                target.hide();
                                message.hide();
                                target.parent().removeClass("active");
                            }
                            event.preventDefault();
                            break;
                            /* /подсказки */
                            /* #открытие списка городов */
                        case "buttongreychange":
                            var element = "html";
                            if ($(element).scrollTop() == 0) {
                                element = "body";
                            }
                            $(element).animate({
                                scrollTop: 0
                            }, 500, function () {
                                if (!$(".header .item.city").hasClass("open")) {
                                    $(".header .item.city a.title").click();
                                }
                            });
                            event.preventDefault();
                            break;
                            /* /открытие списка городов */
                            /* #чекбоксы */
                            /*
                            case "checkbox":
                            target.find("input").change();
                            break;
                            */
                            /* /чекбоксы */
                            /* #измененение способа доставки */
                        case "deliveryactive":
                        case "pickupactive":
                            var data = {
                                deliveryType: "delivery"
                            };
                            if (targetClass == "pickupactive") data.deliveryType = "pickup";
                            /* onChangeDeliveryPrice */
                            $(this).trigger(object.customEvents[1], [data]);
                            break;
                            /* /измененение способа доставки */
                            /* #измененение способа оплаты */
                        case "cashactive":
                        case "cashlessactive":
                        case "electromoneyactive":
                            var data = {
                                paymentType: "cash"
                            };
                            if (targetClass == "cashlessactive") {
                                data.paymentType = "cashless";
                            } else {
                                if (targetClass == "electromoneyactive") {
                                    data.paymentType = "electromoney";
                                    /* проверка возможности онлайн оплаты */
                                    var deliveryType = {};
                                    /* onGetDeliveryType */
                                    $(this).trigger(object.customEvents[5], [deliveryType]);
                                    if (deliveryType.data == "pickup") {
                                        if ($("#delivery-pickup").find("option:selected").data("can-pay-online") == 0) {
                                            var data = {
                                                onlinePaymentNotAvailable: true
                                            };
                                            /* onError */
                                            object.trigger(object.customEvents[500], [data]);
                                        }
                                    }
                                }
                            }
                            /* onChangePaymentType */
                            $(this).trigger(object.customEvents[2], [data]);
                            break;
                            /* /измененение способа оплаты */
                        }
                    }
                });
                /* выбор города из списка  */
                $(".header .menu .item.city .content").on("click", ".cities ul a", function (event) {
                    var obj = $(this);
                    /* получаем название города из ссылки */
                    var cityName = obj.text();
                    /* получаем cityID из ссылки */
                    var cityID = 0;
                    var uri = obj.attr("href");
                    uri = uri.split("?");
                    if (typeof uri === "object") {
                        for (var field in uri) {
                            if (uri[field].indexOf("city") != -1) {
                                uri = uri[field].split("&");
                                if (typeof uri === "object") {
                                    for (var f in uri) {
                                        var temp = uri[f].split("=");
                                        if (typeof temp[0] !== "undefined" && typeof temp[1] !== "undefined" && temp[0] == "city") {
                                            cityID = parseInt(temp[1]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    /* заполняем поля формы данными перед отправкой */
                    /* onSaveOrderForm */
                    var success = {
                        data: false
                    };
                    object.trigger(object.customEvents[11], function (result) {
                        /* возвращаем значение-  true */
                        success.data = result;
                    });
                    if (success.data === true) {
                        var formData = {};
                        object.find("input").each(function () {
                            var input = $(this);
                            formData[input.attr("name")] = input.val();
                        });
                        object.find("textarea").each(function () {
                            var input = $(this);
                            formData[input.attr("name")] = input.val();
                        });
                        formData["refresh"] = 1;
                        formData["city"] = cityID;
                        $.post("/ajax/refresh_order.php", formData, function (data) {
                            $(".order-form").remove();
                            $(".main_content").append(data);
                            $(".order-form").orderFormMVC();
                            /* новое название города для шапки сайта */
                            $(".header .item.city a span span.name").text(cityName);
                            /* закрываем меню выбора города */
                            $(".header .item.city .content").hide();
                            $(".header .item.city .fixed-wrap").hide();
                            $(".header .item.city").removeClass("open");
                            $(".header .item.city a.title span span.icon").removeClass("open");
                            var top = $(".box .section .city").offset().top - 29;
                            $("html, body").animate({
                                scrollTop: top
                            }, 500);
                        });
                    }
                    event.preventDefault();
                });
                /* добавление товара в корзину */
                $(".add2basket").on("click", function (event) {
                    var productId = 0;
                    productId = $(this).attr("onclick").split(";");
                    if (typeof productId === "object") {
                        productId = productId[0];
                        productId = productId.split(",");
                        if (typeof productId === "object") {
                            productId = parseInt(productId[1]);
                            if (isNaN(productId)) productId = 0;
                        }
                    }
                    /* заполняем поля формы данными перед отправкой */
                    /* onSaveOrderForm */
                    var success = {
                        data: false
                    };
                    object.trigger(object.customEvents[11], function (result) {
                        /* возвращаем значение-  true */
                        success.data = result;
                    });
                    if (success.data === true) {
                        var formData = {};
                        object.find("input").each(function () {
                            var input = $(this);
                            formData[input.attr("name")] = input.val();
                        });
                        object.find("textarea").each(function () {
                            var input = $(this);
                            formData[input.attr("name")] = input.val();
                        });
                        formData["refresh"] = 1;
                        var cityID = parseInt($.cookie("shag_OS_CITY_ID_NEW"));
                        if (isNaN(cityID)) cityID = 0;
                        formData["city"] = cityID;
                        $.post("/ajax/refresh_order.php", formData, function (data) {
                            $(".order-form").remove();
                            $(".main_content").append(data);
                            $(".order-form").orderFormMVC();
                            var top = 0;
                            $(".box .section .invoice .row").each(function () {
                                if ($(this).find("input").attr("name") == "product_" + productId) {
                                    $(this).addClass("new");
                                    top = $(this).offset().top - 29; /* 29 - высота верхней фикс панели */
                                }
                            });
                            $("html, body").animate({
                                scrollTop: top
                            }, 1000);
                        });
                    }
                });
                /* /клик */
                /* #change */
                this.objectForm.on("change", "input, select", function (event) {
                    var target = $(event.target);
                    var targetType = target.attr("type");
                    var targetID = target.attr("id");
                    switch (targetType) {
                        /* #чекбоксы */
                    case "checkbox":
                        var icon = target.parent().find("span.icon");
                        if (target.prop("checked")) {
                            icon.addClass("active");
                        } else {
                            icon.removeClass("active");
                        }
                        /* чекбокс банковского перевода */
                        if (target.parent().hasClass("legal-entity")) {
                            var data = {};
                            if (target.prop("checked")) {
                                data.showActualAddress = true;
                            } else {
                                data.showActualAddress = false;
                            }
                            /* показать / скрыть поля фактического адреса */
                            /* onChangePaymentType */
                            $(this).trigger(object.customEvents[2], [data]);
                        }
                        break;
                        /* /чекбоксы */
                    }
                    /* select */
                    switch (targetID) {
                        /* #доставка */
                    case "delivery-delivery":
                        var id = target.find("option:selected").val();
                        if (id != 0) {
                            /* onChangeDeliveryPrice */
                            $(this).trigger(object.customEvents[1]);
                        } else {
                            var data = {
                                deliveryIDMissing: true
                            };
                            /* onError */
                            object.trigger(object.customEvents[500], [data]);
                        }
                        break;
                        /* /доставка */
                        /* #самовывоз */
                    case "delivery-pickup":
                        var id = target.find("option:selected").val();
                        var pickpointDetails = target.parent().parent().parent().find("ul.pickup-details li");
                        pickpointDetails.removeClass("active");
                        if (id != 0) {
                            /* показать информацию о пункте выдачи */
                            pickpointDetails.each(function () {
                                var pickpointId = $(this).attr("id").split("-");
                                if (typeof pickpointId[1] !== "undefined") {
                                    pickpointId = parseInt(pickpointId[1]);
                                    if (isNaN(pickpointId)) pickpointId = 0;
                                    if (id == pickpointId) $(this).addClass("active");
                                }
                            });
                            $(this).trigger(object.customEvents[1]);
                            /* Оплата картой при получении - проверка возможности */
                            /* проверка только для городов: Москва, Санкт-Петербург */
                            if(target.find("option:selected").data("has-terminal") == 0) {
                                var data = {
                                    offlineCardPaymentNotAvailable: true
                                };
                                /* onError */
                                object.trigger(object.customEvents[500], [data]);
                            }
                            /* Оплата картой онлайн - проверка возможности онлайн оплаты */
                            if (target.find("option:selected").data("can-pay-online") == 0) {
                                var data = {
                                    onlinePaymentNotAvailable: true
                                };
                                /* onError */
                                object.trigger(object.customEvents[500], [data]);
                            }
                            
                        } else {
                            var data = {
                                deliveryIDMissing: true,
                                offlineCardPaymentNotAvailable: false,
                                onlinePaymentNotAvailable: false,
                                paymentCashlessTypeMissing: false
                            };
                            /* onError */
                            object.trigger(object.customEvents[500], [data]);
                        }
                        break;
                        /* /самовывоз */
                        /* #способ оплаты - банковский перевод - тип плательщика */
                    case "payment-cashless":
                        var data = {
                            personType: parseInt(target.find("option:selected").val())
                        };
                        /* onChangePaymentType */
                        $(this).trigger(object.customEvents[2], [data]);
                        break;
                        /* /способ оплаты - банковский перевод - тип плательщика */
                        /* #тип безналичной оплаты */
                    case "cashless-type":
                        var data = {
                            paymentCashlessType: parseInt(target.find("option:selected").val())
                        };
                        /* в зависимости от типа безналичной оплаты меняется способ оплаты */
                        switch (data.paymentCashlessType) {
                        case 1:
                            /* Оплата картой при получении */
                            data.paymentType = "cardoffline";
                            break;
                        case 2:
                            /* Оплата картой онлайн */
                            data.paymentType = "electromoney";
                            break;
                        case 3:
                            /* Банковский перевод */
                            data.paymentType = "cashless";
                            break;
                        }
                        /* onChangePaymentType */
                        $(this).trigger(object.customEvents[2], [data]);
                        if(data.paymentCashlessType == 1 || data.paymentCashlessType == 2) {
                            var deliveryType = {};
                            /* onGetDeliveryType */
                            $(this).trigger(object.customEvents[5], [deliveryType]);
                            if (deliveryType.data == "pickup") {
                                if(data.paymentCashlessType == 1) {
                                    /* Оплата картой при получении - проверка возможности */
                                    /* проверка только для городов: Москва, Санкт-Петербург */
                                    if($("#delivery-pickup").find("option:selected").data("has-terminal") == 0) {
                                        var data = {
                                            offlineCardPaymentNotAvailable: true
                                        };
                                        /* onError */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                }
                                if(data.paymentCashlessType == 2) {
                                    /* Оплата картой онлайн - проверка возможности онлайн оплаты */
                                    if ($("#delivery-pickup").find("option:selected").data("can-pay-online") == 0) {
                                        var data = {
                                            onlinePaymentNotAvailable: true
                                        };
                                        /* onError */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                }
                            }
                        }
                        break;
                        /* /тип безналичной оплаты */
                    }
                });
                /* /change */
                /* #focus */
                this.objectForm.on("focus", "input", function (event) {
                    var target = $(event.target);
                    var targetType = target.attr("type");
                    var targetName = target.attr("name");
                    switch (targetType) {
                        /* #текстовые поля */
                    case "text":
                        /* количество товара */
                        if (targetName.indexOf("product_") != -1) {
                            productCount = parseInt(target.val());
                            if (isNaN(productCount) || productCount < minProductCount) {
                                productCount = minProductCount;
                            } else {
                                if (productCount > maxProductCount) productCount = maxProductCount;
                            }
                            target.val(productCount);
                        }
                        /* текстовые поля с данными заказа */
                        /* обязательны для заполения */
                        if (target.hasClass("required")) {
                            if (target.hasClass("error")) target.removeClass("error");
                            if (target.val() == target.attr("title")) target.val("");
                        }
                        /* бонусы */
                        if (targetName == "BONUS_TO_PAY") {
                            if (target.val() == 0) {
                                target.val("");
                            }
                        }
                        break;
                        /* /текстовые поля */
                    }
                });
                /* /focus */
                /* #blur */
                this.objectForm.on("blur", "input", function (event) {
                    var target = $(event.target);
                    var targetType = target.attr("type");
                    var targetName = target.attr("name");
                    switch (targetType) {
                        /* #текстовые поля */
                    case "text":
                        /* количество товара */
                        if (targetName.indexOf("product_") != -1) {
                            var changePriceValue = 0;
                            var product = {
                                id: target.attr("name"),
                                count: parseInt(target.val()),
                                price: parseInt(target.parent().parent().parent().find(".price").text()),
                                priceTotalHtml: target.parent().parent().parent().find(".total"),
                                residue: parseInt(target.attr("size"))
                            };
                            product.id = product.id.split("_");
                            product.id = parseInt(product.id[1]);
                            if (isNaN(product.count)) {
                                product.count = productCount;
                            } else {
                                if (product.count < minProductCount) {
                                    product.count = minProductCount;
                                    target.parent().find("a.minus").addClass("inactive");
                                } else {
                                    if (product.count > maxProductCount) {
                                        product.count = maxProductCount;
                                    } else {
                                        if (product.residue > 0 && product.count > product.residue) {
                                            product.count = product.residue;
                                        }
                                    }
                                }
                            }
                            /* количество товара увеличилось */
                            if (product.count > productCount) {
                                changePriceValue = product.price * (product.count - productCount);
                                SaveProductToCookies(product.id, (product.count - productCount), product.residue, product.price, false);
                            } else {
                                /* уменьшилось */
                                if (product.count < productCount) {
                                    changePriceValue = product.price * (productCount - product.count) * (-1);
                                    SaveProductToCookies(product.id, (productCount - product.count) * (-1), product.residue, product.price, false);
                                }
                            }
                            /* заполняем значения */
                            target.val(product.count); /* количество товара */
                            product.priceTotalHtml.text((product.price * product.count) + " р."); /* общая стоимость товара */
                            delete product;
                            /* onChangeInvoicePrice - изменение цены товаров */
                            /* передаем в обработчик события значение = на сколько изменилась стоимость всех товаров в корзине */
                            $(this).trigger(object.customEvents[0], [changePriceValue]);
                        }
                        /* текстовые поля с данными заказа */
                        /* обязательны для заполения */
                        if (target.hasClass("required")) {
                            CheckText(target, target.attr("title"), targetName);
                        }
                        /* Email */
                        if (targetName == "EMAIL") {
                            CheckEmail(target, target.attr("title"));
                        }
                        if (targetName == "ADDRESS_HOUSE") {
                            CheckDigits(target, target.attr("title"), 0, targetName);
                        }
                        /* бонусы */
                        if (targetName == "BONUS_TO_PAY") {
                            CheckBonus(target, target.attr("title"));
                        }
                        /* ИНН индивидуального предпринимателя - 12  цифр */
                        if (targetName == "IP_INN") {
                            CheckDigits(target, target.attr("title"), 12, targetName);
                        }
                        /* ИНН юр лица - 10  цифр */
                        if (targetName == "F_INN") {
                            CheckDigits(target, target.attr("title"), 10, targetName);
                        }
                        /* КПП юр лица - 9 цифр */
                        if (targetName == "F_KPP") {
                            CheckDigits(target, target.attr("title"), 9, targetName);
                        }
                        /* Номер счета юр лица - 20 цифр */
                        if (targetName == "F_CURRENT_ACCOUNT") {
                            CheckDigits(target, target.attr("title"), 20, targetName);
                        }
                        /* БИК юр лица - 9 цифр */
                        if (targetName == "F_BIK") {
                            CheckDigits(target, target.attr("title"), 9, targetName);
                        }
                        break;
                        /* /текстовые поля */
                    }
                });
                /* /blur */
                /* #keyup */
                this.objectForm.on("keyup", "input", function (event) {
                    var target = $(event.target);
                    var targetName = target.attr("name");
                    /*
                    не обрабатываем события:
                    - нажатия клавиш-стрелок на клавиатуре (37, 38, 39, 40)
                    - клавишу backspace (8)
                    - клавишу delete (46)
                    */
                    if ((event.keyCode < 37 || event.keyCode > 40) && event.keyCode != 8 && event.keyCode != 46) {
                        switch (targetName) {
                            /* #бонусы */
                        case "BONUS_TO_PAY":
                            var value = target.val();
                            /* только цифры */
                            value = value.replace(new RegExp("[^0-9]", 'g'), "");
                            if (value.length > 0) {
                                var bonusCount = {};
                                /* onGetBonusCount  */
                                $(this).trigger(object.customEvents[8], [bonusCount]);
                                bonusCount = bonusCount.data;
                                var bonusCountCanPay = {};
                                /* onGetBonusCountCanPay */
                                $(this).trigger(object.customEvents[9], [bonusCountCanPay]);
                                bonusCountCanPay = bonusCountCanPay.data;
                                /* нельзя тратить больше бонусов, чем разрешено и чем есть в наличии */
                                if (value > bonusCountCanPay) {
                                    value = bonusCountCanPay;
                                }
                                if (value > bonusCount) {
                                    value = bonusCount;
                                }
                                value = parseInt(value);
                                target.val(value);
                                var data = {
                                    bonusCountToPay: value
                                };
                                /* onChangeBonusCount - изменение бонусов */
                                $(this).trigger(object.customEvents[3], [data]);
                            }
                            break;
                            /* /бонусы */
                        }
                    }
                });
                /* /keyup */
                /* #submit */
                this.objectForm.on("submit", function (event) {
                    var errors = {};
                    /* onGetOrderFormErrors */
                    $(this).trigger(object.customEvents[10], [errors]);
                    errors = errors.data;
                    /* проверяем все возможные типы ошибок */
                    for (var errType in errors) {
                        switch (errType) {
                        case "requiredDataMissing":
                            /* проверка обязательных полей */
                            $(this).find(".required").each(function () {
                                var input = $(this);
                                var inputName = input.attr("name");
                                /* проверяем поля если нет ошибок */
                                switch (inputName) {
                                    /* поля проверяются в любом случае */
                                case "CONTACT_PERSON":
                                    CheckText(input, input.attr("title"), inputName);
                                    break;
                                case "PHONE":
                                    CheckText(input, input.attr("title"), inputName);
                                    break;
                                case "EMAIL":
                                    CheckText(input, input.attr("title"), inputName);
                                    CheckEmail(input, input.attr("title"));
                                    break;
                                    /* дополнительные проверки условий */
                                case "ADDRESS_STREET":
                                    if (model.orderFormData.deliveryType == "delivery") {
                                        CheckText(input, input.attr("title"), inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ доставки изменился на самовывоз - то предыдущие ошибки доставки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "ADDRESS_HOUSE":
                                    if (model.orderFormData.deliveryType == "delivery") {
                                        CheckText(input, input.attr("title"), inputName);
                                        CheckDigits(input, input.attr("title"), 0, inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ доставки изменился на самовывоз - то предыдущие ошибки доставки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "FULL_FIO":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 1) {
                                        CheckText(input, input.attr("title"), inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "IP_NAME":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 3) {
                                        CheckText(input, input.attr("title"), inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_COMPANY_NAME":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2) {
                                        CheckText(input, input.attr("title"), inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_CITY_LEGAL":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2) {
                                        CheckText(input, input.attr("title"), inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_STREET_LEGAL":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2) {
                                        CheckText(input, input.attr("title"), inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_INDEX_LEGAL":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2) {
                                        CheckText(input, input.attr("title"), inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_HOUSE_LEGAL":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2) {
                                        CheckText(input, input.attr("title"), inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_CITY_FACT":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2 && $("input[name='SAME_ADDRESS']").prop("checked") == false) {
                                        CheckText(input, input.attr("title"), inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_STREET_FACT":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2 && $("input[name='SAME_ADDRESS']").prop("checked") == false) {
                                        CheckText(input, input.attr("title"), inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_INDEX_FACT":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2 && $("input[name='SAME_ADDRESS']").prop("checked") == false) {
                                        CheckText(input, input.attr("title"), inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_HOUSE_FACT":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2 && $("input[name='SAME_ADDRESS']").prop("checked") == false) {
                                        CheckText(input, input.attr("title"), inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "BONUS_TO_PAY":
                                    CheckBonus(input, input.attr("title"));
                                    break;
                                case "IP_INN":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 3) {
                                        CheckDigits(input, input.attr("title"), 12, inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_INN":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2) {
                                        CheckDigits(input, input.attr("title"), 10, inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_KPP":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2) {
                                        CheckDigits(input, input.attr("title"), 9, inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_CURRENT_ACCOUNT":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2) {
                                        CheckDigits(input, input.attr("title"), 20, inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                case "F_BIK":
                                    if (model.orderFormData.paymentType == "cashless" && model.orderFormData.personType == 2) {
                                        CheckDigits(input, input.attr("title"), 9, inputName);
                                    } else {
                                        /* исправляем возможную ошибку */
                                        /* если способ оплаты изменился - то предыдущие ошибки не важны */
                                        var data = {
                                            requiredDataMissing: false,
                                            requiredDataType: inputName
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                    break;
                                }
                            });
                            break;
                        case "deliveryIDMissing":
                            /* проверка способа доставки */
                            if (model.orderFormData.deliveryType == "delivery") {
                                if ($(this).find("#delivery-delivery option:selected").val() == 0) {
                                    var data = {
                                        deliveryIDMissing: true
                                    };
                                    /* onError */
                                    object.trigger(object.customEvents[500], [data]);
                                } else {
                                    var data = {
                                        deliveryIDMissing: false
                                    };
                                    /* onError - ошибка исправлена */
                                    object.trigger(object.customEvents[500], [data]);
                                }
                            } else {
                                if (model.orderFormData.deliveryType == "pickup") {
                                    if ($(this).find("#delivery-pickup option:selected").val() == 0) {
                                        var data = {
                                            deliveryIDMissing: true
                                        };
                                        /* onError */
                                        object.trigger(object.customEvents[500], [data]);
                                    } else {
                                        var data = {
                                            deliveryIDMissing: false
                                        };
                                        /* onError - ошибка исправлена */
                                        object.trigger(object.customEvents[500], [data]);
                                    }
                                }
                            }
                            break;
                        case "onlinePaymentNotAvailable":
                            /* проверка возможности онлайн оплаты */
                            if (model.orderFormData.deliveryType == "pickup") {
                                if ($(this).find("#delivery-pickup option:selected").data("can-pay-online") == 0) {
                                    var data = {
                                        onlinePaymentNotAvailable: true
                                    };
                                    /* onError */
                                    object.trigger(object.customEvents[500], [data]);
                                } else {
                                    var data = {
                                        onlinePaymentNotAvailable: false
                                    };
                                    /* onError - ошибка исправлена */
                                    object.trigger(object.customEvents[500], [data]);
                                }
                            } else {
                                var data = {
                                    onlinePaymentNotAvailable: false
                                };
                                /* onError - ошибка исправлена */
                                object.trigger(object.customEvents[500], [data]);
                            }
                            break;
                        case "paymentCashlessTypeMissing":
                            /* проверка типа безналичной оплаты */
                            if (model.orderFormData.paymentType != "cash") {
                                if ($(this).find("#cashless-type option:selected").val() == 0) {
                                    var data = {
                                        paymentCashlessTypeMissing: true
                                    };
                                    /* onError */
                                    object.trigger(object.customEvents[500], [data]);
                                } else {
                                    var data = {
                                        paymentCashlessTypeMissing: false
                                    };
                                    /* onError - ошибка исправлена */
                                    object.trigger(object.customEvents[500], [data]);
                                }
                            } else {
                                var data = {
                                    paymentCashlessTypeMissing: false
                                };
                                /* onError - ошибка исправлена */
                                object.trigger(object.customEvents[500], [data]);
                            }
                            break;
                        case "personFIDMissing":
                            /* проверка типа плательщика */
                            if (model.orderFormData.paymentType == "cashless") {
                                if ($(this).find("#payment-cashless option:selected").val() == 0) {
                                    var data = {
                                        personFIDMissing: true
                                    };
                                    /* onError */
                                    object.trigger(object.customEvents[500], [data]);
                                } else {
                                    var data = {
                                        personFIDMissing: false
                                    };
                                    /* onError - ошибка исправлена */
                                    object.trigger(object.customEvents[500], [data]);
                                }
                            } else {
                                var data = {
                                    personFIDMissing: false
                                };
                                /* onError - ошибка исправлена */
                                object.trigger(object.customEvents[500], [data]);
                            }
                            break;
                        }
                    } /* #for(var errType in errors) */
                    var top = 0;
                    if (errors.requiredDataMissing || errors.requiredEmailMissing) {
                        if (typeof $(this).find(".required.error").offset() !== "undefined") {
                            top = parseInt($(this).find(".required.error").offset().top - 40);
                        }
                    }
                    if (errors.deliveryIDMissing) {
                        if (model.orderFormData.deliveryType == "delivery" && typeof $(this).find("#delivery-delivery").offset() !== "undefined") {
                            top = parseInt($(this).find("#delivery-delivery").offset().top - 40);
                        } else {
                            if (model.orderFormData.deliveryType == "pickup" && typeof $(this).find("#delivery-pickup").offset() !== "undefined") {
                                top = parseInt($(this).find("#delivery-pickup").offset().top - 40);
                            }
                        }
                    }
                    if (errors.onlinePaymentNotAvailable && typeof $(this).find("#electromoney").offset() !== "undefined") {
                        if (model.orderFormData.paymentType == "electromoney ") {
                            top = parseInt($(this).find("#electromoney").offset().top - 40);
                        }
                    }
                    if (errors.paymentCashlessTypeMissing && typeof $(this).find("#cashless-type").offset() !== "undefined") {
                        top = parseInt($(this).find("#cashless-type").offset().top - 40);
                    }
                    if (errors.personFIDMissing && typeof $(this).find("#payment-cashless").offset() !== "undefined") {
                        if (model.orderFormData.paymentType == "cashless") {
                            top = parseInt($(this).find("#payment-cashless").offset().top - 40);
                        }
                    }
                    /* скролл документа к сообщению об ошибке */
                    if (typeof top !== "undefined" && top > 0) {
                        $("html, body").animate({
                            scrollTop: top
                        }, 500);
                    } else {
                        /* заполняем поля формы данными перед отправкой */
                        /* onSaveOrderForm */
                        var success = {
                            data: false
                        };
                        $(this).trigger(object.customEvents[11], function (result) {
                            /* возвращаем значение-  true */
                            success.data = result;
                        });
                        /* если обработчик события не успеет вернуть данные - форма не будет отправлена */
                        return success.data;
                    }
                    return false;
                });
                /* /submit */
                /* измения в DOM */
                /* общая стоимость всех товаров в списке товаров */
                this.setInvoiceTotalPrice = function () {
                    var invoicePrice = {};
                    /* onGetInvoicePrice */
                    this.objectForm.trigger(object.customEvents[7], [invoicePrice]);
                    this.objectForm.find(".section .invoice .total .price").text(invoicePrice.data + " р.");
                };
                /* общая стоимость всего заказа */
                this.setOrderTotalPrice = function (isDeliveryTypeChanged) {
                    /* обновляем формулу заказа */
                    var formula = this.objectForm.find(".section.total .formula");
                    /* стоимость заказа */
                    var invoice = formula.find(".cart");
                    if (model.orderFormData.invoicePrice == 0) {
                        invoice.hide();
                    } else {
                        invoice.find(".price b").text(model.orderFormData.invoicePrice + " р.");
                        invoice.show();
                    }
                    /* стоимость доставки */
                    var delivery = formula.find(".delivery");
                    if (model.orderFormData.deliveryPrice < 0) {
                        delivery.hide();
                    } else {
                        if (model.orderFormData.deliveryID == 0 && model.orderFormData.deliveryPrice == 0 && isDeliveryTypeChanged === true) {
                            delivery.hide();
                        } else {
                            if (model.orderFormData.deliveryPrice == 0) {
                                delivery.find(".price b").text("Бесплатно");
                            } else {
                                delivery.find(".price b").text(model.orderFormData.deliveryPrice + " р.");
                            }
                            if (model.orderFormData.deliveryType == "delivery") {
                                delivery.find(".text").text("(Доставка)");
                            } else {
                                if (model.orderFormData.deliveryType == "pickup") {
                                    delivery.find(".text").text("(Самовывоз)");
                                }
                            }
                            delivery.show();
                        }
                    }
                    /* количество бонусов */
                    var bonus = formula.find(".bonus");
                    if (model.orderFormData.bonusCountToPay == 0) {
                        bonus.hide();
                    } else {
                        bonus.find(".price b").text(model.orderFormData.bonusCountToPay + " р.");
                        bonus.show();
                        /* дополнительная проверка для поля BONUS_TO_PAY */
                        $("input[name='BONUS_TO_PAY']").val(model.orderFormData.bonusCountToPay);
                    }
                    /* обновляем общую стоимость заказа */
                    this.objectForm.find(".section.total .content .total span").text(model.orderFormData.cartTotal + " р.");
                };
                /* уведомление о стоимости доставки в списке товаров */
                this.showDeliveryNotice = function (price, needToPay) {
                    var message = this.objectForm.find(".invoice .total .info-message");
                    /* стоимость доставки по условиям диапазонов для города */
                    /* -2	- доставка невозможна */
                    /* -1	- доставка будет бесплатной при достижении суммы заказа */
                    /* == 0	- доставка бесплатна */
                    /* > 0	- доставка платная */
                    if (price == 0) {
                        message.find("p").html("Бесплатная доставка");
                        message.show();
                    } else {
                        if ((price == -1 || price > 0) && needToPay > 0) {
                            if (price == -1)
                                message.find("p").html("Добавьте товаров еще на <b>" + needToPay + " р</b> и ваш заказ мы доставим бесплатно.");
                            else
                                message.find("p").html("Добавьте товаров еще на <b>" + needToPay + " р</b> и мы доставим заказ всего за " + price + "р.");
                            message.show();
                        } else
                            message.hide();
                    }
                    message.find(".icon").html("&nbsp;"); /* костыль */
                };
                /* уведомление о стоимости доставки во вкладке Способ получения товара - Доставка */
                this.showDeliveryMessage = function () {
                    var select = this.objectForm.find("#DELIVERY_TYPE .page.one .select:not(label.select)");
                    var message = select.children(".comment");
                    var calendar = select.children(".calendar");
                    var error = select.children(".error");
                    var check = select.children(".check");
                    /* поля адреса */
                    var addressFields = this.objectForm.find("#DELIVERY_TYPE .page.one label:not(.select), #DELIVERY_TYPE .page.one .delivery-address");
                    var textMessage = "";
                    if (model.orderFormData.deliveryDate != 0) {
                        if (model.orderFormData.deliveryDate == "завтра") {
                            textMessage += " Срок доставки: <span>" + model.orderFormData.deliveryDate + "</span>. ";
                        } else {
                            textMessage += " Доставка: <span>" + model.orderFormData.deliveryDate + "</span>. ";
                        }
                        message.removeClass("date-unavailable");
                    } else {
                        textMessage += " Точные сроки доставки вам сообщит оператор после оформления заказа. ";
                        message.addClass("date-unavailable");
                    }
                    if (model.orderFormData.deliveryID == 64) /* бесплатная доставка */ {
                        textMessage += " <span class='free'>Бесплатная доставка</span> ";
                    } else {
                        if (model.orderFormData.deliveryPrice > 0) {
                            textMessage += " Cтоимость: <span><b>" + model.orderFormData.deliveryPrice + "&nbsp;р</b></span>. ";
                        } else {
                            textMessage += " Точную стоимость доставки вам сообщит оператор после оформления заказа. ";
                        }
                    }
                    if (model.orderFormData.deliveryDate != 0) {
                        textMessage += "  ";
                        textMessage += "<span class='icon'>";
                        textMessage += "<div class='fixed-wrap'>&nbsp;</div>";
                        textMessage += "<div class='message'>";
                        textMessage += "<span class='arrow'>&nbsp;</span>";
                        textMessage += "Вы можете изменить дату доставки, используя календарь.";
                        textMessage += "</div>";
                        textMessage += "</span>";
                        textMessage += "  ";
                    }
                    if (model.orderFormData.deliveryDate == 0 && (model.orderFormData.deliveryPrice == 0 || model.orderFormData.deliveryPrice == -1)) {
                        textMessage = " Точные сроки (и стоимость) доставки вам сообщит оператор после оформления заказа. ";
                    }
                    if (model.orderFormData.deliveryID == 0) {
                        /* если способ доставки не выбран - сообщения не выводятся */
                        textMessage = "";
                    }
                    if (textMessage != "") {
                        message.html(textMessage);
                        message.show();
                        if (model.orderFormData.deliveryDateStr != 0) {
                            calendar.show();
                        }
                        check.show();
                        if (model.orderFormData.deliveryDate == 0 && (model.orderFormData.deliveryPrice == 0 || model.orderFormData.deliveryPrice == -1)) {
                            check.hide();
                        }
                        error.hide();
                        addressFields.show();
                    } else {
                        message.hide();
                        calendar.hide();
                        check.hide();
                        error.hide();
                        addressFields.hide();
                    }
                    /* проверяем количество способов доставки */
                    if (select.find("option").length == 1) {
                        /* выводим название способа доставки */
                        var deliveryName = select.find(".select select option:selected").text();
                        if (deliveryName != "") {
                            message.prepend("<b>" + deliveryName + "</b><br>");
                            /* если существует всего 1 способ доставки - скрываем select */
                            select.children(".select").hide();
                            check.hide();
                            /* календарь */
                            if (calendar.css("display") == "block") {
                                calendar.addClass("margin-top");
                            }
                        }
                    } else {
                        select.children(".select").show();
                        if (calendar.hasClass("margin-top")) {
                            calendar.removeClass("margin-top");
                        }
                    }
                };
                /* показать сообщение об ошибке Доставки */
                this.showDeliveryError = function () {
                    this.objectForm.find("#DELIVERY_TYPE .page.one .select .comment").hide();
                    this.objectForm.find("#DELIVERY_TYPE .page.one .select .calendar").hide();
                    this.objectForm.find("#DELIVERY_TYPE .page.one .select .check").hide();
                    this.objectForm.find("#DELIVERY_TYPE .page.one label:not(.select), #DELIVERY_TYPE .page.one .delivery-address").hide();
                    this.objectForm.find("#DELIVERY_TYPE .page.one .select .error").show();
                };
                /* уведомление про самовывоз */
                this.showPickupMessage = function () {
                    var select = this.objectForm.find("#DELIVERY_TYPE .page.two .select:not(label.select)");
                    var pickupDetails = this.objectForm.find("#DELIVERY_TYPE .page.two ul.pickup-details li");
                    var message = select.children(".comment");
                    var calendar = select.children(".calendar");
                    var error = select.children(".error");
                    var check = select.children(".check");
                    var textMessage = "";
                    if (model.orderFormData.deliveryID != 0) {
                        if (model.orderFormData.pickupDate != 0) {
                            textMessage += " Самовывоз: <span>" + model.orderFormData.pickupDate + "</span>. ";
                            message.removeClass("date-unavailable");
                        } else {
                            textMessage += " Точные сроки самовывоза не известны. ";
                            message.addClass("date-unavailable");
                        }
                        if (model.orderFormData.deliveryPrice > 0) {
                            textMessage += " Cтоимость доставки до пункта выдачи: <span><b>" + model.orderFormData.deliveryPrice + "&nbsp;р</b></span>. ";
                        } else {
                            if (model.orderFormData.deliveryPrice == 0) {
                                textMessage += " <span class='free'>Бесплатный самовывоз</span> ";
                            }
                        }
                        if (model.orderFormData.pickupDate != 0) {
                            textMessage += "  ";
                            textMessage += "<span class='icon'>";
                            textMessage += "<div class='fixed-wrap'>&nbsp;</div>";
                            textMessage += "<div class='message'>";
                            textMessage += "<span class='arrow'>&nbsp;</span>";
                            textMessage += "Вы можете изменить дату самовывоза, используя календарь.";
                            textMessage += "</div>";
                            textMessage += "</span>";
                            textMessage += "  ";
                        }
                    }
                    if (textMessage != "") {
                        message.html(textMessage);
                        message.show();
                        if (model.orderFormData.pickupDateStr != 0) {
                            calendar.show();
                        }
                        check.show();
                        error.hide();
                    } else {
                        message.hide();
                        calendar.hide();
                        check.hide();
                        error.hide();
                    }
                    /* проверяем количество способов доставки */
                    if (select.find("option").length == 1) {
                        /* выводим название пункта выдачи */
                        var pickpointName = select.find(".select select option:selected").text();
                        if (pickpointName != "") {
                            message.prepend("Пункт выдачи <b>" + pickpointName + "</b><br>");
                            /* если существует всего 1 пункт самовывоза - скрываем select */
                            select.children(".select").hide();
                            check.hide();
                            /* календарь */
                            if (calendar.css("display") == "block") {
                                calendar.addClass("margin-top");
                            }
                        }
                        /* показываем информацию о пункте выдачи */
                        if (pickupDetails.length == 1 && typeof pickupDetails[0] !== "undefined") {
                            $(pickupDetails[0]).show();
                        }
                    } else {
                        select.children(".select").show();
                        if (calendar.hasClass("margin-top")) {
                            calendar.removeClass("margin-top");
                        }
                    }
                };
                /* показать сообщение об ошибке Самовывоза */
                this.showPickupError = function () {
                    this.objectForm.find("#DELIVERY_TYPE .page.two .select .comment").hide();
                    this.objectForm.find("#DELIVERY_TYPE .page.two .select .calendar").hide();
                    this.objectForm.find("#DELIVERY_TYPE .page.two .select .check").hide();
                    var error = this.objectForm.find("#DELIVERY_TYPE .page.two .select .error");
                    var errors = {};
                    /* onGetOrderFormErrors */
                    this.objectForm.trigger(this.objectForm.customEvents[10], [errors]);
                    errors = errors.data;
                    if(errors.deliveryIDMissing === true) {
                        error.text("Выберите пункт выдачи товара");
                    } else {
                        if(errors.onlinePaymentNotAvailable === true || errors.offlineCardPaymentNotAvailable === true) {
                            this.objectForm.find("#DELIVERY_TYPE .page.two .select select option:selected").removeAttr("selected");
                            this.objectForm.find("#DELIVERY_TYPE .page.two ul.pickup-details li").removeClass("active");
                            if (errors.onlinePaymentNotAvailable === true) {
                                error.text("Оплата картой в онлайне и последующая выдача заказа в этом пункте НЕВОЗМОЖНА. Выберите другой способ оплаты.");
                            } else {
                                if(errors.offlineCardPaymentNotAvailable === true) {
                                    error.text("Оплата картой при получении в этом пункте НЕВОЗМОЖНА. Выберите другой способ оплаты.");
                                }
                            }
                            this.objectForm.find("#cashless-type option:selected").removeAttr("selected");
                            this.objectForm.find(".card-offline").hide();
                            this.objectForm.find(".card-online").hide();
                            this.objectForm.find(".bank-transfer").hide();
                            var data = {
                                paymentCashlessTypeMissing: true
                            };
                            /* onError */
                            object.trigger(object.customEvents[500], [data]);
                        }
                    }
                    error.show();
                };
                /* перекрытие формы белым слоем */
                this.showCover = function () {
                    this.objectForm.find(".section:not(.first) .cover").show();
                };
                /* показать поля для банковского перевода */
                this.showPaymentCashless = function (data) {
                    var selectCashlessType = this.objectForm.find("#PAYMENT_TYPE .page.two .select.cashless-type");
                    var checkCashlessType = selectCashlessType.find(".check");
                    var errorCashlessType = selectCashlessType.find(".error");

                    var selectPersonType = this.objectForm.find("#PAYMENT_TYPE .page.two .bank-transfer .select.person");
                    var checkPersonType = selectPersonType.find(".check");
                    var errorPersonType = selectPersonType.find(".error");

                    var cardOffline = this.objectForm.find("#PAYMENT_TYPE .page.two .card-offline");
                    var cardOnline = this.objectForm.find("#PAYMENT_TYPE .page.two .card-online");
                    var cardBankTransfer = this.objectForm.find("#PAYMENT_TYPE .page.two .bank-transfer");

                    this.objectForm.find(".legal-entity").hide();

                    if (typeof data !== "undefined") {
                        if (typeof data.paymentCashlessType !== "undefined") {
                            /* тип безналичной оплаты */
                            switch (data.paymentCashlessType) {
                            case 0:
                                /* не выбран */
                                cardOffline.hide();
                                cardOnline.hide();
                                cardBankTransfer.hide();
                                checkCashlessType.hide();
                                var data = {
                                    paymentCashlessTypeMissing: true
                                };
                                /* onError */
                                object.trigger(object.customEvents[500], [data]);
                                break;
                            case 1:
                                /* Оплата картой при получении */
                                cardOffline.show();
                                cardOnline.hide();
                                cardBankTransfer.hide();
                                checkCashlessType.show();
                                errorCashlessType.hide();
                                break;
                            case 2:
                                /* Оплата картой онлайн */
                                cardOnline.show();
                                cardOffline.hide();
                                cardBankTransfer.hide();
                                checkCashlessType.show();
                                errorCashlessType.hide();
                                break;
                            case 3:
                                /* Банковский перевод */
                                cardOffline.hide();
                                cardOnline.hide();
                                cardBankTransfer.show();
                                checkCashlessType.show();
                                errorCashlessType.hide();
                                /* сбрасываем тип плательщика */
                                var data = {
                                    personType: 0
                                };
                                /* onChangePaymentType */
                                $(this).trigger(object.customEvents[2], [data]);
                                break;
                            }
                        }
                        if (typeof data.personType !== "undefined") {
                            switch (data.personType) {
                            case 0:
                                /* Не выбран */
                                this.objectForm.find(".legal-entity").hide();
                                this.objectForm.find("#PAYMENT_TYPE .page.two .bank-transfer .select .check").hide();
                                selectPersonType.find(".select select option").removeAttr("selected");
                                /*
                                var data = {
                                    personFIDMissing: true
                                };
                                // onError
                                object.trigger(object.customEvents[500], [data]);
                                */
                                break;
                            case 1:
                                /* Физическое лицо */
                                this.objectForm.find(".legal-entity").hide();
                                this.objectForm.find(".legal-entity.physical-person").show();
                                checkPersonType.show();
                                errorPersonType.hide();
                                break;
                            case 2:
                                /* Юридическое лицо */
                                this.objectForm.find(".legal-entity").show();
                                this.objectForm.find(".legal-entity.physical-person").hide();
                                this.objectForm.find(".legal-entity.individual").hide();
                                this.objectForm.find(".legal-entity.actual-address").hide();
                                checkPersonType.show();
                                errorPersonType.hide();
                                break;
                            case 3:
                                /* Индивидуальный предприниматель */
                                this.objectForm.find(".legal-entity").hide();
                                this.objectForm.find(".legal-entity.individual").show();
                                checkPersonType.show();
                                errorPersonType.hide();
                                break;
                            }
                        }
                        if (data.showActualAddress === false) {
                            /* Юридическое лицо - показываем поля фактического адреса */
                            this.objectForm.find(".legal-entity").show();
                            this.objectForm.find(".legal-entity.physical-person").hide();
                            this.objectForm.find(".legal-entity.individual").hide();
                        } else {
                            if (data.showActualAddress === true) {
                                /* Юридическое лицо - скрываем поля фактического адреса */
                                this.objectForm.find(".legal-entity").show();
                                this.objectForm.find(".legal-entity.physical-person").hide();
                                this.objectForm.find(".legal-entity.individual").hide();
                                this.objectForm.find(".legal-entity.actual-address").hide();
                            }
                        }
                    }
                };
                /* тип безналичной оплаты не выбран */
                this.showPaymentCashlessTypeError = function (data) {
                    this.objectForm.find("#PAYMENT_TYPE .page.two .select.cashless-type .check").hide();
                    this.objectForm.find("#PAYMENT_TYPE .page.two .select.cashless-type .error").show();
                };
                /* тип плательщика не выбран */
                this.showPaymentCashlessError = function (data) {
                    this.objectForm.find("#PAYMENT_TYPE .page.two .bank-transfer .select .check").hide();
                    this.objectForm.find("#PAYMENT_TYPE .page.two .bank-transfer .select .error").show();
                };
                /* обработка партнерки */
                this.sendRitorno = function (product) {
                    $("body").append("<img src='//pixel.ritorno.ru/pixel?pid=4957&oid=" + product + "&basket_action=del&sid=118' width='1' height='1' alt=''>");
                };
                /* перезагрузка страницы формы оформления заказа */
                this.reloadOrderForm = function () {
                    if (this.objectForm.find(".section .invoice").length > 0) {
                        window.location.reload(true);
                    }
                };
                /* функции */
                function CheckText(obj, errorMessage, objName) /* проверка на пустоту значения */ {
                    if (obj.val() == "" || obj.val() == errorMessage || obj.val() == "+7 (___) ___-__-__") {
                        obj.val(errorMessage);
                        obj.addClass("error");
                        var data = {
                            requiredDataMissing: true,
                            requiredDataType: objName
                        };
                        /* onError */
                        object.trigger(object.customEvents[500], [data]);
                        return false;
                    }
                    var data = {
                        requiredDataMissing: false,
                        requiredDataType: objName
                    };
                    /* onError - ошибка исправлена */
                    object.trigger(object.customEvents[500], [data]);
                    obj.removeClass("error");
                    return true;
                }

                function CheckEmail(obj) /* проверка на наличие символов @ и . */ {
                        var value = obj.val();
                        var indexOfDog = value.indexOf("@");
                        var indexOfDot = value.indexOf(".");
                        if (indexOfDog <= 0 ||
                            indexOfDot < 1 ||
                            indexOfDog == value.length - 1 ||
                            indexOfDot == value.length - 1 ||
                            indexOfDot == indexOfDog + 1) {
                            obj.addClass("error");
                            var data = {
                                requiredEmailMissing: true
                            };
                            /* onError */
                            object.trigger(object.customEvents[500], [data]);
                            return false;
                        }
                        var data = {
                            requiredEmailMissing: false
                        };
                        /* onError - ошибка исправлена */
                        object.trigger(object.customEvents[500], [data]);
                        obj.removeClass("error");
                        return true;
                    }
                    /* CheckDigits - только цифры */
                    /* digitCount - количество цифр */
                function CheckDigits(obj, errorMessage, digitCount, objName) {
                        var value = obj.val();
                        if (value != errorMessage) {
                            /* только цифры */
                            value = value.replace(new RegExp("[^0-9]", 'g'), "");
                            if (typeof digitCount !== "undefined" && digitCount > 0) {
                                /* проверка на точное количество цифр */
                                if (value.length != digitCount) {
                                    obj.addClass("error");
                                    var data = {
                                        requiredDataMissing: true,
                                        requiredDataType: objName
                                    };
                                    /* onError */
                                    object.trigger(object.customEvents[500], [data]);
                                    if (value.length == 0) {
                                        obj.val(errorMessage);
                                    } else {
                                        obj.val(value);
                                    }
                                    return false;
                                }
                            } else {
                                if (value.length == 0) {
                                    var data = {
                                        requiredDataMissing: true,
                                        requiredDataType: objName
                                    };
                                    /* onError */
                                    object.trigger(object.customEvents[500], [data]);
                                    obj.addClass("error");
                                    obj.val(errorMessage);
                                    return false;
                                }
                            }
                            var data = {
                                requiredDataMissing: false,
                                requiredDataType: objName
                            };
                            /* onError - ошибка исправлена */
                            object.trigger(object.customEvents[500], [data]);
                            obj.val(value);
                            obj.removeClass("error");
                            return true;
                        }
                        return false;
                    }
                    /* CheckBonus - проверка бонусов */
                function CheckBonus(obj, errorMessage) {
                        /* можно потратить <= количество бонусов */
                        var value = obj.val();
                        /* только цифры */
                        value = value.replace(new RegExp("[^0-9]", 'g'), "");
                        if (value.length == 0) {
                            obj.val(0);
                        } else {
                            var bonusCount = {};
                            /* onGetBonusCount  */
                            $(this).trigger(object.customEvents[8], [bonusCount]);
                            bonusCount = bonusCount.data;
                            var bonusCountCanPay = {};
                            /* onGetBonusCountCanPay */
                            $(this).trigger(object.customEvents[9], [bonusCountCanPay]);
                            bonusCountCanPay = bonusCountCanPay.data;
                            /* нельзя тратить больше бонусов, чем разрешено и чем есть в наличии */
                            if (value > bonusCountCanPay) {
                                value = bonusCountCanPay;
                            }
                            if (value > bonusCount) {
                                value = bonusCount;
                            }
                            value = parseInt(value);
                            obj.val(value);
                            var data = {
                                bonusCountToPay: value
                            };
                            /* onChangeBonusCount - изменение бонусов */
                            $(this).trigger(object.customEvents[3], [data]);
                        }
                    }
                    /* установка текущей даты и ограничений для календаря */
                function SetUpCalendar(deliveryType) {
                    /* максимальная дата для календаря - +1 неделя от предполагаемой даты доставки */
                    var calendarMaxDate = {};
                    calendarMaxDate = DateParseToObj(model.orderFormData.deliveryDateStr);
                    /* месяц считается от нуля */
                    calendarMaxDate.month -= 1;
                    /* прибавляем к дате дня число 7 - 1 неделя */
                    calendarMaxDate.day += 7;
                    if (calendarMaxDate.month == 1) {
                        /* в феврале 28 дней */
                        if (calendarMaxDate.day > 28) {
                            /* корректируем месяц */
                            calendarMaxDate.day -= 28;
                            calendarMaxDate.month++;
                        }
                    } else {
                        if (calendarMaxDate.day > 31) {
                            /* корректируем месяц */
                            calendarMaxDate.day -= 31;
                            calendarMaxDate.month++;
                        }
                    }
                    if (calendarMaxDate.month > 11) {
                        /* корректируем год */
                        calendarMaxDate.month -= 11;
                        calendarMaxDate.year++;
                    }
                    /* аргументы - year, month, day, hour, minute, second, millisecond */
                    calendarMaxDate = new Date(calendarMaxDate.year, calendarMaxDate.month, calendarMaxDate.day);
                    switch (model.orderFormData.deliveryType) {
                    case "delivery":
                        /* устанавливаем текущую дату и ограничение по датам */
                        var input = object.find("#DELIVERY_TYPE .page.one .calendar input");
                        if (model.orderFormData.deliveryDateStrUser != 0) {
                            input.datepicker("setDate", model.orderFormData.deliveryDateStrUser);
                        } else {
                            input.datepicker("setDate", model.orderFormData.deliveryDateStr);
                        }
                        input.datepicker("option", "minDate", model.orderFormData.deliveryDateStr);
                        input.datepicker("option", "maxDate", calendarMaxDate);
                        break;
                    case "pickup":
                        /* устанавливаем текущую дату и ограничение по датам */
                        var input = object.find("#DELIVERY_TYPE .page.two .calendar input");
                        if (model.orderFormData.pickupDateStrUser != 0) {
                            input.datepicker("setDate", model.orderFormData.pickupDateStrUser);
                        } else {
                            input.datepicker("setDate", model.orderFormData.pickupDateStr);
                        }
                        input.datepicker("option", "minDate", model.orderFormData.pickupDateStr);
                        input.datepicker("option", "maxDate", calendarMaxDate);
                        break;
                    }
                };
                /*
                function HideOnlinePaymentError() {
                    object.find("#PAYMENT_TYPE .titles .electromoney").show();
                }
                */
                function SetBackgroundSize() {
                    var background = object.find(".section .background");
                    if (background.length > 0) {
                        var sectionWidth = $(background[0]).parent().width();
                        var viewportWidth = $(window).width();
                        if (viewportWidth > sectionWidth) {
                            var offset = Math.floor((viewportWidth - sectionWidth) / 2) * (-1);
                            background.each(function () {
                                $(this).css({
                                    "left": offset
                                });
                                $(this).css({
                                    "right": offset
                                });
                            });
                        }
                    }
                }

                function DateParseToObj(date) {
                    var obj = date.split(".");
                    obj = {
                        day: parseInt(obj[0]),
                        month: parseInt(obj[1]),
                        year: parseInt(obj[2])
                    };
                    return obj;
                }
            };
            /* ************************************************************* */
            /* / View */
            /* ************************************************************* */
            /* ************************************************************* */
            /* # Controller */
            /* ************************************************************* */
            MVC.Controller = function (model, view) {
                /* инициализация переменных */
                InitOrderForm();
                /* обработчики пользовательских событий */
                /* пользовательские события работают только со значениями параметров orderFormData */
                /* onChangeInvoicePrice - изменение цены товаров */
                view.objectForm.on(view.objectForm.customEvents[0], function (event, priceChange) {
                    /* обработка данных - Model */
                    if (typeof priceChange === "number") model.orderFormData.invoicePrice += priceChange;
                    /* уведомление - View */
                    view.setInvoiceTotalPrice(); /* обновляем общую стоимость всех товаров */
                    view.showCover();
                    /* стоимость доставки могла измениться */
                    /* 1 : onChangeDeliveryPrice - изменение стоимости доставки */
                    view.objectForm.trigger(view.objectForm.customEvents[1]);
                });
                /* onChangeDeliveryPrice - изменение стоимости доставки */
                view.objectForm.on(view.objectForm.customEvents[1], function (event, data) {
                    /* изменился тип доставки */
                    if (typeof data !== "undefined") {
                        /* обработка данных - Model */
                        if (typeof data.deliveryType !== "undefined") {
                            model.orderFormData.deliveryType = data.deliveryType;
                        }
                        /* изменилась дата доставки */
                        if (typeof data.newDateStr !== "undefined") {
                            /* изменение даты после календаря */
                            var date = data.newDateStr;
                            var dateParsed = DateParse(data.newDateStr);
                            switch (model.orderFormData.deliveryType) {
                            case "delivery":
                                model.orderFormData.deliveryDate = dateParsed;
                                model.orderFormData.deliveryDateStrUser = date;
                                break;
                            case "pickup":
                                model.orderFormData.pickupDate = dateParsed;
                                model.orderFormData.pickupDateStrUser = date;
                                break;
                            }
                        }
                        /* уведомление - View */
                        /* способ оплаты мог измениться */
                        /* 2 : onChangePaymentType - изменение способа оплаты */
                        view.objectForm.trigger(view.objectForm.customEvents[2], [data]);
                    } else {
                        /* обработка данных - Model */
                        /* уведомление - View */
                        /* способ оплаты мог измениться */
                        /* 2 : onChangePaymentType - изменение способа оплаты */
                        view.objectForm.trigger(view.objectForm.customEvents[2]);
                    }
                });
                /* onChangePaymentType - изменение способа оплаты */
                view.objectForm.on(view.objectForm.customEvents[2], function (event, data) {
                    /* изменился тип доставки / тип оплаты / тип плательщика / поля фактического адреса */
                    if (typeof data !== "undefined") {
                        /* обработка данных - Model */
                        if (typeof data.paymentType !== "undefined") {
                            model.orderFormData.paymentType = data.paymentType;
                        }
                        if (typeof data.personType !== "undefined") {
                            model.orderFormData.personType = data.personType;
                        }
                        if (typeof data.paymentCashlessType !== "undefined") {
                            model.orderFormData.paymentCashlessType = data.paymentCashlessType;
                        }
                        /* уведомление - View */
                        /* вычисление итоговой стоимости */
                        /* 4 : onChangeTotalPrice - изменение итоговой стоимости */
                        view.objectForm.trigger(view.objectForm.customEvents[4], [data]);
                    } else {
                        /* обработка данных - Model */
                        /* уведомление - View */
                        /* вычисление итоговой стоимости */
                        /* 4 : onChangeTotalPrice - изменение итоговой стоимости */
                        view.objectForm.trigger(view.objectForm.customEvents[4]);
                    }
                });
                /* onChangeBonusCount - изменение бонусов */
                view.objectForm.on(view.objectForm.customEvents[3], function (event, data) {
                    if (typeof data !== "undefined") {
                        /* обработка данных - Model */
                        if (typeof data.bonusCountToPay !== "undefined") {
                            model.orderFormData.bonusCountToPay = data.bonusCountToPay;
                        }
                        /* уведомление - View */
                        /* вычисление итоговой стоимости */
                        /* 4 : onChangeTotalPrice - изменение итоговой стоимости */
                        view.objectForm.trigger(view.objectForm.customEvents[4], [data]);
                    } else {
                        /* 4 : onChangeTotalPrice - изменение итоговой стоимости */
                        view.objectForm.trigger(view.objectForm.customEvents[4]);
                    }
                });
                /* onChangeTotalPrice - изменение итоговой стоимости */
                view.objectForm.on(view.objectForm.customEvents[4], function (event, data) {
                    /* изменился тип доставки */
                    if (typeof data !== "undefined") {
                        /* обработка данных - Model */
                        SetCartTotal(true, data);
                        /* уведомление - View */
                    } else {
                        /* обработка данных - Model */
                        SetCartTotal(true);
                        /* уведомление - View */
                    }
                });
                /* ********************************************************* */
                /* onGetDeliveryType - получить тип доставки */
                view.objectForm.on(view.objectForm.customEvents[5], function (event, returnObj) {
                    returnObj.data = model.orderFormData.deliveryType;
                });
                /* onGetPaymentType - получить тип оплаты */
                view.objectForm.on(view.objectForm.customEvents[6], function (event, returnObj) {
                    returnObj.data = model.orderFormData.paymentType;
                });
                /* onGetInvoicePrice - получить стоимость товаров */
                view.objectForm.on(view.objectForm.customEvents[7], function (event, returnObj) {
                    returnObj.data = model.orderFormData.invoicePrice;
                });
                /* onGetBonusCount - получить количество бонусов */
                view.objectForm.on(view.objectForm.customEvents[8], function (event, returnObj) {
                    returnObj.data = model.orderFormData.bonusCount;
                });
                /* onGetBonusCountCanPay - получить количество бонусов, разрешенных к оплате */
                view.objectForm.on(view.objectForm.customEvents[9], function (event, returnObj) {
                    returnObj.data = model.orderFormData.bonusCountCanPay;
                });
                /* onGetOrderFormErrors - получить данные об ошибках */
                view.objectForm.on(view.objectForm.customEvents[10], function (event, returnObj) {
                    returnObj.data = model.orderFormErrors;
                });
                /* onGetPersonType - получить тип плательщика */
                view.objectForm.on(view.objectForm.customEvents[13], function (event, returnObj) {
                    returnObj.data = model.orderFormData.personType;
                });
                /* onGetPaymentCashlessType - получить тип безналичной оплаты */
                view.objectForm.on(view.objectForm.customEvents[14], function (event, returnObj) {
                    returnObj.data = model.orderFormData.paymentCashlessType;
                });
                /* onSaveOrderForm */
                view.objectForm.on(view.objectForm.customEvents[11], function (event, callback) {
                    var result = SaveOrderForm();
                    if (typeof callback === "function") {
                        callback(result);
                    }
                });
                /* onSendPartnerData - отправить данные для партнерки */
                view.objectForm.on(view.objectForm.customEvents[12], function (event, data) {
                    if (typeof data !== "undefined") {
                        if (typeof data.partner !== "undefined") {
                            switch (data.partner) {
                            case "Ritorno":
                                view.sendRitorno(data.product);
                                break;
                            }
                        }
                    }
                });
                /* ********************************************************* */
                /* onError */
                view.objectForm.on(view.objectForm.customEvents[500], function (event, data) { 
                    /* обработка данных - Model */
                    if (typeof data !== "undefined") {
                        if (typeof data.requiredDataMissing !== "undefined") {
                            /* создание ошибки */
                            if (data.requiredDataMissing == true) {
                                model.orderFormErrors.requiredDataMissing = data.requiredDataMissing;
                                /* тип поля с ошибкой */
                                model.orderFormErrors.requiredDataType.push(data.requiredDataType);
                            } else {
                                if (data.requiredDataMissing == false) {
                                    /* исправление ошибки */
                                    for (var i = 0; i < model.orderFormErrors.requiredDataType.length; i++) {
                                        if (model.orderFormErrors.requiredDataType[i] == data.requiredDataType) {
                                            delete model.orderFormErrors.requiredDataType[i];
                                        }
                                    }
                                    /* предполагаем, что все ошибки исправлены */
                                    model.orderFormErrors.requiredDataMissing = false;
                                    for (var i = 0; i < model.orderFormErrors.requiredDataType.length; i++) {
                                        /* если ошибки остались */
                                        if (typeof model.orderFormErrors.requiredDataType[i] !== "undefined") {
                                            model.orderFormErrors.requiredDataMissing = true;
                                        }
                                    }
                                }
                            }
                        }
                        if (typeof data.requiredEmailMissing !== "undefined") {
                            model.orderFormErrors.requiredEmailMissing = data.requiredEmailMissing;
                        }
                        if (typeof data.deliveryIDMissing !== "undefined") {
                            model.orderFormErrors.deliveryIDMissing = data.deliveryIDMissing;
                            if (model.orderFormErrors.deliveryIDMissing === true) {
                                if (model.orderFormData.deliveryType == "delivery") {
                                    view.showDeliveryError();
                                } else {
                                    if (model.orderFormData.deliveryType == "pickup") {
                                        view.showPickupError();
                                    }
                                }
                            }
                        }
                        if (typeof data.onlinePaymentNotAvailable !== "undefined") {
                            model.orderFormErrors.onlinePaymentNotAvailable = data.onlinePaymentNotAvailable;
                            if (model.orderFormErrors.onlinePaymentNotAvailable === true) {
                                if (model.orderFormData.deliveryType == "pickup") {
                                    if (model.orderFormData.paymentType == "electromoney")
                                        view.showPickupError();
                                }
                            }
                        }
                        if (typeof data.offlineCardPaymentNotAvailable !== "undefined") {
                            model.orderFormErrors.offlineCardPaymentNotAvailable = data.offlineCardPaymentNotAvailable;
                            if (model.orderFormErrors.offlineCardPaymentNotAvailable === true) {
                                if (model.orderFormData.deliveryType == "pickup") {
                                    if (model.orderFormData.paymentType == "cardoffline") {
                                        view.showPickupError();
                                    }
                                }
                            }
                        }                     
                        if (typeof data.personFIDMissing !== "undefined") {
                            model.orderFormErrors.personFIDMissing = data.personFIDMissing;
                            if (model.orderFormErrors.personFIDMissing === true) {
                                view.showPaymentCashlessError();
                            }
                        }
                        if (typeof data.paymentCashlessTypeMissing !== "undefined") {
                            model.orderFormErrors.paymentCashlessTypeMissing = data.paymentCashlessTypeMissing;
                            if (model.orderFormErrors.paymentCashlessTypeMissing === true) {
                                view.showPaymentCashlessTypeError();
                            }
                        }
                    }
                });
                /* функции */
                function InitOrderForm() {
                        /* обработка данных - Model */
                        /* данные из скрытых полей */
                        model.orderFormData.invoicePrice = parseInt(view.objectForm.find("input[name='FINAL_BASKET_PRICE']").val());
                        if (isNaN(model.orderFormData.invoicePrice)) model.orderFormData.invoicePrice = 0;
                        model.orderFormData.deliveryType = view.objectForm.find("input[name='DELIVERY_TYPE']").val();
                        model.orderFormData.deliveryID = parseInt(view.objectForm.find("input[name='DELIVERY_ID']").val());
                        if (isNaN(model.orderFormData.deliveryID)) model.orderFormData.deliveryID = 0;
                        model.orderFormData.deliveryCityIsFree = view.objectForm.find("input[name='ORDER_FREE_DELIVERY_CITY']").val();
                        model.orderFormData.deliveryDate = view.objectForm.find("input[name='ADDRESS_DELIVERY_DATE']").val();
                        model.orderFormData.deliveryDateStr = view.objectForm.find("input[name='ADDRESS_DELIVERY_DATE_STR']").val();
                        /* дата самовывоза = дате доставки */
                        model.orderFormData.pickupDate = model.orderFormData.deliveryDate;
                        model.orderFormData.pickupDateStr = model.orderFormData.deliveryDateStr;
                        if (typeof cityDeliveryRules !== "undefined") model.orderFormData.deliveryRules = cityDeliveryRules;
                        model.orderFormData.paymentType = view.objectForm.find("input[name='PAYMENT_TYPE']").val();
                        model.orderFormData.paymentElectroMoney = view.objectForm.find("input[name='ELECTRO_MONEY_TYPE']").val();
                        model.orderFormData.personType = parseInt(view.objectForm.find("input[name='PERSON_TYPE']").val());
                        if (isNaN(model.orderFormData.personType)) model.orderFormData.personType = 0;
                        model.orderFormData.personLocationID = parseInt(view.objectForm.find("input[name='LOCATION_ID']").val());
                        if (isNaN(model.orderFormData.personLocationID)) model.orderFormData.personLocationID = 0;
                        model.orderFormData.personFID = parseInt(view.objectForm.find("input[name='fid']").val());
                        if (isNaN(model.orderFormData.personFID)) model.orderFormData.personFID = 0;
                        model.orderFormData.cartTotalNoDiscounts = parseInt(view.objectForm.find("input[name='FINAL_BASKET_PRICE_NO_DISCOUNTS']").val());
                        if (isNaN(model.orderFormData.cartTotalNoDiscounts)) model.orderFormData.cartTotalNoDiscounts = 0;
                        model.orderFormData.bonusCount = parseInt(view.objectForm.find("input[name='USER_BONUS_COUNT']").val());
                        if (isNaN(model.orderFormData.bonusCount)) model.orderFormData.bonusCount = 0;
                        model.orderFormData.bonusCountCanPay = parseInt(view.objectForm.find("input[name='CAN_PAY_BONUS_COUNT']").val());
                        if (isNaN(model.orderFormData.bonusCountCanPay)) model.orderFormData.bonusCountCanPay = 0;
                        model.orderFormData.bonusCountToPay = parseInt(view.objectForm.find("input[name='BONUS_TO_PAY']").val());
                        if (isNaN(model.orderFormData.bonusCountToPay)) model.orderFormData.bonusCountToPay = 0;
                        /* проверка количества бонусов */
                        if (model.orderFormData.bonusCountToPay > model.orderFormData.bonusCountCanPay) {
                            model.orderFormData.bonusCountToPay = model.orderFormData.bonusCountCanPay;
                        }
                        if (model.orderFormData.bonusCountToPay > model.orderFormData.bonusCount) {
                            model.orderFormData.bonusCountToPay = model.orderFormData.bonusCount;
                        }
                        /* данные из полей формы */
                        InitFromFields();
                        /* проверка заполненности значений */
                        for (var field in model.orderFormData) {
                            if (typeof model.orderFormData[field] === "undefined") model.orderFormData[field] = 0;
                        }
                        /* разный вызов SetCartTotal в зависимости от количества способов доставки / самовывоза */
                        if (model.orderFormData.deliveryType == "delivery" && view.objectForm.find("#delivery-delivery option").length == 1) {
                            SetCartTotal(true);
                        } else {
                            if (model.orderFormData.deliveryType == "pickup" && view.objectForm.find("#delivery-pickup option") == 1)
                                SetCartTotal(true);
                            else
                                SetCartTotal();
                        }
                    }
                    /* получаем данные из полей формы */
                function InitFromFields() {
                        if (model.orderFormData.deliveryType == "delivery") /* доставка */ {
                            model.orderFormData.deliveryPrice = parseInt(view.objectForm.find("#delivery-delivery option:selected").attr("class"));
                            if (isNaN(model.orderFormData.deliveryPrice)) model.orderFormData.deliveryPrice = -1;
                            if (model.orderFormData.deliveryID == 0) {
                                model.orderFormData.deliveryID = parseInt(view.objectForm.find("#delivery-delivery option:selected").val());
                            }
                        } else {
                            if (model.orderFormData.deliveryType == "pickup") /* самовывоз */ {
                                model.orderFormData.deliveryPrice = parseInt(view.objectForm.find("#delivery-pickup option:selected").attr("class"));
                                if (isNaN(model.orderFormData.deliveryPrice)) model.orderFormData.deliveryPrice = 0;
                                model.orderFormData.deliveryID = parseInt(view.objectForm.find("#delivery-pickup option:selected").val());
                            }
                        }
                        if(model.orderFormData.paymentType == "cardoffline" || model.orderFormData.paymentType == "electromoney" || model.orderFormData.paymentType == "cashless") {
                            model.orderFormData.paymentCashlessType = parseInt(view.objectForm.find("#cashless-type option:selected").val());
                        }
                    }
                    /* сохраняем данные формы перед отправкой */
                function SaveOrderForm() {
                        view.objectForm.find("input[name='DELIVERY_TYPE']").val(model.orderFormData.deliveryType);
                        view.objectForm.find("input[name='DELIVERY_ID']").val(model.orderFormData.deliveryID);
                        view.objectForm.find("input[name='PAYMENT_TYPE']").val(model.orderFormData.paymentType);
                        view.objectForm.find("input[name='ELECTRO_MONEY_TYPE']").val(model.orderFormData.paymentElectroMoney);
                        view.objectForm.find("input[name='PERSON_TYPE']").val(model.orderFormData.personType);
                        /* дополнительная обработка чекбоксов */
                        view.objectForm.find("input[type='checkbox']").each(function () {
                            var input = $(this);
                            /* включенный чекбокс получает значение on */
                            if (input.prop("checked") == true) {
                                input.val("on");
                            } else {
                                /* выключенный включаем и меняем значение на off */
                                input.prop("checked", true);
                                input.val("off");
                            }
                        });
                        return true;
                    }
                    /*
                    функция SetCartTotal
                    работа только со значениями параметров orderFormData
                    проверка всех условий
                    вычисление итоговой стоимости доставки
                    начало отправки всех уведомлений и сообщений об ошибках
                    параметры
                    - isTotalPriceChanged - true/flase - произошло ли событие изменения цены
                    - datа - объект с параметрами
                    -      data.deliveryType - тип доставки
                    -      data.paymentType - тип оплаты
                    */
                function SetCartTotal(isTotalPriceChanged, data) {
                    if (model.orderFormData.invoicePrice == 0) {
                        view.reloadOrderForm();
                    }
                    /* обработка данных - Model */
                    if (isTotalPriceChanged === true) {
                        /* тип доставки мог измениться */
                        if (model.orderFormData.deliveryType == "delivery") {
                            /* проверка условий доставки для города */
                            /* стоимость доставки могла измениться */
                            /* стоимость доставки по условиям диапазонов для города */
                            /* -2	- доставка невозможна */
                            /* -1	- доставка будет бесплатной при достижении суммы заказа */
                            /* == 0	- доставка бесплатна */
                            /* > 0	- доставка платная */
                            var cityDeliveryRulesPrice = -2;
                            var cityDeliveryRulesNeedToPay = 0;
                            var temp = CalculateCityDeliveryRules(model.orderFormData.invoicePrice);
                            cityDeliveryRulesPrice = temp[0];
                            cityDeliveryRulesNeedToPay = temp[1];
                            if (cityDeliveryRulesPrice >= 0) {
                                model.orderFormData.deliveryPrice = cityDeliveryRulesPrice;
                            } else {
                                InitFromFields();
                            }
                        } else {
                            if (model.orderFormData.deliveryType == "pickup") {
                                InitFromFields();
                            }
                        }
                    }
                    /* вычисление итоговой стоимости */
                    model.orderFormData.cartTotal = model.orderFormData.invoicePrice + model.orderFormData.deliveryPrice - model.orderFormData.bonusCountToPay;
                    if (model.orderFormData.deliveryPrice == -1) {
                        model.orderFormData.cartTotal++;
                    }
                    /* уведомление - View */
                    if (typeof data !== "undefined") {
                        view.setOrderTotalPrice(true);
                    } else {
                        view.setOrderTotalPrice();
                    }
                    /* сообщения о стоимости доставки */
                    if (isTotalPriceChanged === true) {
                        /* тип доставки мог измениться */
                        if (model.orderFormData.deliveryType == "delivery") {
                            view.showDeliveryNotice(cityDeliveryRulesPrice, cityDeliveryRulesNeedToPay);
                            view.showDeliveryMessage();
                        } else {
                            if (model.orderFormData.deliveryType == "pickup") {
                                view.showPickupMessage();
                            }
                        }
                        /* способ оплаты мог измениться */
                        if (model.orderFormData.paymentType == "cardoffline" || model.orderFormData.paymentType == "electromoney" || model.orderFormData.paymentType == "cashless") {
                            if (typeof data !== "undefined") {
                                view.showPaymentCashless(data);
                            } else {
                                view.showPaymentCashless();
                            }
                        }
                    }
                    /* console.log(model.orderFormData); */
                }

                function DateParse(newDate) {
                    var newDateStr = "";
                    newDate = newDate.split(".");
                    newDate = {
                        day: parseInt(newDate[0]),
                        month: parseInt(newDate[1]),
                        year: parseInt(newDate[2])
                    };
                    newDateStr += newDate.day + " ";
                    switch (newDate.month) {
                    case 1:
                        newDateStr += "января";
                        break;
                    case 2:
                        newDateStr += "февраля";
                        break;
                    case 3:
                        newDateStr += "марта";
                        break;
                    case 4:
                        newDateStr += "апреля";
                        break;
                    case 5:
                        newDateStr += "мая";
                        break;
                    case 6:
                        newDateStr += "июня";
                        break;
                    case 7:
                        newDateStr += "июля";
                        break;
                    case 8:
                        newDateStr += "августа";
                        break;
                    case 9:
                        newDateStr += "сентября";
                        break;
                    case 10:
                        newDateStr += "октября";
                        break;
                    case 11:
                        newDateStr += "ноября";
                        break;
                    case 12:
                        newDateStr += "декабря";
                        break;
                    }
                    return newDateStr;
                }
            };
            /* ************************************************************* */
            /* / Controller */
            /* ************************************************************* */
            /* ************************************************************* */
            /* # Start */
            /* ************************************************************* */
            var model = new MVC.Model();
            var view = new MVC.View(object);
            var controller = new MVC.Controller(model, view);
            view.initPlugins();
            /* ************************************************************* */
            /* / Start */
            /* ************************************************************* */
        }
    })(jQuery);
    /* / orderFormMVC */
});
/* Фильтр каталога товаров */
/* изменение диапазона */
/* element - селектор диапазона */
/* minValue - минимальное значение */
/* maxValue - максимальное значение */
function Range(element, minValue, maxValue) {
        var form = element.parent().parent().parent();
        var dropDown = element.parent().parent();
        /* отмечаем input в диапазоне, если его значения изменялось */
        element.find("input").each(function () {
            var input = $(this);
            if (input.val() != minValue && input.val() != maxValue) element.find("input").addClass("changed");
        });
        FilterSubmit(form, dropDown);
    }
    /* отправка данных и получение результата */
    /* form - объект формы */
    /* element - объект части формы, в котором вызвана отправка формы (группа фильтров) */
    /* elementTop - отступ блока фильтров */
    /* inputTop - отступ инпута */
function FilterSubmit(form, element, elementTop, inputTop) {
        /* убираем padding-bottom во всех группах фильтров */
        $(".drop-down").removeClass("filtered");
        var serialize = "";
        /* скрытые поля */
        form.find("input[type='hidden']").each(function () {
            var input = $(this);
            serialize += encodeURIComponent(input.attr("name")) + "=" + encodeURIComponent(input.val()) + "&";
        });
        /* чекбоксы */
        form.find("input:checked").each(function () {
            var input = $(this);
            serialize += encodeURIComponent(input.attr("name")) + "=" + encodeURIComponent(input.val()) + "&";
        });
        /* диапазоны */
        form.find("input.changed").each(function () {
            var input = $(this);
            serialize += encodeURIComponent(input.attr("name")) + "=" + encodeURIComponent(input.val()) + "&";
        });
        /* добавляем загрузчик */
        var top = "50%"; /* диапазоны */
        if (systemParameters.mobileDevice.isCellPhone) {
            top = "100%"; /* для диапазонов на телефоне другой top */
        }
        if (typeof elementTop !== "undefined" && typeof inputTop !== "undefined") {
            /* чекбоксы */
            if (systemParameters.mobileDevice.isCellPhone)
                top = inputTop - elementTop + element.find("label.active").height();
            else
                top = inputTop - elementTop;
        }
        var loaderHtml = "<div class='fixed-wrap white'>&nbsp;</div>";
        loaderHtml += "<div class='show_filter_results_new'>";
        loaderHtml += "<div class='loader'>&nbsp;</div>";
        loaderHtml += "</div>";
        $(".show_filter_results_new").remove();
        element.append(loaderHtml);
        $(".show_filter_results_new").css({
            "top": top
        });
        element.addClass("filtered");
        /* удаляем загрузчик через 10 секунд */
        var timer = setTimeout(function () {
            $(".show_filter_results_new").remove();
            $(".fixed-wrap.white").remove();
            element.removeClass("filtered");
        }, 10000);
        $.post('/ajax/filter.php', {
            action: 'getCount',
            str: serialize
        }, function (response) {
            response = $.parseJSON(response);
            if (response.link.length > 0) {
                /* удаляем загрузчик и уведомления других фильтров */
                $(".show_filter_results_new").remove();
                $(".fixed-wrap.white").remove();
                element.append(response.link);
                $(".show_filter_results_new").css({
                    "top": top
                });
                clearTimeout(timer);
            }
        });
    }
    /* / Фильтр каталога товаров */
    /* Изменение размеров окна */
function WindowOnResize() {
        /* определение системных параметров */
        if (typeof jQuery !== "undefined" && jQuery.isFunction($(window).width)) {
            var globalViewportWidth = $(window).width();
            systemParameters.mobileDevice.isCellPhone = false;
            systemParameters.mobileDevice.isTabletPC = false;
            systemParameters.mobileDevice.isPC = false;
            if (globalViewportWidth > 0 && globalViewportWidth < 570) {
                /* телефон */
                systemParameters.mobileDevice.isCellPhone = true;
            } else {
                if (globalViewportWidth <= 959) { /* планшет */
                    systemParameters.mobileDevice.isTabletPC = true;
                } else { /* компьютер */
                    systemParameters.mobileDevice.isPC = true;
                }
            }
        }
        /* при возврате к нормальной ширине контента меню каталога товаров на главной странице может быть скрыто */
        if ($(".header .column.left .catalog").hasClass("index-page")) {
            if (systemParameters.mobileDevice.isPC) {
                /* при ширине контента 960 - меню каталога всегда отображается */
                $(".category.box .content .column.left .catalog .content").show();
            } else {
                /* при ширине контента 760 - меню каталога всегда скрыто */
                if (systemParameters.mobileDevice.isTabletPC)
                    $(".category.box .content .column.left .catalog .content").hide();
            }
        }
        /* костыль для позиционирования LiveTex */
        /* $(".lt-invite").css( { "left" : "auto" } ); */
    }
    /* / Изменение размеров окна */
    /* Склонение слов */
    /* count - количество слов */
    /* words - примеры - массив слов */
function WordDeclension(count, words) {
        if (typeof words === "object" && words.length >= 3) {
            var residue = count % 100;
            if (residue < 20) {
                if (residue < 10) {
                    switch (residue % 10) {
                    case 0:
                        return words[2];
                    case 1:
                        return words[0];
                    case 2:
                    case 3:
                    case 4:
                        return words[1];
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                        return words[2];
                    default:
                        return words[0];
                    }
                } else {
                    return words[2];
                }
            } else {
                switch (residue % 10) {
                case 0:
                    return words[2];
                case 1:
                    return words[0];
                case 2:
                case 3:
                case 4:
                    return words[1];
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                    return words[2];
                default:
                    return words[0];
                }
            }
        }
    }
    /* / Склонение слов */