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
feed.run();
