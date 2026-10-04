/* FlowTask — landing page behaviour */

document.addEventListener('DOMContentLoaded', function () {

  /* Header navigation is handled by anchor links (smooth scroll via CSS). */

  /* Sign-up flow */

  function startSignup() {
    var trial = document.getElementById('trial');
    if (trial) {
      trial.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = 'index.html#trial';
    }
  }

  var headerCta = document.getElementById('header-cta');
  if (headerCta) {
    headerCta.addEventListener('click', startSignup);
  }

  /* Trial form */

  var trialSubmit = document.getElementById('trial-submit');
  if (trialSubmit) {
    trialSubmit.addEventListener('click', function () {
      var form = document.getElementById('trial-form');
      var email = form.querySelector('input[name="email"]');

      if (!email.value) {
        email.style.boxShadow = '0 0 0 2px #fca5a5';
        return;
      }

      form.innerHTML = '<p>Thanks — check your inbox, the workspace is being created.</p>';
    });
  }

  /* FAQ accordion */

  document.querySelectorAll('.faq__q').forEach(function (question) {
    question.addEventListener('click', function () {
      var isOpen = question.parentElement.classList.toggle('is-open');
      question.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* Seasonal promo bar */

  window.addEventListener('load', function () {
    setTimeout(function () {
      var promo = document.createElement('div');
      promo.className = 'promo';
      promo.innerHTML = '<strong>Autumn offer</strong> 3 months of Pro for the price of one. <a href="#pricing">See plans</a>';
      document.body.insertBefore(promo, document.body.firstChild);
    }, 800);
  });

});
