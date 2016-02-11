$(function() {

  var currentUser;              // Currently selected name in the dropdown
  var data;                     // Data from data.json
  var space = '&#8203;'    // Whitespace for correcting contenteditable

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

  // TODO: allow items to be added to data;
  // fix X being lowered when removing previously added text;
  // allow editing of any line with automatic saving to data;
  // make sure delete works on added items.

  // Select new item's <li> to focus on span
  $(document).on('click', 'li', function() {
    $(this).find('span').focus();
  });

  // Select new item's span
  $(document).on('focus', '#new-item span', function() {
    $(this).css('color', '#000');
    if($(this).text() == 'New Item') {
      $(this).text('');
    }
  });

  // Deselect new item
  $(document).on('blur', '#new-item span', function() {
    if($(this).text() == '') {
      $(this).css('color', '#CCC');
      $(this).text('New Item');
    } else {
      var newText = $(this).text();
      $('#list-items li:last-child')
        .attr("id","item")
        .removeAttr('style')
        .append('<div id="delete"> \
                  <i class="fa fa-times"></i> \
                </div>');
      $('#list-items')
        .append('<li id="new-item">' + space + ' \
                  <span contenteditable="true">New Item</span> \
                ' + space + '</li>');
    }
  });

  // Deselect existing item
  $(document).on('blur', '#item span', function() {
    if($(this).text() == '') {
      $(this).remove();
    } else {
      var newText = $(this).text();
    }
  });

  // Remove deleted item from data
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
    var output = '<ul id="list-items">';
    $.each(data, function (key, val) {
      if( currentUser == val.user ) {
        for( var i = 0; i < val.list.length; i++) {
          output += '<li id="item">' + space + '<span contenteditable="true">';
          output += val.list[i];
          output += '</span>' + space + '</li>';
        }
        return false;
      }
    });
    output += '</ul>';
    $('#list').html(output);
    $('li').append('<div id="delete"> \
                    <i class="fa fa-times"></i> \
                  </div>');
    $('#list-items')
      .append('<li id="new-item">' + space + ' \
                <span contenteditable="true">New Item</span> \
              ' + space + '</li>');
  }

});
