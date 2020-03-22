(function () {
	'use strict';
	window.addEventListener('load', function () {
		var inputs = document.getElementsByClassName('btn-action');
		var url, button;
		Array.prototype.filter.call(inputs, function (input) {
			input.addEventListener('click', function (event) {
				button = $(this);
				url = button.data('annonce');
				if (url) {
					$.get(url).done(function () {
						setTimeout(() => {
							location.reload(true);
						}, 500);
					});
				}
			}, false);
		});
	}, false);
})();
