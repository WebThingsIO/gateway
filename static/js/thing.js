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

const ActionDetail = require('./property-detail/action');
const App = require('./app');
const BooleanDetail = require('./property-detail/boolean');
const BrightnessDetail = require('./property-detail/brightness');
const ColorDetail = require('./property-detail/color');
const ColorTemperatureDetail = require('./property-detail/color-temperature');
const Constants = require('./constants');
const CurrentDetail = require('./property-detail/current');
const EnumDetail = require('./property-detail/enum');
const FrequencyDetail = require('./property-detail/frequency');
const InstantaneousPowerDetail =
  require('./property-detail/instantaneous-power');
const LevelDetail = require('./property-detail/level');
const NumberDetail = require('./property-detail/number');
const OnOffDetail = require('./property-detail/on-off');
const StringDetail = require('./property-detail/string');
const ThingDetailLayout = require('./thing-detail-layout');
const Utils = require('./utils');
const VoltageDetail = require('./property-detail/voltage');

class Thing {
  /**
   * Thing constructor.
   *
   * @param {Object} description Thing description object.
   * @param {String} format 'svg', 'html', or 'htmlDetail'.
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

    this.name = description.name;
    this.type = description.type;
    this.model = model;
    this.listeners = [];

    if (Array.isArray(description['@type']) &&
        description['@type'].length > 0) {
      this['@type'] = description['@type'];
    } else {
      this['@type'] = Utils.legacyTypeToCapabilities(this.type);
    }

    this.selectedCapability = description.selectedCapability;
    this.iconHref = description.iconHref || '';
    this.baseIcon = opts.baseIcon || '/optimized-images/thing-icons/thing.svg';
    this.format = format;
    this.displayedProperties = this.displayedProperties || {};
    this.displayedActions = this.displayedActions || {};

    if (format === 'svg') {
      this.container = document.getElementById('floorplan-things');
      this.x = description.floorplanX;
      this.y = description.floorplanY;
    } else {
      this.container = document.getElementById('things');
    }

    this.uiHref = null;
    if (description.links) {
      for (const link of description.links) {
        if (link.rel === 'alternate' &&
            link.mediaType === 'text/html' &&
            link.href.startsWith('http')) {
          this.uiHref = link.href;
          break;
        }
      }
    }

    // Parse base URL of Thing
    if (description.href) {
      this.href = new URL(description.href, App.ORIGIN);
      this.eventsHref = `${this.href.pathname}/events?referrer=${
        encodeURIComponent(this.href.pathname)}`;
      this.id = this.href.pathname.split('/').pop();
    }

    // Parse properties
    if (description.properties) {
      this.propertyDescriptions = {};
      for (const name in description.properties) {
        const property = description.properties[name];
        const href = property.href;

        if (!property.href) {
          continue;
        }

        this.propertyDescriptions[name] = property;

        let detail;
        switch (property['@type']) {
          case 'BooleanProperty':
            detail = new BooleanDetail(this, name, property);
            break;
          case 'OnOffProperty':
            detail = new OnOffDetail(this, name, property);
            break;
          case 'LevelProperty':
            detail = new LevelDetail(this, name, property);
            break;
          case 'BrightnessProperty':
            detail = new BrightnessDetail(this, name, property);
            break;
          case 'ColorProperty':
            detail = new ColorDetail(this, name, property);
            break;
          case 'ColorTemperatureProperty':
            detail = new ColorTemperatureDetail(this, name, property);
            break;
          case 'InstantaneousPowerProperty':
            detail = new InstantaneousPowerDetail(this, name, property);
            break;
          case 'CurrentProperty':
            detail = new CurrentDetail(this, name, property);
            break;
          case 'VoltageProperty':
            detail = new VoltageDetail(this, name, property);
            break;
          case 'FrequencyProperty':
            detail = new FrequencyDetail(this, name, property);
            break;
          default:
            if (defaults.hasOwnProperty(name)) {
              let detailType = defaults[name];
              if (name === 'level' && this['@type'].includes('Light')) {
                detailType = defaults.brightness;
              }

              detail = new detailType(this, name, property);
            } else if (property.enum) {
              detail = new EnumDetail(this, name, property);
            } else {
              switch (property.type) {
                case 'string':
                  detail = new StringDetail(this, name, property);
                  break;
                case 'integer':
                case 'number':
                  detail = new NumberDetail(this, name, property);
                  break;
                case 'boolean':
                  detail = new BooleanDetail(this, name, property);
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
        };
      }
    }

    if (format === 'htmlDetail') {
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
            this.displayedActions[name] = {
              detail: new ActionDetail(this, name, action, href),
            };
          }
        }
      }

      // Parse events
      const menu = [];
      if (description.events) {
        this.displayEvents = true;
        menu.push({
          href: this.eventsHref,
          name: 'Event Log',
          icon: '/optimized-images/rules-icon.png',
        });
      } else {
        this.displayEvents = false;
      }

      menu.push({
        listener: this.handleEdit.bind(this),
        name: 'Edit',
        icon: '/optimized-images/edit-plain.svg',
      }, {
        listener: this.handleRemove.bind(this),
        name: 'Remove',
        icon: '/optimized-images/remove.svg',
      });

      App.buildOverflowMenu(menu);
      App.showOverflowButton();
    } else {
      App.hideOverflowButton();
    }

    this.findProperties();
    this.element = this.render(format);

    if (format === 'svg') {
      return;
    } else if (format === 'htmlDetail') {
      this.attachHtmlDetail();
    }

    this.onPropertyStatus = this.onPropertyStatus.bind(this);
    this.onEvent = this.onEvent.bind(this);
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
  attachHtmlDetail() {
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
    return `<a href="${this.uiHref}" class="thing-ui-link" target="_blank"
               rel="noopener"></a>`;
  }

  /**
   * HTML view for Thing.
   */
  htmlView() {
    return `<div class="thing">
      ${this.uiHref ? this.uiLink() : ''}
      ${this.detailLink()}
      ${this.iconView()}
      <span class="thing-name">${Utils.escapeHtml(this.name)}</span>
    </div>`;
  }

  /**
   * HTML detail view for Thing.
   */
  htmlDetailView() {
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
    if (this.format === 'htmlDetail' &&
        this.displayedProperties.hasOwnProperty(name)) {
      this.displayedProperties[name].detail.update(value);
    }
  }

  /**
   * Set the provided property.
   *
   * @param {String} name Name of the property
   * @param {*} value Value of the property
   */
  setProperty(name, value) {
    this.model.setProperty(name, value);
  }

  /**
   * Update the status of Thing.
   */
  updateStatus() {
    this.model.subscribe(Constants.STATE_PROPERTIES,
                         this.onPropertyStatus);
    this.model.subscribe(Constants.OCCUR_EVENT, this.onEvent);
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
    let listenr;
    while (typeof (listenr = this.listeners.pop()) !== 'undefined') {
      listenr.element.removeEventListener(listenr.event, listenr.handler);
    }
    this.model.unsubscribe(Constants.STATE_PROPERTIES,
                           this.onPropertyStatus);
    this.model.unsubscribe(Constants.OCCUR_EVENT, this.onEvent);
  }

  /**
   * Generate a wrapped svg text element containing the provided text
   * @param {String} text
   * @return {Element}
   */
  makeWrappedSVGText(text) {
    const lineHeight = 2.5;
    const lineWidth = 12;
    const x = 0;
    let y = 8;
    let row = '';
    const words = text.split(' ');

    const textElt =
      document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElt.setAttribute('x', x);
    textElt.setAttribute('y', y);
    textElt.setAttribute('text-anchor', 'middle');
    textElt.classList.add('svg-thing-text');

    function makeTSpan(textContent) {
      const tspan =
        document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute('x', x);
      tspan.setAttribute('y', y);
      tspan.textContent = textContent;
      return tspan;
    }

    while (words.length > 0) {
      const word = words.shift();
      if (row.length + word.length + 1 < lineWidth) {
        row += ` ${word}`;
      } else {
        textElt.appendChild(makeTSpan(row));
        row = word;
        y += lineHeight;
      }
    }
    if (row) {
      textElt.appendChild(makeTSpan(row));
    }

    return textElt;
  }

  /**
   * SVG view for Thing.
   */
  svgView() {
    return `<g transform="translate(${this.x},${this.y})"
              dragx="${this.x}" dragy="${this.y}"
              class="floorplan-thing">
              <a xlink:href="${encodeURI(this.href)}?referrer=%2Ffloorplan"
                 class="svg-thing-link">
                <circle cx="0" cy="0" r="5" class="svg-thing-icon" />
                <image x="-5" y="-5" width="10" height="10"
                  xlink:href="${encodeURI(this.baseIcon)}" />
                ${this.makeWrappedSVGText(this.name).outerHTML}
              </a>
            </g>`;
  }

  /**
   * Render Thing view and add to DOM.
   *
   * @param {String} format 'svg' or 'html'.
   */
  render(format) {
    let element;
    if (format == 'svg') {
      element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      element.innerHTML = this.svgView().trim();
    } else {
      element = document.createElement('div');
      if (format == 'htmlDetail') {
        element.innerHTML = this.htmlDetailView().trim();
      } else {
        element.innerHTML = this.htmlView().trim();
      }
    }
    return this.container.appendChild(element.firstChild);
  }

  /**
   * Handle an edit click event.
   */
  handleEdit() {
    const newEvent = new CustomEvent('_contextmenu', {
      detail: {
        thingId: this.id,
        thingName: this.name,
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
        thingName: this.name,
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
}

module.exports = Thing;
