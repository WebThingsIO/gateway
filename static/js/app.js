/**
 * WebThings Gateway App.
 *
 * Front end main script.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

// eslint-disable-next-line prefer-const
let API;
// eslint-disable-next-line prefer-const
let AssistantScreen;
// eslint-disable-next-line prefer-const
let GatewayModel;
// eslint-disable-next-line prefer-const
let ThingsScreen;
// eslint-disable-next-line prefer-const
let AddThingScreen;
// eslint-disable-next-line prefer-const
let Menu;
// eslint-disable-next-line prefer-const
let ContextMenu;
// eslint-disable-next-line prefer-const
let SettingsScreen;
// eslint-disable-next-line prefer-const
let FloorplanScreen;
// eslint-disable-next-line prefer-const
let Router;
// eslint-disable-next-line prefer-const
let RulesScreen;
// eslint-disable-next-line prefer-const
let RuleScreen;
// eslint-disable-next-line prefer-const
let LogsScreen;
// eslint-disable-next-line prefer-const
let Speech;

const shaka = require('shaka-player/dist/shaka-player.compiled');
const MobileDragDrop = require('mobile-drag-drop/index.min');
const ScrollBehavior = require('mobile-drag-drop/scroll-behaviour.min');
const Notifications = require('./notifications');
const Utils = require('./utils');

const App = {
  /**
   * Current server host.
   */
  HOST: window.location.host,

  /**
   * Current server origin.
   */
  ORIGIN: window.location.origin,

  /**
   * Maximum number of allowed ping failures.
   */
  MAX_PING_FAILURES: 3,

  /**
   * Interval at which to ping to check for connectivity.
   */
  PING_INTERVAL: 20 * 1000,

  /**
   * Start WebThings Gateway app.
   */
  init: function() {
    // Load the shaka player polyfills
    shaka.polyfill.installAll();
    MobileDragDrop.polyfill({
      holdToDrag: 500,
      // eslint-disable-next-line max-len
      dragImageTranslateOverride: ScrollBehavior.scrollBehaviourDragImageTranslateOverride,
    });

    AddThingScreen.init();
    ContextMenu.init();
    AssistantScreen.init();
    ThingsScreen.init();
    SettingsScreen.init();
    FloorplanScreen.init();

    if (navigator.mediaDevices && window.MediaRecorder) {
      Speech.init();
    }

    RulesScreen.init();
    RuleScreen.init();

    LogsScreen.init();

    this.views = [];
    this.views.things = document.getElementById('things-view');
    this.views.floorplan = document.getElementById('floorplan-view');
    this.views.settings = document.getElementById('settings-view');
    this.views.rules = document.getElementById('rules-view');
    this.views.rule = document.getElementById('rule-view');
    this.views.assistant = document.getElementById('assistant-view');
    this.views.logs = document.getElementById('logs-view');
    this.currentView = 'things';
    this.menuButton = document.getElementById('menu-button');
    this.menuButton.addEventListener('click', Menu.toggle.bind(Menu));
    this.overflowButton = document.getElementById('overflow-button');
    this.overflowButton.addEventListener('click',
                                         this.toggleOverflowMenu.bind(this));
    this.overflowMenu = document.getElementById('overflow-menu');
    this.blockMessages = false;
    this.messageArea = document.getElementById('message-area');
    this.messageTimeout = null;

    this.connectivityOverlay = document.getElementById('connectivity-scrim');
    this.pingerInterval = null;
    this.pingerLastStatus = null;
    this.failedPings = 0;
    this.startPinger();

    this.gatewayModel = new GatewayModel();

    this.wsBackoff = 1000;
    this.initWebSocket();

    Menu.init();
    Router.init();
  },

  initWebSocket() {
    const path = `${this.ORIGIN.replace(/^http/, 'ws')}/internal-logs?jwt=${API.jwt}`;
    this.messageSocket = new WebSocket(path);

    this.messageSocket.addEventListener('open', () => {
      // Reset the backoff period
      this.wsBackoff = 1000;
    }, {once: true});

    const onMessage = (msg) => {
      const message = JSON.parse(msg.data);
      if (message && message.message) {
        this.showMessage(message.message, 5000, message.url);
      }
    };

    const cleanup = () => {
      this.messageSocket.removeEventListener('message', onMessage);
      this.messageSocket.removeEventListener('close', cleanup);
      this.messageSocket.removeEventListener('error', cleanup);
      this.messageSocket.close();
      this.messageSocket = null;

      setTimeout(() => {
        this.wsBackoff *= 2;
        if (this.wsBackoff > 30000) {
          this.wsBackoff = 30000;
        }
        this.initWebSocket();
      }, this.wsBackoff);
    };

    this.messageSocket.addEventListener('message', onMessage);
    this.messageSocket.addEventListener('close', cleanup);
    this.messageSocket.addEventListener('error', cleanup);
  },

  startPinger() {
    fetch(
      `${this.ORIGIN}/ping`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    ).then((res) => {
      if (!res.ok) {
        throw new Error(`Bad return status: ${res.status}`);
      }

      if (this.pingerLastStatus === 'offline') {
        window.location.reload();
      } else {
        this.failedPings = 0;
        this.pingerLastStatus = 'online';
        this.connectivityOverlay.classList.add('hidden');
        this.messageArea.classList.remove('disconnected');

        if (this.messageArea.innerText === 'Gateway Unreachable') {
          this.hidePersistentMessage();
        }
      }
    }).catch((e) => {
      console.error('Gateway unreachable:', e);
      if (++this.failedPings >= this.MAX_PING_FAILURES) {
        this.connectivityOverlay.classList.remove('hidden');
        this.messageArea.classList.add('disconnected');
        this.showPersistentMessage('Gateway Unreachable');
        this.pingerLastStatus = 'offline';
      }
    });

    if (!this.pingerInterval) {
      this.pingerInterval =
        setInterval(this.startPinger.bind(this), this.PING_INTERVAL);
    }
  },

  showAssistant: function() {
    AssistantScreen.show();
    this.selectView('assistant');
  },

  showThings: function(context) {
    const events = context.pathname.split('/').pop() === 'events';
    ThingsScreen.show(context.params.thingId || null,
                      context.params.actionName || null,
                      events,
                      context.querystring);
    this.selectView('things');
  },

  showSettings: function(context) {
    SettingsScreen.show(context.params.section || null,
                        context.params.subsection || null,
                        context.params.id || null);
    this.selectView('settings');
  },

  showFloorplan: function() {
    FloorplanScreen.show();
    this.selectView('floorplan');
  },

  showRules: function() {
    RulesScreen.show();
    this.selectView('rules');
  },

  showRule: function(context) {
    RuleScreen.show(context.params.rule);
    this.selectView('rule');
  },

  showLogs: function(context) {
    if (context.params.thingId) {
      const descr = {
        thing: context.params.thingId,
        property: context.params.propId,
        type: 'property',
      };
      LogsScreen.show(descr);
    } else {
      LogsScreen.show();
    }
    this.selectView('logs');
  },

  selectView: function(view) {
    if (!this.views[view]) {
      console.error('Tried to select view that didnt exist');
      return;
    }
    this.views[this.currentView].classList.remove('selected');
    this.views[view].classList.add('selected');
    Menu.selectItem(view);
    this.currentView = view;
  },

  showMenuButton: function() {
    this.menuButton.classList.remove('hidden');
  },

  hideMenuButton: function() {
    this.menuButton.classList.add('hidden');
  },

  showOverflowButton: function() {
    this.overflowButton.classList.remove('hidden');
  },

  hideOverflowButton: function() {
    this.overflowMenu.classList.add('hidden');
    this.overflowButton.classList.add('hidden');
  },

  buildOverflowMenu: function(links) {
    this.overflowMenu.innerHTML = '';

    for (const link of links) {
      const element = document.createElement('a');
      element.innerText = link.name;

      if (link.listener) {
        element.href = '#';
        element.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleOverflowMenu();
          link.listener();
        });
      } else {
        element.href = link.href;
        element.addEventListener('click', () => {
          this.toggleOverflowMenu();
        });
      }

      if (link.icon) {
        const image = document.createElement('img');
        image.src = link.icon;
        image.alt = `${link.name} icon`;
        element.insertBefore(image, element.childNodes[0]);
      }

      this.overflowMenu.appendChild(element);
    }
  },

  toggleOverflowMenu: function() {
    if (this.overflowMenu.classList.contains('hidden')) {
      this.overflowMenu.classList.remove('hidden');
    } else {
      this.overflowMenu.classList.add('hidden');
    }
  },

  showPersistentMessage: function(message) {
    this.showMessage(message);
    this.blockMessages = true;
  },

  hidePersistentMessage: function() {
    if (this.blockMessages) {
      this.hideMessageArea();
      this.blockMessages = false;
    }
  },

  showMessageArea: function() {
    this.messageArea.classList.remove('hidden');
  },

  hideMessageArea: function() {
    this.messageArea.classList.add('hidden');
  },

  showMessage: function(message, duration, extraUrl = null) {
    if (this.messageTimeout !== null) {
      clearTimeout(this.messageTimeout);
      this.messageTimeout = null;
    }

    if (this.blockMessages) {
      return;
    }

    if (extraUrl) {
      message += `<br><br>
        <a href="${Utils.escapeHtml(extraUrl)}" target="_blank" rel="noopener">
          More Information
        </a>`;
    }

    this.messageArea.innerHTML = message;
    this.showMessageArea();

    if (typeof duration === 'number') {
      this.messageTimeout = setTimeout(() => {
        this.messageTimeout = null;
        this.hideMessageArea();
      }, duration);
    }
  },
};

module.exports = App;

// avoid circular dependency
API = require('./api');
AssistantScreen = require('./views/assistant');
GatewayModel = require('./models/gateway-model');
ThingsScreen = require('./views/things');
AddThingScreen = require('./views/add-thing');
Menu = require('./views/menu');
ContextMenu = require('./context-menu');
SettingsScreen = require('./views/settings');
FloorplanScreen = require('./views/floorplan');
Router = require('./router');
RulesScreen = require('./views/rules-screen');
RuleScreen = require('./views/rule-screen');
LogsScreen = require('./views/logs-screen');
Speech = require('./speech');

// load web components
require('@webcomponents/webcomponentsjs/webcomponents-bundle');
require('./components/capability/alarm');
require('./components/capability/binary-sensor');
require('./components/capability/camera');
require('./components/capability/color-control');
require('./components/capability/custom');
require('./components/capability/door-sensor');
require('./components/capability/energy-monitor');
require('./components/capability/label');
require('./components/capability/leak-sensor');
require('./components/capability/light');
require('./components/capability/motion-sensor');
require('./components/capability/multi-level-sensor');
require('./components/capability/multi-level-switch');
require('./components/capability/on-off-switch');
require('./components/capability/push-button');
require('./components/capability/smart-plug');
require('./components/capability/temperature-sensor');
require('./components/capability/video-camera');
require('./components/icon/custom');
require('./components/property/action');
require('./components/property/alarm');
require('./components/property/boolean');
require('./components/property/brightness');
require('./components/property/color');
require('./components/property/color-temperature');
require('./components/property/current');
require('./components/property/enum');
require('./components/property/frequency');
require('./components/property/image');
require('./components/property/instantaneous-power');
require('./components/property/leak');
require('./components/property/level');
require('./components/property/motion');
require('./components/property/number');
require('./components/property/numeric-label');
require('./components/property/on-off');
require('./components/property/open');
require('./components/property/pushed');
require('./components/property/slider');
require('./components/property/string');
require('./components/property/string-label');
require('./components/property/switch');
require('./components/property/temperature');
require('./components/property/video');
require('./components/property/voltage');

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js', {
    scope: '/',
  });
  navigator.serviceWorker.ready.then(Notifications.onReady);
}

/**
  * Start app on page load.
  */
window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  App.init();
});
