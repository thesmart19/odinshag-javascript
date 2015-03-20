$(document).ready( function()
{    
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
    $("form").FormValidation(true, "/ajax/feedback.php");
});