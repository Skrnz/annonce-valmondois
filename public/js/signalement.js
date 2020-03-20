var request;
$('#signalement-form').submit(function (event) {
	event.preventDefault();
	if (request) {
		request.abort();
	}
	var $form = $('#signalement-form');
	var $fc = document.getElementsByClassName('form-control');
	for (var fc = 0; fc < $fc.length; fc++) {
		if (!$fc[fc].checkValidity()) {
			$fc[fc].classList.add('is-invalid');
			return;
		}
	}
	var $inputs = $form.find('input, button, select, textarea');
	$inputs.prop('disabled', true);
	request = $.ajax({
		url: '/api/signalement',
		type: 'post',
		data: {
			message: $('#message').val(),
			signalement_id: $('#signalement_id').val(),
		},
		dataType: 'json',
	})
		.done(function (data) {
			$form.css('display', 'none');
			$('#result')
				.html(data.message)
				.addClass('alert-success')
				.css('display', 'block');
		})
		.fail(function (err) {
			$form.css('display', 'none');
			$('#result')
				.html(err.error)
				.addClass('alert-danger')
				.css('display', 'block');
		})
		.always(function (html) {
			$inputs.prop('disabled', false);
		});
});
