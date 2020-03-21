(function () {
	'use strict';
	window.addEventListener('load', function () {
		$('.text-annonce').on('click', function (event) {
			if ($(this).css('overflow') === 'hidden') {
				$(this).css({ overflow: 'visible', display: 'block' });
			} else {
				$(this).css({ overflow: 'hidden', display: '-webkit-box' });
			}
		});
	});
})();

$(document).ready(function () {
	var annonce;
	var request;
	$('#modalContact').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget);
		annonce = button.data('annonce');
	});
	$('#envoyer').submit(function (event) {
		console.log('annonce', annonce);
		event.preventDefault();
		if (request) {
			request.abort();
		}
		var $form = $(this);
		var $fc = document.getElementsByClassName('form-control');
		for (var fc = 0; fc < $fc.length; fc++) {
			if (!$fc[fc].checkValidity()) {
				$fc[fc].classList.add('is-invalid');
				return;
			}
		}
		var $inputs = $form.find('input, button, select, textarea');
		$inputs.prop('disabled', true);
		const data = {
			prenom: $('#prenom').val(),
			nom: $('#nom').val(),
			email: $('#email').val(),
			telephone: $('#telephone').val(),
			message: $('#message').val(),
		};
		request = $.ajax({
			url: '/api/envoyer/' + annonce,
			type: 'post',
			data: data,
			dataType: 'json',
		})
			.done(function (data) {
				alert(data.message);
			})
			.fail(function (err) {
				alert(err.error);
			})
			.always(function (html) {
				$inputs.prop('disabled', false);
				$('#modalContact').modal('hide');
			});
	});
});
