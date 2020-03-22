(function () {
	"use strict";
	window.addEventListener(
		"load",
		function () {
			var inputs = document.getElementsByClassName("form-control");
			Array.prototype.filter.call(inputs, function (input) {
				input.addEventListener(
					"blur",
					function (event) {
						input.classList.remove("is-invalid");
						input.classList.remove("is-valid");
						if (input.checkValidity() === false) {
							input.classList.add("is-invalid");
						} else {
							input.classList.add("is-valid");
						}
					},
					false
				);
			});
		},
		false
	);
	$("input[type=file]").change(function (e) {
		$(this)
			.next(".custom-file-label")
			.text(e.target.files[0].name);
	});
})();

function handleFile (file) {
	var img = $("#image-dessin")
	img[0].file = file;
	var reader = new FileReader();
	reader.onload = ( function (aImg) { return function (e) { aImg[0].src = e.target.result; }; })(img);
	reader.readAsDataURL(file);
}

var $photo = $("#dessin");
$photo.change(function () {
	handleFile($photo[0].files[0]);
});

var request;
$("#dessin-form").submit(function (event) {
	event.preventDefault();
	if (request) {
		request.abort();
	}
	var $form = $(this);
	var $fc = document.getElementsByClassName("fc-dessin");
	for (var fc = 0; fc < $fc.length; fc++) {
		if (!$fc[fc].checkValidity()) {
			$fc[fc].classList.add("is-invalid");
			return;
		}
	}
	var $inputs = $form.find("input, button, select, textarea");
	var data = {
		titre: $("#titre-d").val(),
		message: $("#message-d").val(),
		prenom: $("#prenom-d").val(),
		nom: $("#nom-d").val(),
		email: $("#email-d").val(),
		telephone: $("#telephone-d").val()
	};
	var img = $("#image-dessin");
	if (img[0].file) {
		const LIMIT = 1024 * 1024;
		if (img[0].file.size > LIMIT) {
			$("#result")
				.html(
					"La taille de l'image ne peut excéder " +
					Math.floor(LIMIT / (1024 * 1024)) +
					" Mo"
				)
				.addClass("alert-danger")
				.css("display", "block");
			return;
		}
		data.dessin = img[0].src;
	}
	$inputs.prop("disabled", true);
	request = $.ajax({
		url: "/api/enregistredessin",
		type: "post",
		data: data,
		dataType: "json"
	})
	.done(function (data) {
		$form.css("display", "none");
		$("#result")
			.html(data.message)
			.addClass("alert-success")
			.css("display", "block");
	})
	.fail(function (err) {
		$form.css("display", "none");
		$("#result")
			.html(err.error)
			.addClass("alert-danger")
			.css("display", "block");
	})
	.always(function (html) {
		$inputs.prop("disabled", false);
	});
});
