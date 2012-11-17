$('.group-item').click(function() {
	var groupitem = $(this);

	$('.group-item').not($(this)).fadeOut('fast', function() {
		// $(groupitem).children('.group-pictures').hide('normal', function() {
			$(groupitem).children('.group-collapsed-data').show('normal');
		// });
	});
});

$('.group-members-large .single-member').click(function() {
	$(this).children('.actions').show('normal');
});