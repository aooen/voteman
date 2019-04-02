// Function =====

function calcPie (startAngle, endAngle, x, y, r) {
	function calcArc (degree) {
		var rad = (degree) * Math.PI / 180.0;
		return {
			x: x + (r * Math.cos(rad)),
			y: y + (r * Math.sin(rad))
		};
	}

	var start = calcArc(endAngle)
	,   end = calcArc(startAngle)
	,   gt180 = (endAngle - startAngle) > 180 ? 1 : 0;

	return [
		'M', x, y,
		'L', start.x, start.y,
		'A', r, r, 0, gt180, 0, end.x, end.y,
		'Z'
	].join(' ');
}

function drawChart ($svg, data, centerX, centerY, size) {
	if ($svg.length > 1) throw "1개의 svg만 이용이 가능합니다.";
	if (!centerX) centerX = 100;
	if (!centerY) centerY = 100;
	if (!size) size = Math.min(centerX, centerY) * 2;
	
	var angle = -90;
	$svg.find('path').each(function (i) {
		var total = data.reduce(function (p, c) { return p + c; })
		,	degree = data[i] * 360 / total;
		$(this).attr('d', calcPie(angle, angle += degree, centerX, centerY, size / 2));
	});
};

function dataDescribe (loc, data) {
	var major = 0;
	$('.top-describe').clone()
		.removeClass('top-describe')
		.addClass('describe')
		.appendTo(loc)
		.children('.describe-item').after('<br>').each(function (i) {
			if (data[major] < data[i]) major = i;
			$(this).text(data[i].toFixed(1) + '%');
		});
	$(loc).addClass('background-' + (major + 1));
}

function addInvest (set) {
	var $sec = $('.invest-base').clone().removeClass('invest-base').appendTo('#invest')
	,	$baseItem = $sec.children('.invest-item');
	$sec.children('h2').text(set.title);

	set.data.forEach(function (data) {
		var $item = $baseItem.clone().appendTo($sec);
		$item.children('h3').text(data.title);

		drawChart($item.children('svg'), data.per, 50, 50);
		dataDescribe($item, data.per);
	});

	$baseItem.remove();
}


// Listener =====

$(document).ready(function () {
	$('.noscript').hide();

	drawChart($('#result svg'), resultData);
	dataDescribe('#result', resultData);

	investData.forEach(function (data) {
		addInvest(data);
	});
	$('.invest-base').remove();


	$('svg path').hover(function () {
		$(this).closest('section').find('.describe-' + $(this).attr('class'))
			.addClass('describe-item-hover');
	}, function () {
		$(this).closest('section').find('.describe-' + $(this).attr('class'))
			.removeClass('describe-item-hover');
	});
	$('.describe-item').hover(function () {
		$(this).addClass('describe-item-hover');
	}, function () {
		$(this).removeClass('describe-item-hover');
	});


	$('a[href^="#"]').click(function () {
		var $obj = $($(this).prop('hash'))
		,	top = $obj.offset() ? $obj.offset().top : 0;

		$('html, body').animate({
			scrollTop: top
		}, 500);

		return false;
	});


	function topButtonShow () {
		if ($(window).scrollTop() == 0) {
			$('.top-button').stop().fadeOut(200);
		} else {
			$('.top-button').stop().fadeIn(200);
		}
	}
	$(document).scroll(function () {
		topButtonShow();
	});
	topButtonShow();
});