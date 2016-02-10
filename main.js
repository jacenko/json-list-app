$(function() {

  var currentUser;  // Currently selected name in the dropdown
  var data;         // Data from data.json

  // Get information from data.json
  $.getJSON('data.json', function(JSONData) {
    data = JSONData;
    currentUser = data[0].user;       // Get first user
    displayUserItems(currentUser);    // and show their wishlist
    // create dropdown
    var output = '<select class="names">';
    $.each(data, function (key, val) {
      output += '<option value="' + val.user + '">';
      output += val.name;
      output += '</option>';
    });
    output += '</select>';
    $('#user-select').html(output);
  });

  // When user selects a different name in the dropdown,
  // show the user's wishlist
  $(document).on('change','.names', function(){
    currentUser = $(this).val();
    displayUserItems(currentUser);
  });

  $(document).on('click', '#delete', function() {
    var index = $(this).parent().index();
    deleteItemAtIndex(index);
    $(this).closest("li").remove();
  });

  $(document).on('mouseenter', '#delete', function() {
    $(this).css('color', '#ff4d4d');
  });

  $(document).on('mouseleave', '#delete', function() {
    $(this).css('color', '#CCC');
  });

  function deleteItemAtIndex(index) {
    $.each(data, function (key, val) {
      if( currentUser == val.user ) {
        val.list.splice(index, 1);
      }
    });
  }

  // Build <ul> to show a user's wishlist
  function displayUserItems(user) {
    // Create list
    output = '<ul id="list-items">';
    $.each(data, function (key, val) {
      if( currentUser == val.user ) {
        for( var i = 0; i < val.list.length; i++) {
          output += '<li>';
          output += val.list[i];
          output += '</li>';
        }
        return false;
      }
    });
    output += '</ul>';
    $('#list').html(output);
    $('li').append('<div id="delete">X</div>');
  }

});
