try{Typekit.load();}catch(e){}

var feed = new Instafeed({
		get: 'user',
		userId: 94764,
		accessToken: '',
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
	

	
};
