$(document).ready( function()
{	
	/* ограничения для загружаемых файлов */
	var imageRestrictions = {
		imageMaxCount: 5,				/* количество */
		imageMaxWidth: 3000,			/* максимальная ширина */
		imageMaxHeight: 3000,			/* максимальная высота */
		imageMinWidth: 300,				/* минимальная ширина */
		imageMinHeight: 300,			/* минимальная высота */
		imageMaxFileSize: 3*1024*1024,	/* максимальный размер файла - 3МБ */
		previewMaxWidth: 53,			/* максимальная ширина превью */
		previewMaxHeight: 53			/* максимальная высота превью */
	};
	/* объект для превью */
	var thumbnails = $("label.thumbnails");
	/* объект для сохранения данных в форме отзывов */
	var files = $("input[name='files']");
	
	/* загрузчик картинок */
	$('#fileupload').fileupload(
	{
		url: "/ajax/uploader.php",
		type: "POST",
		dataType: 'json',
		singleFileUploads: true,
		multipart: true,
		imageMaxWidth: imageRestrictions.imageMaxWidth,
		imageMaxHeight: imageRestrictions.imageMaxHeight,
		imageMinWidth: imageRestrictions.imageMinWidth,
		imageMinHeight: imageRestrictions.imageMinHeight,
		previewMaxWidth: imageRestrictions.previewMaxWidth,
		previewMaxHeight: imageRestrictions.previewMaxHeight,
		formData: {},
		add: function (e, data)
		{
			thumbnails.find(".error").remove();
			/* проверяем количество загружаемых файлов */
			if(data.originalFiles.length > imageRestrictions.imageMaxCount)
			{
				thumbnails.removeClass("empty");
				thumbnails.addClass("error");
				thumbnails.html("<div class='error'>Превышено максимальное количество файлов("+imageRestrictions.imageMaxCount+")!</div>");
				return false;
			}
			else
			{
				/* проверяем количество уже загруженных картинок */
				var filesCount = 0;
				if(files.val() != "")
				{
					temp = JSON.parse(files.val());
					for(var field in temp)
						filesCount++;
				}
				if(filesCount + data.originalFiles.length > imageRestrictions.imageMaxCount)
				{
					thumbnails.removeClass("empty");
					thumbnails.addClass("error");
					var text = thumbnails.html();
					text += "<div class='error'>Превышено максимальное количество файлов("+imageRestrictions.imageMaxCount+")!</div>";
					thumbnails.html(text);
					return false;
				}
				else
				{
					/*thumbnails.find(".error").remove();*/
					thumbnails.removeClass("empty");
					if(thumbnails.hasClass("error"))
					{
						/*thumbnails.find(".error").remove();*/
						thumbnails.removeClass("error");
					}
					var count = data.files.length;
					for(var i=0; i<count; i++)
					{
						/* заменяем символы пробела на - в имени файла */
						var n = data.files[i].name;
						n = n.replace(/\s/g, "-");
						delete data.files[i].name;
						data.files[i].name = n;
						/* проверяем размер картинки в МБ */
						if( data.files[i].size > imageRestrictions.imageMaxFileSize)
						{
							thumbnails.removeClass("empty");
							thumbnails.addClass("error");
							var text = thumbnails.html();
							text += "<div class='error'>Размер файла "+data.files[i].name+" превышает "+( parseInt(imageRestrictions.imageMaxFileSize / 1024 / 1024) )+" МБ!</div>";
							thumbnails.html(text);
							return false;
						}
						/* отображаем превью */
						var id = data.files[i].name.split(".");
						id = id[0];
						var html = thumbnails.html();
						html +=		"<div class='thumb' id='"+id+"'>"; /* добавляем id для поиска прогресс-бара во время загрузки */
						html +=		"<div class='name'>"+data.files[i].name+"</div>";
						html +=		"<div class='progress'><span class='bar'><span>&nbsp;</span></span><span class='arrow'>&nbsp;</span></div>";
						html +=		"</div>";
						thumbnails.html(html);
					}
					data.submit();
				}
			}
		},
		progress: function (e, data)
		{
			/* по id ищем соотв. прогресс-бар */
			var id = data.files[0].name.split(".");
			id = id[0];
			var thumb = thumbnails.find("#"+id);
			var progress = thumb.find(".progress");
			var progressWidth = progress.width();
			var progressBar = progress.find(".bar span");
			progressBar.width( (progressWidth*data.loaded) / data.total );
			if(data.loaded == data.total) thumb.remove();
		},
        done: function (e, data)
		{
			/* результат в формате JSON */
			var count = data.result.files.length;
			if(count > 0)
			{
				/* сохраняем данные в форму отзывов */
				var hasError = false;
				for(var i=0; i<count; i++)
				{
					if(typeof data.result.files[i].error !== "undefined") hasError = true;
				}
				if(files.length > 0 && !hasError)
				{
					var temp = {};
					if(files.val() != "")
					{
						temp = JSON.parse(files.val());
						var filesCount = 0;
						for(var field in temp)
							filesCount++;
						temp[filesCount] = data.result.files;
					}
					else temp[0] = data.result.files;
					files.val(JSON.stringify(temp));
				}
				/* отображаем превью */
				if(thumbnails.hasClass("error"))
				{
					/*thumbnails.find(".error").remove();*/
					thumbnails.removeClass("error");
				}
				thumbnails.removeClass("empty");
				for(var i=0; i<count; i++)
				{
					var html = thumbnails.html();
					if(typeof data.result.files[i].error === "undefined")
					{
						html +=		"<div class='thumb'>";
						html +=		"<img src='"+data.result.files[i].thumbnailUrl+"' alt='"+data.result.files[i].name+"'>";
						html +=		"<div class='name'>"+data.result.files[i].name+"</div>";
						html +=		"<a href='#' title='Удалить' class='delete'>&nbsp;</a>";
						html +=		"</div>";
					}
					else
						html += "<div class='error'>"+data.result.files[i].error+" ("+data.result.files[i].name+")</div>";
					thumbnails.html(html);
				}
			}
			else
			{
				thumbnails.removeClass("empty");
				thumbnails.addClass("error");
				var html = thumbnails.html();
				html += "<div class='error'>Ошибка!</div>";
				thumbnails.html(html);
			}
        },
		fail: function (e, data)
		{
			thumbnails.removeClass("empty");
			thumbnails.addClass("error");
			var html = thumbnails.html();
			html += "<div class='error'>" + data.errorThrown + "</div>";
			html += "<div class='error'>" + data.textStatus + "</div>";
			html += "<div class='error'>" + data.jqXHR + "</div>";
			thumbnails.html(html);
        }
    });
	/* / загрузчик картинок */
	
	/* удаление картинок */
	$("form").on("click", "label.thumbnails .thumb .delete", function(event)
	{
		var object = $(this);
		var parent = object.parent();
		var fileName = parent.find(".name").text();
		/* ищем информацию о загруженном файле */
		var file = JSON.parse(files.val());
		if(typeof file === "object")
		{
			var count = 0;
			for(var field in file)
			{
				if(typeof file[field] === "object")
				{
					for(var index in file[field])
					{
						if(typeof file[field][index].name !== "undefined" && file[field][index].name == fileName)
						{
							parent.remove();
							thumbnails.find(".error").remove();
							delete file[field];
						}
					}
					count++;
				}
			}
			if(count <= 1)
			{
				thumbnails.find(".error").remove();
				thumbnails.addClass("empty");
			}
		}
		files.val(JSON.stringify(file));
		event.preventDefault();
	});
	/* / удаление картинок */
	
	/* подсказки */
	$("form").on("click", ".files span.icon", function(event)
	{
		var object = $(this);
		var fixedWrap = object.find(".fixed-wrap");
		var message = object.find(".message");
		if(message.css("display") == "none")
		{
			object.addClass("active");
			fixedWrap.show();
			message.show();
			var timer = setTimeout(function()
			{
				if(message.css("display") == "block")
				{
					object.removeClass("active");
					fixedWrap.hide();
					message.hide();
				}
			}, 30000);
		}
		event.preventDefault();
	});
	
	/* валидация */
	$(".tabs .pages form.review-form").FormValidation();
	/*$(".tabs .pages form.review-form").tabsForm();*/
});  