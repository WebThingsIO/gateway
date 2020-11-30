/**
 * Transition dialog.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('../api');
const fluent = require('../fluent');

const TransitionDialog = {
  /**
   * Initialize transition dialog.
   */
  init: function() {
    this.settings = {};

    /* eslint-disable max-len */
    this.elements = {
      banner: {
        main: document.getElementById('action-required-area'),
        close: document.getElementById('action-required-close'),
        dismiss: document.getElementById('action-required-dont-ask-again'),
        choose: document.getElementById('action-required-choose'),
      },
      dialog: {
        main: document.getElementById('transition-dialog'),
        scrim: document.getElementById('transition-scrim'),
        step1: {
          main: document.getElementById('transition-dialog-step-1'),
          close: document.getElementById('transition-dialog-step-1-close'),
          domainCheckbox: document.getElementById('transition-dialog-register-domain-checkbox'),
          domainInput: document.getElementById('transition-dialog-subdomain'),
          newsletterCheckbox: document.getElementById('transition-dialog-newsletter-checkbox'),
          agreeCheckbox: document.getElementById('transition-dialog-agree-tos-checkbox'),
          emailInput: document.getElementById('transition-dialog-email'),
          register: document.getElementById('transition-dialog-register'),
        },
        step2: {
          main: document.getElementById('transition-dialog-step-2'),
          close: document.getElementById('transition-dialog-step-2-close'),
          back: document.getElementById('transition-dialog-back'),
          registering: {
            main: document.getElementById('transition-dialog-registering'),
            workingImage: document.getElementById('transition-dialog-register-status-working'),
            successImage: document.getElementById('transition-dialog-register-status-success'),
            failedImage: document.getElementById('transition-dialog-register-status-failed'),
          },
          subscribing: {
            main: document.getElementById('transition-dialog-subscribing'),
            workingImage: document.getElementById('transition-dialog-subscribe-status-working'),
            successImage: document.getElementById('transition-dialog-subscribe-status-success'),
            failedImage: document.getElementById('transition-dialog-subscribe-status-failed'),
          },
          errors: {
            generic: document.getElementById('transition-dialog-error-generic'),
            subdomainTaken: document.getElementById('transition-dialog-error-subdomain-taken'),
            registerFailed: document.getElementById('transition-dialog-error-subdomain-failed'),
            subscribeFailed: document.getElementById('transition-dialog-error-subscribe-failed'),
          },
          success: document.getElementById('transition-dialog-success'),
        },
      },
    };
    /* eslint-enable max-len */

    // Close buttons
    this.elements.banner.close.addEventListener('click', () => {
      this.elements.banner.main.classList.add('hidden');
    });
    this.elements.dialog.step1.close.addEventListener('click', () => {
      this.elements.dialog.main.classList.add('hidden');
      this.elements.dialog.scrim.classList.add('hidden');
    });
    this.elements.dialog.step2.close.addEventListener('click', () => {
      this.elements.dialog.main.classList.add('hidden');
      this.elements.dialog.scrim.classList.add('hidden');
    });

    // Dismiss button
    this.elements.banner.dismiss.addEventListener('click', () => {
      this.elements.banner.main.classList.add('hidden');

      API.putJson('/settings/transition', {}).catch((e) => {
        console.error('Failed to skip transition:', e);
      });
    });

    // Choose button
    this.elements.banner.choose.addEventListener('click', () => {
      this.elements.banner.main.classList.add('hidden');
      this.elements.dialog.main.classList.remove('hidden');
      this.elements.dialog.scrim.classList.remove('hidden');
    });

    // Back button
    this.elements.dialog.step2.back.addEventListener('click', () => {
      this.elements.dialog.step2.main.classList.add('hidden');
      this.elements.dialog.step2.back.classList.add('hidden');
      this.elements.dialog.step1.main.classList.remove('hidden');
    });

    // Checkboxes
    this.elements.dialog.step1.domainCheckbox.addEventListener(
      'change',
      this.checkValidity.bind(this)
    );
    this.elements.dialog.step1.newsletterCheckbox.addEventListener(
      'change',
      this.checkValidity.bind(this)
    );
    this.elements.dialog.step1.agreeCheckbox.addEventListener(
      'change',
      this.checkValidity.bind(this)
    );

    // Inputs
    this.elements.dialog.step1.domainInput.addEventListener(
      'input',
      this.checkValidity.bind(this)
    );
    this.elements.dialog.step1.emailInput.addEventListener(
      'input',
      this.checkValidity.bind(this)
    );

    // Register button
    this.elements.dialog.step1.register.addEventListener('click', (e) => {
      e.preventDefault();
      this.startTransition();
      return false;
    });

    API.getJson('/settings/transition').then((body) => {
      this.settings = body;

      if (!body.complete) {
        const updateBanner = document.getElementById('update-message-area');
        if (updateBanner.classList.contains('hidden')) {
          this.elements.banner.main.classList.remove('hidden');
        }
      }

      if (body.tunnel.subdomain) {
        this.elements.dialog.step1.domainInput.value = body.tunnel.subdomain;
      }
    }).catch((e) => {
      console.error('Failed to get transition settings:', e);
    });
  },

  startTransition: function() {
    const registerDomain = this.elements.dialog.step1.domainCheckbox.checked;
    const subscribeNewsletter =
      this.elements.dialog.step1.newsletterCheckbox.checked;
    const domain = this.elements.dialog.step1.domainInput.value;
    const email = this.elements.dialog.step1.emailInput.value;

    this.elements.dialog.step1.main.classList.add('hidden');

    for (const error of Object.values(this.elements.dialog.step2.errors)) {
      error.classList.add('hidden');
    }

    this.elements.dialog.step2.success.classList.add('hidden');
    this.elements.dialog.step2.back.classList.add('hidden');

    if (!registerDomain) {
      this.elements.dialog.step2.registering.main.classList.add('hidden');
    } else {
      this.elements.dialog.step2.registering.main.classList.remove('hidden');
      this.elements.dialog.step2.registering.workingImage.classList.remove(
        'hidden'
      );
      this.elements.dialog.step2.registering.successImage.classList.add(
        'hidden'
      );
      this.elements.dialog.step2.registering.failedImage.classList.add(
        'hidden'
      );
    }

    if (!subscribeNewsletter) {
      this.elements.dialog.step2.subscribing.main.classList.add('hidden');
    } else {
      this.elements.dialog.step2.subscribing.main.classList.remove('hidden');
      this.elements.dialog.step2.subscribing.workingImage.classList.remove(
        'hidden'
      );
      this.elements.dialog.step2.subscribing.successImage.classList.add(
        'hidden'
      );
      this.elements.dialog.step2.subscribing.failedImage.classList.add(
        'hidden'
      );
    }

    this.elements.dialog.step2.main.classList.remove('hidden');

    API.putJson(
      '/settings/transition',
      {
        registerDomain,
        subscribeNewsletter,
        email,
        domain,
      }
    ).then((body) => {
      if (registerDomain) {
        if (body.error && body.error.domain) {
          this.elements.dialog.step2.back.classList.remove('hidden');
          this.elements.dialog.step2.registering.workingImage.classList.add(
            'hidden'
          );
          this.elements.dialog.step2.registering.successImage.classList.add(
            'hidden'
          );
          this.elements.dialog.step2.registering.failedImage.classList.remove(
            'hidden'
          );

          if (body.error.domain.indexOf('UnavailableName') > -1) {
            this.elements.dialog.step2.errors.subdomainTaken.classList.remove(
              'hidden'
            );
          } else {
            this.elements.dialog.step2.errors.registerFailed.classList.remove(
              'hidden'
            );
          }
        } else {
          let successMessage = fluent.getMessage('transition-dialog-success');
          successMessage = successMessage.replace(
            '<<domain>>',
            // eslint-disable-next-line max-len
            `<a href="https://${domain}.webthings.io">${domain}.webthings.io</a>`,
          );
          this.elements.dialog.step2.success.innerHTML = successMessage;
          this.elements.dialog.step2.success.classList.remove('hidden');
          this.elements.dialog.step2.registering.workingImage.classList.add(
            'hidden'
          );
          this.elements.dialog.step2.registering.successImage.classList.remove(
            'hidden'
          );
          this.elements.dialog.step2.registering.failedImage.classList.add(
            'hidden'
          );
        }
      }

      if (subscribeNewsletter) {
        if (body.error && body.error.newsletter) {
          this.elements.dialog.step2.errors.subscribeFailed.classList.remove(
            'hidden'
          );
          this.elements.dialog.step2.subscribing.workingImage.classList.add(
            'hidden'
          );
          this.elements.dialog.step2.subscribing.successImage.classList.add(
            'hidden'
          );
          this.elements.dialog.step2.subscribing.failedImage.classList.remove(
            'hidden'
          );
        } else {
          this.elements.dialog.step2.subscribing.workingImage.classList.add(
            'hidden'
          );
          this.elements.dialog.step2.subscribing.successImage.classList.remove(
            'hidden'
          );
          this.elements.dialog.step2.subscribing.failedImage.classList.add(
            'hidden'
          );
        }
      }
    }).catch((e) => {
      console.error(e);
      this.elements.dialog.step2.errors.generic.classList.remove('hidden');
      this.elements.dialog.step2.back.classList.remove('hidden');
    });
  },

  checkValidity: function() {
    if (this.elements.dialog.step1.domainCheckbox.checked ||
        this.elements.dialog.step1.newsletterCheckbox.checked) {
      if (!this.validateEmail()) {
        this.elements.dialog.step1.register.disabled = true;
        return;
      }
    }

    if (this.elements.dialog.step1.domainCheckbox.checked) {
      if (!this.validateDomain()) {
        this.elements.dialog.step1.register.disabled = true;
        return;
      }
    }

    if (!this.elements.dialog.step1.agreeCheckbox.checked) {
      this.elements.dialog.step1.register.disabled = true;
      return;
    }

    this.elements.dialog.step1.register.disabled = false;
  },

  /**
   * Ensure that subdomain is valid:
   * - Contains only a-z, 0-9, and hyphens, but does not start or end with
   *   hyphen.
   * - Is not equal to "api", "www", or "ns\d*", as those are reserved.
   */
  validateDomain: function() {
    const val = this.elements.dialog.step1.domainInput.value.toLowerCase();
    const re = new RegExp(/^\s*([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])\s*$/);
    const nsRegex = new RegExp(/^ns\d*$/);
    if (!re.test(val) ||
        nsRegex.test(val) ||
        ['api', 'www'].includes(val) ||
        val.length > 63) {
      return false;
    }

    return true;
  },

  /**
   * Ensure that email is at least somewhat valid.
   */
  validateEmail: function() {
    const val = this.elements.dialog.step1.emailInput.value;
    // eslint-disable-next-line max-len
    const re = new RegExp(/^\s*[^@\s]+@(([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])\.)+[a-z0-9][a-z0-9-]*[a-z0-9]\s*$/, 'i');
    return re.test(val) && val.length <= 254;
  },
};

module.exports = TransitionDialog;
