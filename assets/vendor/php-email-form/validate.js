/**
* PHP Email Form Validation - v3.10
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
      if( response.ok ) {
        return response.text();
      } else {
        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.trim() == 'OK') {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      } else {
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();

 function updateTimeProgress() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); //0是1月
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const yearProgress = ((now - startOfYear) / (endOfYear - startOfYear)) * 100;

    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
	startOfWeek.setHours(0, 0, 0, 0); // 設定為星期一的零點
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    const weekProgress = ((now - startOfWeek) / (endOfWeek - startOfWeek)) * 100;

    const seasonStartMonth = Math.floor(now.getMonth() / 3) * 3;
    const startOfSeason = new Date(now.getFullYear(), seasonStartMonth, 1);
    const endOfSeason = new Date(now.getFullYear(), seasonStartMonth + 3, 1);
    const seasonProgress = ((now - startOfSeason) / (endOfSeason - startOfSeason)) * 100;


	document.getElementById("weekProgressIcon").style.left = `${weekProgress}%`;
    document.getElementById("weekProgressVal").innerText = `${weekProgress.toFixed(1)}%`;
    document.getElementById("weekProgressBar").style.width = `${weekProgress}%`;
    document.getElementById("weekProgressBar").setAttribute('aria-valuenow', weekProgress.toFixed(1));

    
	document.getElementById("seasonProgressIcon").style.left = `${seasonProgress}%`;
    document.getElementById("seasonProgressVal").innerText = `${seasonProgress.toFixed(1)}%`;
    document.getElementById("seasonProgressBar").style.width = `${seasonProgress}%`;
    document.getElementById("seasonProgressBar").setAttribute('aria-valuenow', seasonProgress.toFixed(1));

    document.getElementById("yearProgressIcon").style.left = `${yearProgress}%`;
    document.getElementById("yearProgressVal").innerText = `${yearProgress.toFixed(1)}%`;
    document.getElementById("yearProgressBar").style.width = `${yearProgress}%`;
    document.getElementById("yearProgressBar").setAttribute('aria-valuenow', yearProgress.toFixed(1));
  }
