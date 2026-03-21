// ==UserScript==
// @name         assd-login
// @namespace    Violentmonkey Scripts
// @version      1.0.2
// @description  Auto-submits login after Bitwarden fills credentials; clicks post-login nav links
// @match        https://*-*.assd.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/KaiserXanderW/assd-login/main/assd-login.user.js
// @downloadURL  https://raw.githubusercontent.com/KaiserXanderW/assd-login/main/assd-login.user.js
// ==/UserScript==

(function () {
  'use strict';

  const USERNAME_SELECTOR     = 'input[type="text"], input[type="email"]';
  const PASSWORD_SELECTOR     = 'input[type="password"]';
  const LOGIN_BUTTON_SEL      = 'input.btn.btn-default.center-block[name="submit"][type="submit"]';
  const TAGES_LINK_SELECTOR   = 'a[href="/a_dayview/index"][title="Tagesübersicht"]';
  const RESERV_LINK_SELECTOR  = 'a[href="/s_reser/list"][title="Reservierung"]';

  let postLoginObserver = null;

  function setupPostLoginClicks() {
    if (postLoginObserver) return;

    const tagesLink = document.querySelector(TAGES_LINK_SELECTOR);
    const reservLink = document.querySelector(RESERV_LINK_SELECTOR);

    if (tagesLink && reservLink) {
      console.log('[assd-login] Both post-login links ready; clicking...');
      tagesLink.click();
      setTimeout(() => reservLink.click(), 800);
      return;
    }

    console.log('[assd-login] Setting up observer for post-login links...');
    postLoginObserver = new MutationObserver(() => {
      const tagesLink = document.querySelector(TAGES_LINK_SELECTOR);
      const reservLink = document.querySelector(RESERV_LINK_SELECTOR);

      if (tagesLink && reservLink && !tagesLink.clicked) {
        console.log('[assd-login] Post-login links detected; clicking...');
        tagesLink.click();
        tagesLink.clicked = true;
        setTimeout(() => {
          if (reservLink && !reservLink.clicked) {
            reservLink.click();
            reservLink.clicked = true;
          }
        }, 800);
        postLoginObserver.disconnect();
      }
    });

    postLoginObserver.observe(document.body, { childList: true, subtree: true });
  }

  window.addEventListener('load', () => {
    setTimeout(checkAndAct, 1500);

    function checkAndAct() {
      const userField = document.querySelector(USERNAME_SELECTOR);
      const passField = document.querySelector(PASSWORD_SELECTOR);
      const loginBtn  = document.querySelector(LOGIN_BUTTON_SEL);

      if (userField && passField && loginBtn) {
        if (userField.value && passField.value) {
          console.log('[assd-login] Credentials ready; submitting...');
          loginBtn.click();
          return;
        }
        console.log('[assd-login] Waiting for Bitwarden fill...');
        setTimeout(checkAndAct, 1000);
      } else {
        setupPostLoginClicks();
      }
    }
  });
})();
