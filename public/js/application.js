document.addEventListener("DOMContentLoaded", function(){
  /* Use cookie to remember the user */
  if(!document.cookie){
    var date = new Date();
    document.cookie="user_id=" + Math.random().toString(36).substring(7) + date.toISOString();
  }

  var user_id = document.cookie;

  /* Endpoints */
  var search_uri = "/search";
  var favorites_uri = "/favorites";

  /* DOM Elements */
  var movie_search_form = document.getElementById("movie-search-form");
  var see_favorites_button = document.getElementById("see-favorites");
  var query = document.getElementById("movie-search-query");
  var search_results = document.getElementById("search-results-list");
  var expandable = document.getElementsByClassName("expandable");

  /* Display Data */
  var error_no_results = "<p class=\"error\">No results found.</p>";

  /* Events */
  movie_search_form.onsubmit = function(e){
    search_by_keyword(query.value);
    e.preventDefault();
  }

  see_favorites_button.onclick = function(e){
    show_favorites(user_id);
    e.preventDefault();
  }

  /* @TODO The following two functions have similar functionality, need to DRY out */
  function search_by_keyword(keyword){
    var xhr = new XMLHttpRequest();
    var keyword = encodeURI(keyword);

    xhr.open("GET", search_uri + ".json?keyword=" + keyword + "&user_id=" + user_id, true);
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          data = JSON.parse(xhr.responseText);
          populate_results(data.Search);
        }
      }
    };
    xhr.send();
  }

  function show_favorites(user_id){
    var xhr = new XMLHttpRequest();

    xhr.open("GET", favorites_uri + ".json?user_id=" + user_id, true);
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          data = JSON.parse(xhr.responseText);
          populate_results(data);
        }
      }
    };
    xhr.send();
  }

  function is_favorited(data){
    if(data.Favorite == true){
      return "checked";
    } else {
      return "";
    }
  }

  function populate_results(data){
    search_results.innerHTML = ""; //clear old results

    if(data === undefined){
      search_results.innerHTML = error_no_results;
    } else {
      for(var i = 0; i < data.length; i++){
        var el = document.createElement("li");
        var title = data[i].Title;

        el.className = "expandable closed";
        el.innerHTML = "<div class=\"star " + is_favorited(data[i]) + "\" id=\"" + data[i].imdbID + "\"></div>";
        el.innerHTML += "<h2>" + title + "</h2>";

        /* The API doesn't return the same data for search queries and
         * title searches, so we have to make a title search for each
         * result */
        populate_details(title, el);

        search_results.appendChild(el);

        el.onclick = function(e){
          if(e.target.className.indexOf("star") != -1){
            toggle_favorite(e.target);
          } else {
            toggle(this);
          }

          e.preventDefault();
        }
      }
    }
  }

  function populate_details(title, el){
    var xhr = new XMLHttpRequest();
    var title = encodeURI(title);

    xhr.open("GET", search_uri + ".json?title=" + title, true);
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          data = JSON.parse(xhr.responseText);

          el.innerHTML += "<div class=\"data\">";
          data_container = el.getElementsByClassName("data")[0];
          data_container.innerHTML += "<p><strong>Released:</strong> " + data.Released + "</p>";
          data_container.innerHTML += "<p><strong>Genre:</strong> " + data.Genre + "</p>";
          data_container.innerHTML += "<p><strong>Actors:</strong> " + data.Actors + "</p>";
          data_container.innerHTML += "<p><strong>Plot:</strong> " + data.Plot + "</p>";
        }
      }
    };
    xhr.send();
  }

  function toggle(el){
    if(el.classList.contains("open")){
      el.className = "expandable closed";
    } else {
      el.className = "expandable open";
    }
  }

  function toggle_favorite(el){
    if(!el.classList.contains("checked")){
      var xhr = new XMLHttpRequest();

      xhr.open("POST", favorites_uri, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            el.className = "star checked";
          }
        }
      };

      xhr.send(encodeURI("imdb_id=" + el.id + "&user_id=" + user_id));
    }

    // This should actually allow toggling to also remove favorites, but the
    // Sinatra API doesn't currently support it.
    //
    // if(el.classList.contains("checked")){
    //   el.className = "star";
    //   // add to favorites
    // } else {
    //   el.className = "star checked";
    //   // unfavorite
    // }
  }
});
