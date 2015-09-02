try{Typekit.load();}catch(e){}

var feed = new Instafeed({
		get: 'user',
		userId: 94764,
		accessToken: '94764.1677ed0.c6256a27eddf41709ddf29af3469a4e5',
		target: 'instagram',
		resolution: 'standard_resolution',
		after: function() {
			var el = document.getElementById('instagram');
			if (el.classList)
				el.classList.add('show');
			else
				el.className += ' ' + 'show';
		}
});

window.onload = function() {
	feed.run();

	var _gauges = _gauges || [];
	(function() {
		var t   = document.createElement('script');
		t.type  = 'text/javascript';
		t.async = true;
		t.id    = 'gauges-tracker';
		t.setAttribute('data-site-id', '4d5aa2a95ffe1f587b000001');
		t.src = '//secure.gaug.es/track.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(t, s);
	})();
};
