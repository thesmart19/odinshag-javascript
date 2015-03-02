$(document).ready( function()
{
	/* открытие списка городов */
	$(".box").on("click", ".city .change", function(event)
	{
		$("html, body").animate({scrollTop: 0}, 500, function() { $(".header .item.city a.title").click(); } );
		event.preventDefault();
	});
	
	$(".accordion").each( function()
	{
		$(this).dropDown(500);
	});
});