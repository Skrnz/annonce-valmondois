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
