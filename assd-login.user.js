// ==UserScript==
// @name         assd-login
// @namespace    Violentmonkey Scripts
// @version      1.0.3
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

  const LOGIN_DONE_KEY  = 'assd-login-done';
  const NAV_DONE_KEY    = 'assd-nav-done';
  const MAX_FILL_POLLS  = 30;     // 30 × 1000ms = 30s cap on Bitwarden wait
  const OBSERVER_TIMEOUT_MS = 15000;

  if (sessionStorage.getItem(LOGIN_DONE_KEY) && sessionStorage.getItem(NAV_DONE_KEY)) {
    return;
  }

  let postLoginObserver = null;
  let observerTimeoutId = null;
  let navClicked = false;

  function setupPostLoginClicks() {
    if (postLoginObserver) return;

    sessionStorage.setItem(LOGIN_DONE_KEY, '1');

    if (sessionStorage.getItem(NAV_DONE_KEY)) return;

    const tagesLink = document.querySelector(TAGES_LINK_SELECTOR);
    const reservLink = document.querySelector(RESERV_LINK_SELECTOR);

    if (tagesLink && reservLink) {
      console.log('[assd-login] Both post-login links ready; clicking...');
      tagesLink.click();
      setTimeout(() => {
        reservLink.click();
        sessionStorage.setItem(NAV_DONE_KEY, '1');
      }, 800);
      return;
    }

    console.log('[assd-login] Setting up observer for post-login links...');
    postLoginObserver = new MutationObserver(() => {
      if (navClicked) return;
      const tagesLink = document.querySelector(TAGES_LINK_SELECTOR);
      const reservLink = document.querySelector(RESERV_LINK_SELECTOR);

      if (tagesLink && reservLink) {
        console.log('[assd-login] Post-login links detected; clicking...');
        navClicked = true;
        tagesLink.click();
        setTimeout(() => {
          reservLink.click();
          sessionStorage.setItem(NAV_DONE_KEY, '1');
        }, 800);
        postLoginObserver.disconnect();
        clearTimeout(observerTimeoutId);
      }
    });

    postLoginObserver.observe(document.body, { childList: true, subtree: true });

    observerTimeoutId = setTimeout(() => {
      console.log('[assd-login] Observer timeout; giving up on nav links.');
      postLoginObserver.disconnect();
    }, OBSERVER_TIMEOUT_MS);
  }

  window.addEventListener('load', () => {
    let polls = 0;
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
        if (++polls >= MAX_FILL_POLLS) {
          console.log('[assd-login] Bitwarden fill timeout; giving up.');
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
