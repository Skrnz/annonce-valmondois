(function () {
	'use strict';
	window.addEventListener(
		'load',
		function () {
			var inputs = document.getElementsByClassName('form-control');
			Array.prototype.filter.call(inputs, function (input) {
				input.addEventListener(
					'blur',
					function (event) {
						input.classList.remove('is-invalid');
						input.classList.remove('is-valid');
						if (input.checkValidity() === false) {
							input.classList.add('is-invalid');
						} else {
							input.classList.add('is-valid');
						}
					},
					false
				);
			});
		},
		false
	);
})();
var request;
$('#contact-form').submit(function (event) {
	event.preventDefault();
	if (request) {
		request.abort();
	}
	var $form = $('#contact-form');
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
		url: '/api/request',
		type: 'post',
		data: {
			message: $('#message').val(),
			prenom: $('#prenom').val(),
			nom: $('#nom').val(),
			email: $('#email').val(),
			telephone: $('#telephone').val(),
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
