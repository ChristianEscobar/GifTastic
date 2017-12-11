var _apiKey = 'zEbHjF7VCx7hiK3cOhvxoLmIHwGxy2KB&';
var _topics = ['Pac-Man', 'Donkey Kong', 'Dig Dug'];

$('#new-entry-btn').on('click', function(event){
	event.preventDefault();

	var newEntryValue = $('#new-entry').val().trim();

	var limitBy = $('#drop-down-menu').text().trim();

	if(isNaN(limitBy)) {
		alert('Invalid limit value specified.');
	} else {
		if(newEntryValue.length === 0) {
			alert('Please specify a value for the new entry');
		} else {
			_topics.push(newEntryValue);

			renderButtons(limitBy);
		}
	}
});

$(document).on('click', '.limit-by-value', populateLimitBy);

$(document).on('click', '.entry-button', displayGIFs);

$(document).on('click', '.entry-gif', changeImage);

function populateLimitBy() {
	$('#drop-down-menu').html($(this).text() + '  <span class="caret"></span>');
}

function renderButtons(limitByValue) {
	$('#buttons').empty();

	for(var i=0; i<_topics.length; i++) {
		var button = $('<button></button>');

		button.text(_topics[i]);
		button.addClass('entry-button');
		button.addClass('btn btn-success btn-md');
		button.attr('limit-by', limitByValue);

		$('#buttons').append(button);
	}
}

function displayGIFs() {
	var entryValue = $(this).text();

	$('#images').empty();

	var limitBy = $(this).attr('limit-by');
	
	var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + _apiKey + '&q=' + entryValue + '&limit=' + limitBy;

	console.log(queryURL);

	$.ajax({
		url: queryURL,
		method: "GET",
	}).done(function(response) {
		var newRowCounter = 0;
		var lastRowId = 0;

		for(var i=0; i<response.data.length; i++) {
			var stillImageURL = response.data[i].images.fixed_height_still.url;
			var animatedURL = response.data[i].images.fixed_height.url;
			var imageAlt = response.data[i].slug;

			var rating = response.data[i].rating;

			var rowDiv;

			// Display 3 images per row
			if(newRowCounter % 3 === 0) {
				rowDiv = $('<div></div>');
				
				rowDiv.addClass('image-container');
				rowDiv.addClass('row');
				rowDiv.attr('id', newRowCounter);

				lastRowId = newRowCounter;
			} else {
				rowDiv = $('#' + lastRowId);
			}

			var colDiv = $('<div></div>');
			colDiv.addClass('col-md-4');

			colDiv.append('Rating:  ' + rating + '<br>');

			var image = $('<img/>');
			image.addClass('entry-gif');
			image.attr('src', stillImageURL);
			image.attr('alt', imageAlt);
			
			image.attr('img-state', 'still');
			image.attr('animated-url', animatedURL);
			image.attr('still-url', stillImageURL);

			colDiv.append(image);

			rowDiv.append(colDiv);

			$('#images').append(rowDiv);

			newRowCounter++;
		}
	});
}

function changeImage() {
	var imgState = $(this).attr('img-state');
	var stillURL = $(this).attr('still-url');
	var animatedURL = $(this).attr('animated-url');

	if(imgState === 'still') {
		$(this).attr('src', animatedURL);

		$(this).attr('img-state', 'animated');
	} else if(imgState === 'animated') {
		$(this).attr('src', stillURL);

		$(this).attr('img-state', 'still');
	} else {
		alert("Invalid image state encountered:  " + imgState);
	}
}

