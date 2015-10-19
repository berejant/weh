var result = 0.765;
var allowedUsers = ['s6504d2_120262'];

function changeMark(window, result) {
    if (!window || !window.document) {
        return;
    }

    result = Math.ceil(result * 1E3) / 1E3;
    var fonts = window.document.querySelectorAll('form[name="show_marked_form"] h2 font');
    if (fonts.length < 2) {
        return;
    }
    
    if(!sessionStorage.always) {
      var userName = getUserName(window);

      if(allowedUsers.indexOf(userName) == -1) {
        return;
      }
    }

    var total = /\/\s*([0-9]+)\s*$/.exec(fonts[0].innerText);
    if (!total) {
        return;
    }
    total = parseInt(total[1]);
    if (isNaN(total)) {
        return;
    }
    var mark = Math.ceil(result * total * 100) / 100;

    fonts[0].innerText = ' ' + mark + ' / ' + total + ' ';
    fonts[1].innerText = (result * 100) + '%';

}

function getUserName (window) {
  var cells = window.document.querySelectorAll('form[name="show_marked_form"] td');
  var cell;
  for(var i = 0; i < cells.length; i++) {
     cell = cells[i];
     if(cell.innerText.indexOf('Имя пользователя') != -1) {
       var userName = cell.querySelector('font>font');
       return userName ? userName.innerText : null;
     }
  }
  
}

function execute () {
  changeMark(window, result);
  
  if(window.frames.bottom_parent && window.frames.bottom_parent.window.frames.main_win) {
     var mainWindow = window.frames.bottom_parent.window.frames.main_win.window;
     changeMark(mainWindow, result);
  }
}

execute();

window.addEventListener('keyup', function(event) {
  if(event.altKey && 81 === event.keyCode ) {
      sessionStorage.always = true;
      execute ();
      alert(sessionStorage.always ? 'always on' : 'always off');
  }

  if(event.altKey && 87 === event.keyCode ) {
      sessionStorage.removeItem('always');
      alert(sessionStorage.always ? 'always on' : 'always off');
  }

});