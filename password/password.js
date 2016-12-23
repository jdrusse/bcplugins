  videojs.plugin('playerPassword', function(options){

  var player = this;

  //to pass to the options box in the player settings
  var pwDiv = document.createElement('div');
  pwDiv.className = 'vjs-passwordscreen';

  var bpb = player.el().querySelector('.vjs-big-play-button');
  player.el().insertBefore(pwDiv, bpb);

  this.one('loadedmetadata', function() {
    //make sure autoplay is disabled
    this.autoplay(false);
    this.pause();

    //show background 
    pwDiv.setAttribute('style', 'background-image: url(' + player.mediainfo.poster + ')');

    //create form and attributes
    var pwDivCover = document.createElement('div');
    pwDivCover.className = 'vjs-passwordscreen-cover';
    pwDiv.appendChild(pwDivCover);

    var pwDivInt = document.createElement('pwd');
    pwDivInt.innerHTML = 'Enter Password<br/>';

    var pwDivIntForm = document.createElement('form');
    pwDivIntForm.setAttribute('id','vjsPwdForm');
    pwDivIntForm.setAttribute('action','javascript:void(0)');

    //form handling
    pwDivIntForm.addEventListener('submit', function() {
      form = document.getElementById('vjsPwdForm');
      if (form.pwdInput.value == options.password) {              
      var hidePwd = document.getElementsByClassName('vjs-passwordscreen');
        for(var i = 0; i < hidePwd.length; i++) {
        hidePwd[i].style.visibility = 'hidden';
        }
      } else {
      alert("Invalid password");
      }
    });

    var pwDivIntInput = document.createElement('input');
    pwDivIntInput.setAttribute('type','password');
    pwDivIntInput.setAttribute('name','pwdInput');

    var pwDivIntSubmit = document.createElement('input');
    pwDivIntSubmit.setAttribute('type','submit');
    pwDivIntSubmit.setAttribute('value','Submit');

    pwDivIntForm.appendChild(pwDivIntInput);
    pwDivIntForm.appendChild(document.createElement('br'));
    pwDivIntForm.appendChild(pwDivIntSubmit);

    pwDivInt.appendChild(pwDivIntForm);
    pwDivCover.appendChild(pwDivInt);
  });
});