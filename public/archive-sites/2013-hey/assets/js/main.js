try{Typekit.load();}catch(e){}
  
$(function(){

  _500px.init({
    sdk_key: ''
  });

  var photo_grid = "";

  _500px.api('/photos', { feature: 'user', username: 'garand', image_size: 3, rpp: 6 }, function (response) {
    photos = (response.data.photos);

    $.each(photos,function(index,image) {
      photo_grid += "<a href='http://500px.com/photo/" + image.id + "' target='_blank'><img src='" + image.image_url + "'/></a>";
    });

    $(".grid").html(photo_grid).delay(250).fadeIn(750);

  });
});