$(document).ready( function() {
    
    
    if(!systemParameters.mobileDevice.isCellPhone) {
        
        /* анимация счетчика заказов */
        var orderCounter = $(".house .counter");
        var lastDigit = 0, tempCount = 0;
        /* анимация цифр */
        if(ordersCount < 100000) {
            ordersCount = "0" + ordersCount;
        }
        lastDigit = ordersCount.substring(ordersCount.length-1);
        tempCount = ordersCount.substring(0, ordersCount.length-1);
        orderCounter.text( tempCount );
        var startAnimation = setTimeout( function () {
            var roller = $(".counter-roller span");
            var rollerHeight = roller.height();
            var digitHeight = parseInt(rollerHeight / 10);
            /* перемещаем span вниз на (lastDigit * digitHeight) */
            roller.animate ( { "bottom" : (lastDigit * digitHeight)*(-1) + "px" }, lastDigit * 500, function () {
                roller.hide();
                orderCounter.text( ordersCount );
            });
            /* увеличение кол-ва заказов через 5 минут */
            var timer = setInterval( function() {
                ordersCount = parseInt(ordersCount) + 1;
                if(ordersCount < 100000) {
                    ordersCount = "0" + ordersCount;
                }
                orderCounter.text( ordersCount );
            }, 300000);
        }, 4000 );
        
        /* анимация блоков описания магазина */
        var windowHeight = $(window).height();
        var features = $(".features .feature");
        var featuresTimer, waitTimer;
        var canAnimate = true;
        $(window).on("scroll", animateFeatures);
        $(window).on("resize", function () { windowHeight = $(window).height(); } );
        function animateFeatures() {
            clearTimeout(featuresTimer);
            featuresTimer = setTimeout ( function () {
                var scrolled = $(window).scrollTop();
                var length = features.length;
                for (var i=0; i<length; i+=3 /* по три в ряду */) {
                    if(canAnimate) {
                        var offsetTop = $(features[i]).offset().top;
                        if(scrolled + windowHeight > offsetTop) {
                            if (!$(features[i]).hasClass("animated")) {
                                $(features[i]).addClass("animated");
                                $(features[i+1]).addClass("animated");
                                $(features[i+2]).addClass("animated");
                                canAnimate = false;
                                waitTimer = setTimeout( function() {
                                    canAnimate = true;
                                    animateFeatures();
                                }, 500 );
                            }
                        } else {
                            $(features[i]).removeClass("animated");
                            $(features[i+1]).removeClass("animated");
                            $(features[i+2]).removeClass("animated");
                        }
                    }
                }
            }, 100 );
        }
        animateFeatures();
    }
});