$('.group-item').click(function() {
	var groupitem = $(this);

	$('.group-item').not($(this)).fadeOut('fast', function() {
		$(groupitem).children('.group-collapsed-data').show('normal');
	});
});