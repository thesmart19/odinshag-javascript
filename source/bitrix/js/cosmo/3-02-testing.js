QUnit.module("Header tests");
QUnit.test( "Фиксированная шапка", function( assert ) {
    assert.expect( 2 ); /* ждем выполнения ассертов */
    /*
    тест на открытие формы авторизации
    */
    var title = $(".header.fixed a.title");
    title.one("click", function(event) {
        var parent = $(this).parent();
        if(parent.hasClass("user") && parent.find(".message").css("display") == "block") {
            assert.ok( true, "Форма авторизации открыта" );
            title.trigger("click"); /* закрываем */
            if (parent.find(".message").css("display") == "none") {
                assert.ok( true, "Форма авторизации закрыта" );
            }
        }
    });
    title.trigger("click");
});
QUnit.test( "Шапка сайта", function( assert ) {
    /*
    тест на открытие списка городов
    */
    var city = $(".header .menu .item.city")
    var title = city.children("a.title");
    var content = city.children(".content");
    title.one("click", function(event) {
        var done = assert.async(); /* асинхронный callback */
        if (content.html() == "" || content.html() == "&nbsp;") {
            $.post("/ajax/city_list.php", {
            "action": "get_cities",
            "current_url": window.location.href
            }, function (data) {
                if (content.html() != "" && content.html() != "&nbsp;") {
                    assert.ok( true, "Список городов открыт" );
                    title.trigger("click"); /* закрываем */
                    if (content.css("display") == "none") {
                        assert.ok( true, "Список городов закрыт" );
                        done();
                    }
                }
            });
        }
    });
    title.trigger("click");
});

QUnit.module("Basket tests");
QUnit.test( "Корзина", function( assert ) {
    var productID = 170776, productPrice = 123;
    /*
    добавление товара в корзину
    */
    var product = JSON.parse(SaveProductToCookies(productID, 1, 0, productPrice, false, 'Preview'));
    assert.ok( product, "Добавлен товар из списка" );
    product = JSON.parse(SaveProductToCookies(productID, 1, 0, productPrice, false, 'Card'));
    assert.ok( product, "Добавлен товар со страницы товара" );
    product = JSON.parse(SaveProductToCookies(productID, 1, 0, productPrice, false, 'SimilarItems'));
    assert.ok( product, "Добавлен товар из похожих" );
    /*
    уменьшение количества товара
    */
    product = JSON.parse(SaveProductToCookies(productID, -1, 0, productPrice, false));
    assert.ok(product, "Уменьшено количество товара");
    /*
    удаление товара
    */
    product = JSON.parse(SaveProductToCookies(productID, 0, 0, productPrice, true));
    assert.ok(product, "Товар удален");
});





/*
QUnit.module( "This is a group of tests" );
QUnit.test( "Odinshag.ru test example 1", function( assert ) {
	assert.expect( 3 ); // ждем выполнения ассертов
	
	var button = $("input[type='button']");
	button.on("click", function() {
		var result = $("body .test");
		assert.ok( result.length, "Ok basic test" );
	});
	button.trigger("click");
	
	assert.equal( test1, 3, "Equal test" );
	assert.deepEqual( obj, { foo: "bar" }, "DeepEqual basic test" );
});
QUnit.test( "Odinshag.ru test example 2", function( assert ) {			
	assert.equal( test1, 3, "Equal test" );
	assert.deepEqual( obj, { foo: "bar" }, "DeepEqual basic test" );
});
*/