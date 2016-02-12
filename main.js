$(function() {

  var currentUser;         // Currently selected name in the dropdown
  var data;                // Data from data.json
  var space = '&#8203;'    // Whitespace for correcting contenteditable
  var oldText;             // Item name before editing

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

  // Remove item from data and its <li> when clicking "X"
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

  // Select a <li> to focus on <span>
  $(document).on('click', 'li', function(e) {
    // Find whether <li> was clicked in the left or right side
    var el = this.getElementsByTagName('span')[0];
    var range = document.createRange();
    var sel = window.getSelection();
    // Calculate width and position of element
    var pWidth = $(this).innerWidth();
    var pOffset = $(this).offset();
    var x = e.pageX - pOffset.left;
    if( pWidth/2 > x ) {
      // <li> clicked in the left side
      // Set text cursor at the beginning
      range.setStart(el, 0);
    } else {
      // <li> clicked in the right side
      // Set text cursor at the end
      range.setStart(el, 1);
    }
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  });

  // Select NEW item's <span>
  $(document).on('focus', '#new-item span', function() {
    $(this).css('color', '#000');
    if($(this).text() == 'New Item') {
      $(this).text('');
    }
  });

  // Deselect NEW item's <span>
  $(document).on('blur', '#new-item span', function() {
    if($(this).text() == '') {
      $(this).removeAttr('style');
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
      addItem($(this).text());
    }
  });

  // Select EXISTING item's <span>
  $(document).on('click', '#item span', function(event) {
    event.stopPropagation();
    oldText = $(this).text();
  });

  // Deselect EXISTING item's <span>
  $(document).on('blur', '#item span', function() {
    if($(this).text() == '') {
      $(this).parent().remove();
    }
    if($(this).text !== oldText) {
      changeItem($(this).text(), $(this).parent().index());
    }
  });

  // Override action of pressing the Enter key when editing
  // Instead bring focus to the New Item field
  $(document).on('keyup keypress', 'span', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      this.blur();
      $('span:last').focus();
      return false;
    }
  });

  // Add new item to current user
  function addItem(item) {
    $.each(data, function (key, val) {
      if( currentUser == val.user ) {
        val.list.push(item);
        return false;
      }
    });
  }

  function changeItem(item, index) {
    $.each(data, function (key, val) {
      if( currentUser == val.user ) {
        val.list.splice(index, 1, item);
        return false;
      }
    });
  }

  // Remove deleted item from data
  function deleteItemAtIndex(index) {
    $.each(data, function (key, val) {
      if( currentUser == val.user ) {
        val.list.splice(index, 1);
        return false;
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
