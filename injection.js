var defaultResultCoefficient = 0.765;
var allowedUsers = ['s6504d2_120262'];

function changeMark(window, resultCoefficient) {
    if (!window || !window.document) {
        return;
    }

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
    
    var currentResultCoefficient = getCurrentResultCoefficient(window);
    
    if(currentResultCoefficient && currentResultCoefficient > resultCoefficient) {
      return;
    }

    var total = /\/\s*([0-9]+)\s*$/.exec(fonts[0].innerText);
    if (!total) {
        return;
    }
    total = parseInt(total[1]);
    if (isNaN(total)) {
        return;
    }
    
    var mark = Math.ceil(resultCoefficient * total * 100) / 100;

    fonts[0].innerText = ' ' + mark + ' / ' + total + ' ';
    fonts[1].innerText = (resultCoefficient * 100) + '%';

}

function getUserName (window) {
  var cells = window.document.querySelectorAll('form[name="show_marked_form"] td');
  var cell;
  for(var i = 0; i < cells.length; i++) {
     cell = cells[i];
     if(cell.innerText.indexOf('Имя пользователя') != -1) {
       var userName = cell.querySelector('font>font');
       return userName ? userName.innerText.trim() : null;
     }
  }
  
}

function execute () {
  var resultCoefficient = getResultCoefficient();
  changeMark(window, resultCoefficient);
  
  if(window.frames.bottom_parent && window.frames.bottom_parent.window.frames.main_win) {
     var mainWindow = window.frames.bottom_parent.window.frames.main_win.window;
     changeMark(mainWindow, resultCoefficient);
  }
}

function getResultCoefficient () {
   var resultCoefficient = sessionStorage.getItem('resultCoefficient');
   
   resultCoefficient = resultCoefficient ? parseFloat(resultCoefficient) : null;
  
   if( resultCoefficient && resultCoefficient > 0 && resultCoefficient < 1 ) {
     return resultCoefficient;
   } else {
     return defaultResultCoefficient;
   }
}

function setResultCoefficient (resultCoefficient) {
  
    if(resultCoefficient && resultCoefficient > 0 && resultCoefficient < 1 && resultCoefficient !== defaultResultCoefficient) {
       resultCoefficient = Math.ceil(resultCoefficient * 1E3) / 1E3;
       sessionStorage.setItem('resultCoefficient', resultCoefficient);
    } else {
       sessionStorage.removeItem('resultCoefficient');
    }
    
    execute();
  
}

function getCurrentResultCoefficient (window) {
  
   var font = window.document.querySelector('form[name="show_marked_form"] h2 font:nth-child(2)');
   
   if(!font) {
      return;
   }
   
   var value = font.innerText.replace('%', '').trim();
   
   value = parseFloat(value);
   
   if(isNaN(value) || value <= 0 || value > 100) {
     return;
   }
   
   value = value / 100;
   
   return value;
   
}


execute();

window.addEventListener('keyup', function(event) {
  if(event.altKey && 81 === event.keyCode ) { // q
      sessionStorage.always = true;
      execute ();
      alert(sessionStorage.always ? 'always on' : 'always off');
  }

  if(event.altKey && 87 === event.keyCode ) { // w
      sessionStorage.removeItem('always');
      alert(sessionStorage.always ? 'always on' : 'always off');
  }

  if(event.altKey && 65 === event.keyCode ) { // a
      var resultCoefficient = prompt('Set coefficient', getResultCoefficient());
      setResultCoefficient(resultCoefficient);
  }

});