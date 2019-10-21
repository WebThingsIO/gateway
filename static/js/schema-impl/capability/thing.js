/**
 * Thing.
 *
 * Represents an individual web thing.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const ActionDetail = require('../action/action');
const AlarmDetail = require('../property/alarm');
const API = require('../../api');
const App = require('../../app');
const BooleanDetail = require('../property/boolean');
const BrightnessDetail = require('../property/brightness');
const ColorDetail = require('../property/color');
const ColorTemperatureDetail = require('../property/color-temperature');
const Constants = require('../../constants');
const CurrentDetail = require('../property/current');
const EnumDetail = require('../property/enum');
const FrequencyDetail = require('../property/frequency');
const fluent = require('../../fluent');
const HeatingCoolingDetail = require('../property/heating-cooling');
const ImageDetail = require('../property/image');
const InstantaneousPowerDetail = require('../property/instantaneous-power');
const LeakDetail = require('../property/leak');
const LevelDetail = require('../property/level');
const LockActionDetail = require('../action/lock');
const LockedDetail = require('../property/locked');
const MotionDetail = require('../property/motion');
const NumberDetail = require('../property/number');
const OnOffDetail = require('../property/on-off');
const OpenDetail = require('../property/open');
const PushedDetail = require('../property/pushed');
const StringDetail = require('../property/string');
const TargetTemperatureDetail = require('../property/target-temperature');
const TemperatureDetail = require('../property/temperature');
const ThermostatModeDetail = require('../property/thermostat-mode');
const ThingDetailLayout = require('./thing-detail-layout');
const UnlockActionDetail = require('../action/unlock');
const Units = require('../../units');
const Utils = require('../../utils');
const VideoDetail = require('../property/video');
const VoltageDetail = require('../property/voltage');

class Thing {
  /**
   * Thing constructor.
   *
   * @param {Object} description Thing description object.
   * @param {Number} format See Constants.ThingFormat
   * @param {Object} options Options for building the view.
   */
  constructor(model, description, format, options) {
    const opts = options || {};
    const defaults = {
      on: OnOffDetail,
      level: LevelDetail,
      instantaneousPower: InstantaneousPowerDetail,
      voltage: VoltageDetail,
      current: CurrentDetail,
      frequency: FrequencyDetail,
      brightness: BrightnessDetail,
      color: ColorDetail,
      colorTemperature: ColorTemperatureDetail,
    };

    this.title = description.title;
    this.type = description.type;
    this.model = model;
    this.listeners = [];
    this.connected = this.model.connected;

    if (Array.isArray(description['@type']) &&
        description['@type'].length > 0) {
      this['@type'] = description['@type'];
    } else {
      this['@type'] = Utils.legacyTypeToCapabilities(this.type);
    }

    this.selectedCapability = description.selectedCapability;
    this.layoutIndex = description.layoutIndex;
    this.iconHref = description.iconHref || '';
    this.baseIcon = opts.baseIcon || fluent.getMessage('thing-icons-thing-src');
    this.format = format;
    this.displayedProperties = this.displayedProperties || {};
    this.displayedActions = this.displayedActions || {};

    if (format === Constants.ThingFormat.LINK_ICON) {
      this.container = document.getElementById('floorplan');
      this.x = description.floorplanX;
      this.y = description.floorplanY;
    } else {
      this.container = document.getElementById('things');
    }

    this.uiHref = null;
    if (description.links) {
      for (const link of description.links) {
        if (link.rel === 'alternate' && link.mediaType === 'text/html') {
          if (link.href.startsWith('/proxy/')) {
            this.uiHref = `${link.href}?jwt=${API.jwt}`;
          } else if (link.href.startsWith('http://') ||
                     link.href.startsWith('https://') ||
                     link.href.startsWith('/extensions/')) {
            this.uiHref = link.href;
          }

          break;
        }
      }
    }

    // Parse base URL of Thing
    if (description.href) {
      this.href = new URL(description.href, App.ORIGIN);
      this.eventsHref = `${this.href.pathname}/events?referrer=${
        encodeURIComponent(this.href.pathname)}`;
      this.id = decodeURIComponent(this.href.pathname.split('/').pop());
    }

    // Parse properties
    if (description.properties) {
      for (const name in description.properties) {
        const property = description.properties[name];

        // Convert units, if necessary
        const convertedProperty = JSON.parse(JSON.stringify(property));
        if (property.unit) {
          const newUnit = Units.convert(0, property.unit).unit;
          if (newUnit !== property.unit) {
            convertedProperty.unit = newUnit;

            if (property.hasOwnProperty('minimum')) {
              convertedProperty.minimum =
                Units.convert(property.minimum, property.unit).value;
            }

            if (property.hasOwnProperty('maximum')) {
              convertedProperty.maximum =
                Units.convert(property.maximum, property.unit).value;
            }

            if (property.hasOwnProperty('enum')) {
              convertedProperty.enum =
                property.enum.map((v) => Units.convert(v, property.unit).value);
            }

            if (property.hasOwnProperty('multipleOf')) {
              // just delete this, as it's not really meaningful during
              // conversions
              delete convertedProperty.multipleOf;
            }
          }
        }

        let href;
        for (const link of property.links) {
          if (!link.rel || link.rel === 'property') {
            href = link.href;
            break;
          }
        }

        if (!href) {
          continue;
        }

        let detail;
        switch (property['@type']) {
          case 'BooleanProperty':
            detail = new BooleanDetail(this, name, convertedProperty);
            break;
          case 'OnOffProperty':
            detail = new OnOffDetail(this, name, convertedProperty);
            break;
          case 'LevelProperty':
            detail = new LevelDetail(this, name, convertedProperty);
            break;
          case 'BrightnessProperty':
            detail = new BrightnessDetail(this, name, convertedProperty);
            break;
          case 'ColorProperty':
            detail = new ColorDetail(this, name, convertedProperty);
            break;
          case 'ColorTemperatureProperty':
            detail = new ColorTemperatureDetail(this, name, convertedProperty);
            break;
          case 'InstantaneousPowerProperty':
            detail =
              new InstantaneousPowerDetail(this, name, convertedProperty);
            break;
          case 'CurrentProperty':
            detail = new CurrentDetail(this, name, convertedProperty);
            break;
          case 'VoltageProperty':
            detail = new VoltageDetail(this, name, convertedProperty);
            break;
          case 'FrequencyProperty':
            detail = new FrequencyDetail(this, name, convertedProperty);
            break;
          case 'MotionProperty':
            detail = new MotionDetail(this, name, convertedProperty);
            break;
          case 'OpenProperty':
            detail = new OpenDetail(this, name, convertedProperty);
            break;
          case 'LeakProperty':
            detail = new LeakDetail(this, name, convertedProperty);
            break;
          case 'PushedProperty':
            detail = new PushedDetail(this, name, convertedProperty);
            break;
          case 'ImageProperty':
            detail = new ImageDetail(this, name, convertedProperty);
            break;
          case 'VideoProperty':
            detail = new VideoDetail(this, name, convertedProperty);
            break;
          case 'TemperatureProperty':
            detail = new TemperatureDetail(this, name, convertedProperty);
            break;
          case 'AlarmProperty':
            detail = new AlarmDetail(this, name, convertedProperty);
            break;
          case 'TargetTemperatureProperty':
            detail = new TargetTemperatureDetail(this, name, convertedProperty);
            break;
          case 'ThermostatModeProperty':
            detail = new ThermostatModeDetail(this, name, convertedProperty);
            break;
          case 'HeatingCoolingProperty':
            detail = new HeatingCoolingDetail(this, name, convertedProperty);
            break;
          case 'LockedProperty':
            detail = new LockedDetail(this, name, convertedProperty);
            break;
          default:
            if (defaults.hasOwnProperty(name)) {
              let detailType = defaults[name];
              if (name === 'level' && this['@type'].includes('Light')) {
                detailType = defaults.brightness;
              }

              detail = new detailType(this, name, convertedProperty);
            } else if (property.enum) {
              detail = new EnumDetail(this, name, convertedProperty);
            } else {
              switch (property.type) {
                case 'string':
                  detail = new StringDetail(this, name, convertedProperty);
                  break;
                case 'integer':
                case 'number':
                  detail = new NumberDetail(this, name, convertedProperty);
                  break;
                case 'boolean':
                  detail = new BooleanDetail(this, name, convertedProperty);
                  break;
                default:
                  console.warn('Unable to build property detail for:',
                               property);
                  continue;
              }
            }
        }

        this.displayedProperties[name] = {
          href,
          detail,
          property,
          convertedProperty,
        };
      }
    }

    if (format === Constants.ThingFormat.EXPANDED) {
      // Parse actions
      if (description.actions) {
        let href;
        for (const link of description.links) {
          if (link.rel === 'actions') {
            href = link.href;
            break;
          }
        }

        if (href) {
          for (const name in description.actions) {
            const action = description.actions[name];

            let detail;
            switch (action['@type']) {
              case 'LockAction':
                detail = new LockActionDetail(this, name, action, href);
                break;
              case 'UnlockAction':
                detail = new UnlockActionDetail(this, name, action, href);
                break;
              default:
                detail = new ActionDetail(this, name, action, href);
                break;
            }

            this.displayedActions[name] = {detail};
          }
        }
      }

      // Parse events
      const menu = [];
      if (description.events) {
        this.displayEvents = true;
        menu.push({
          href: this.eventsHref,
          name: fluent.getMessage('event-log'),
          icon: '/optimized-images/rules-icon.png',
        });
      } else {
        this.displayEvents = false;
      }

      menu.push({
        listener: this.handleEdit.bind(this),
        name: fluent.getMessage('edit'),
        icon: '/optimized-images/edit-plain.svg',
      }, {
        listener: this.handleRemove.bind(this),
        name: fluent.getMessage('remove'),
        icon: '/optimized-images/remove.svg',
      });

      App.buildOverflowMenu(menu);
      App.showOverflowButton();
    } else {
      App.hideOverflowButton();
    }

    this.findProperties();
    this.element = this.render(format);

    if (format === Constants.ThingFormat.EXPANDED) {
      this.attachExpandedView();

      if (!this.connected) {
        App.showPersistentMessage(fluent.getMessage('disconnected'));
      }
    }

    this.onPropertyStatus = this.onPropertyStatus.bind(this);
    this.onEvent = this.onEvent.bind(this);
    this.onConnected = this.onConnected.bind(this);
    this.updateStatus();
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
  }

  /**
   * HTML view for Thing.
   */
  attachExpandedView() {
    for (const prop of Object.values(this.displayedProperties)) {
      // only attach the first time.
      if ((!prop.hasOwnProperty('attached') || !prop.attached) &&
            prop.hasOwnProperty('detail')) {
        prop.detail.attach();
        prop.attached = true;
      }
    }

    for (const action of Object.values(this.displayedActions)) {
      // only attach the first time.
      if ((!action.hasOwnProperty('attached') || !action.attached) &&
            action.hasOwnProperty('detail')) {
        action.detail.attach();
        action.attached = true;
      }
    }

    this.layout = new ThingDetailLayout(
      this, this.element.querySelectorAll('.thing-detail-container'));
  }

  /**
   * HTML icon view for Thing.
   */
  iconView() {
    const href = `data-icon-href="${this.iconHref}"` || '';
    return `
      <webthing-custom-capability ${href}>
      </webthing-custom-capability>`;
  }

  /**
   * HTML link for Thing Detail view
   */
  detailLink() {
    return `<a href="${encodeURI(this.href)}" class="thing-details-link"></a>`;
  }

  /**
   * HTML link for custom UI.
   */
  uiLink() {
    // If this is an internal link, don't open a new tab.
    if (this.uiHref.startsWith('/extensions/')) {
      return `<a href="${this.uiHref}" class="thing-ui-link"></a>`;
    }

    return `<a href="${this.uiHref}" class="thing-ui-link"
              target="_blank" rel="noopener"></a>`;
  }

  /**
   * HTML view for Thing.
   */
  interactiveView() {
    const id = `thing-${Utils.escapeHtml(this.id)}`;
    return `<div class="thing" draggable="true" id="${id}"
      data-layout-index="${this.layoutIndex}">
      ${this.uiHref ? this.uiLink() : ''}
      ${this.detailLink()}
      ${this.iconView()}
      <span class="thing-title">${Utils.escapeHtml(this.title)}</span>
    </div>`;
  }

  /**
   * HTML detail view for Thing.
   */
  expandedView() {
    let detailsHTML = '';

    for (const prop of Object.values(this.displayedProperties)) {
      if (prop.hasOwnProperty('detail')) {
        detailsHTML +=
          `<div class="thing-detail-container">${prop.detail.view()}</div>`;
      }
    }

    for (const action of Object.values(this.displayedActions)) {
      if (action.hasOwnProperty('detail')) {
        detailsHTML +=
          `<div class="thing-detail-container">${action.detail.view()}</div>`;
      }
    }

    return `<div class="thing">
      ${this.iconView()}
      ${detailsHTML}
    </div>`;
  }

  /**
   * Update the display for the provided property.
   *
   * @param {String} name Name of the property
   * @param {*} value Value of the property
   */
  updateProperty(name, value) {
    if (this.displayedProperties.hasOwnProperty(name)) {
      // Convert units, if necessary
      value = Units.convert(
        value,
        this.displayedProperties[name].property.unit,
        this.displayedProperties[name].convertedProperty.unit
      ).value;

      if (this.format === Constants.ThingFormat.EXPANDED) {
        this.displayedProperties[name].detail.update(value);
      }
    }

    return value;
  }

  /**
   * Set the provided property.
   *
   * @param {String} name Name of the property
   * @param {*} value Value of the property
   */
  setProperty(name, value) {
    // Convert units, if necessary
    value = Units.convert(
      value,
      this.displayedProperties[name].convertedProperty.unit,
      this.displayedProperties[name].property.unit
    ).value;

    // Adjust the value to match property limits
    const property = this.displayedProperties[name].property;
    value = Utils.adjustInputValue(value, property);

    this.model.setProperty(name, value);
  }

  /**
   * Update the status of Thing.
   */
  updateStatus() {
    this.model.subscribe(Constants.PROPERTY_STATUS, this.onPropertyStatus);
    this.model.subscribe(Constants.EVENT_OCCURRED, this.onEvent);
    this.model.subscribe(Constants.CONNECTED, this.onConnected);
  }

  /**
   * Add event listener and store params to cleanup listeners
   * @param {Element} element
   * @param {Event} event
   * @param {Function} handler
   */
  registerEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.listeners.push({element, event, handler});
  }

  /**
   * Cleanup added listeners and subscribed events
   */
  cleanup() {
    let listener;
    while (typeof (listener = this.listeners.pop()) !== 'undefined') {
      listener.element.removeEventListener(listener.event, listener.handler);
    }

    this.model.unsubscribe(Constants.PROPERTY_STATUS, this.onPropertyStatus);
    this.model.unsubscribe(Constants.EVENT_OCCURRED, this.onEvent);
    this.model.unsubscribe(Constants.CONNECTED, this.onConnected);
  }

  /**
   * HTML-based view for Thing on the floorplan
   * @return {String}
   */
  linkIconView() {
    return `<div
        class="floorplan-thing"
        data-x="${this.x}"
        data-y="${this.y}"
        data-href="${encodeURI(this.href)}"
        >
      ${this.iconView()}
      <div class="floorplan-thing-title">${Utils.escapeHtml(this.title)}</div>
    </div>`;
  }

  /**
   * Render Thing view and add to DOM.
   *
   * @param {Number} format See Constants.ThingFormat
   */
  render(format) {
    const element = document.createElement('div');
    if (format == Constants.ThingFormat.LINK_ICON) {
      element.innerHTML = this.linkIconView().trim();
      return this.container.appendChild(element.firstChild);
    }

    if (format == Constants.ThingFormat.EXPANDED) {
      element.innerHTML = this.expandedView().trim();
      return this.container.appendChild(element.firstChild);
    }

    element.innerHTML = this.interactiveView().trim();
    element.firstChild.ondragstart = this.handleDragStart.bind(this);
    element.firstChild.ondragover = this.handleDragOver.bind(this);
    element.firstChild.ondragenter = this.handleDragEnter.bind(this);
    element.firstChild.ondragleave = this.handleDragLeave.bind(this);
    element.firstChild.ondragend = this.handleDragEnd.bind(this);
    element.firstChild.ondrop = this.handleDrop.bind(this);

    for (const node of this.container.childNodes.values()) {
      if (node.dataset.layoutIndex > this.layoutIndex) {
        return this.container.insertBefore(element.firstChild, node);
      }
    }

    return this.container.appendChild(element.firstChild);
  }

  handleDragStart(e) {
    e.target.style.cursor = 'grabbing';
    e.dataTransfer.setData('text', e.target.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = 'move';

    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  handleDragOver(e) {
    e.preventDefault();

    this.container.childNodes.forEach((node) => {
      node.classList.remove('drag-start', 'drag-end');
    });

    let dropNode = e.target;
    while (!dropNode.classList || !dropNode.classList.contains('thing')) {
      dropNode = dropNode.parentNode;
    }

    if (dropNode) {
      e.dataTransfer.dropEffect = 'move';

      const dropX = e.clientX;
      const dropNodeStart = dropNode.getBoundingClientRect().x;
      const dropNodeWidth = dropNode.getBoundingClientRect().width;

      if ((dropX - dropNodeStart) < (dropNodeWidth / 2)) {
        dropNode.classList.add('drag-start');
      } else {
        dropNode.classList.add('drag-end');
      }
    }
  }

  handleDragEnter(e) {
    e.preventDefault();
  }

  handleDragLeave(e) {
    e.preventDefault();

    let dropNode = e.target;
    while (!dropNode.classList || !dropNode.classList.contains('thing')) {
      dropNode = dropNode.parentNode;
    }

    if (dropNode) {
      dropNode.classList.remove('drag-start', 'drag-end');
    }
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    let dropNode = e.target;
    while (!dropNode.classList || !dropNode.classList.contains('thing')) {
      dropNode = dropNode.parentNode;
    }

    const dragNode = document.getElementById(e.dataTransfer.getData('text'));

    if (!dropNode || !dragNode || dropNode.id === dragNode.id) {
      return;
    }

    const dropX = e.clientX;
    const dropNodeStart = dropNode.getBoundingClientRect().x;
    const dropNodeWidth = dropNode.getBoundingClientRect().width;

    this.container.removeChild(dragNode);

    if ((dropX - dropNodeStart) < (dropNodeWidth / 2)) {
      this.container.insertBefore(dragNode, dropNode);
    } else {
      const sibling = dropNode.nextSibling;
      if (sibling) {
        this.container.insertBefore(dragNode, sibling);
      } else {
        this.container.appendChild(dragNode);
      }
    }

    this.container.childNodes.forEach((node, index) => {
      node.dataset.layoutIndex = index;

      const id = Utils.unescapeHtml(node.id).replace(/^thing-/, '');
      API.setThingLayoutIndex(id, index).then(() => {
        App.gatewayModel.refreshThings();
      }).catch((e) => {
        console.error(`Error trying to arrange thing ${id}: ${e}`);
      });
    });
  }

  handleDragEnd() {
    this.container.childNodes.forEach((node) => {
      node.classList.remove('drag-start', 'drag-end');
      node.style.cursor = 'grab';
    });
  }

  /**
   * Handle an edit click event.
   */
  handleEdit() {
    const newEvent = new CustomEvent('_contextmenu', {
      detail: {
        thingId: this.id,
        thingTitle: this.title,
        thingIcon: this.baseIcon,
        action: 'edit',
        capabilities: this['@type'],
        selectedCapability: this.selectedCapability,
        iconHref: this.iconHref,
      },
    });
    window.dispatchEvent(newEvent);
  }

  /**
   * Handle a remove click event.
   */
  handleRemove() {
    const newEvent = new CustomEvent('_contextmenu', {
      detail: {
        thingId: this.id,
        thingTitle: this.title,
        thingIcon: this.baseIcon,
        action: 'remove',
      },
    });
    window.dispatchEvent(newEvent);
  }

  /**
   * Handle a 'propertyStatus' message.
   * @param {Object} data Property data
   */
  onPropertyStatus(data) {
    for (const prop in data) {
      if (!this.displayedProperties.hasOwnProperty(prop)) {
        continue;
      }

      const value = data[prop];
      if (typeof value === 'undefined' || value === null) {
        continue;
      }

      this.updateProperty(prop, value);
    }
  }

  /**
   * Handle an 'event' message.
   * @param {Object} data Event data
   */
  onEvent(data) {
    if (!this.displayEvents) {
      return;
    }

    for (const name in data) {
      App.showMessage(
        `<a href="${this.eventsHref}">${Utils.escapeHtml(name)}</a>`,
        3000);
    }
  }

  /**
   * Handle a 'connected' message.
   * @param {boolean} connected - New connectivity state
   */
  onConnected(connected) {
    this.connected = connected;

    if (this.format === Constants.ThingFormat.EXPANDED) {
      if (connected) {
        this.layout.svg.classList.add('connected');
        App.hidePersistentMessage();
      } else {
        this.layout.svg.classList.remove('connected');
        App.showPersistentMessage(fluent.getMessage('disconnected'));
      }
    }

    if (connected) {
      this.element.classList.add('connected');
    } else {
      this.element.classList.remove('connected');
    }
  }
}

module.exports = Thing;
