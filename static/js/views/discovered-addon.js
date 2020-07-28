/**
 * DiscoveredAddon.
 *
 * Represents an add-on available to be installed.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('../api');
const fluent = require('../fluent');
const Utils = require('../utils');

class DiscoveredAddon {
  /**
   * DiscoveredAddon constructor.
   *
   * @param Object description DiscoveredAddon metadata object.
   */
  constructor(metadata, installedAddonsMap, availableAddonsMap) {
    this.id = metadata.id;
    this.name = metadata.name;
    this.description = metadata.description;
    this.author = metadata.author;
    this.homepageUrl = metadata.homepage_url;
    this.licenseUrl = metadata.license_url;
    this.version = metadata.version;
    this.primaryType = metadata.primary_type;
    this.url = metadata.url;
    this.checksum = metadata.checksum;
    this.installed = metadata.installed;
    this.installedAddonsMap = installedAddonsMap;
    this.availableAddonsMap = availableAddonsMap;
    this.container = document.getElementById('discovered-addons-list');
    this.render();
  }

  /**
   * HTML view for DiscoveredAddon.
   */
  view() {
    let el;
    if (this.installed) {
      el = `<span class="addon-discovery-settings-added" data-l10n-id="addon-discovery-added"></span>`;
    } else {
      el = `
        <button id="addon-install-${Utils.escapeHtmlForIdClass(this.id)}"
          class="text-button addon-discovery-settings-add"
          data-l10n-id="addon-discovery-add">
        </button>`;
    }

    return `
      <li class="discovered-addon-item">
        <div class="addon-settings-header ${Utils.escapeHtmlForIdClass(this.primaryType)}">
          <span class="addon-settings-name">
            ${Utils.escapeHtml(this.name)}
          </span>
          <span class="addon-settings-version">
            ${Utils.escapeHtml(this.version)}
          </span>
          <span class="addon-settings-description">
            ${Utils.escapeHtml(this.description)}
          </span>
          <span class="addon-settings-author">
            ${fluent.getMessage('by')} <a href="${this.homepageUrl}" target="_blank" rel="noopener">${Utils.escapeHtml(this.author)}</a>
          </span>
          <span id="addon-license-${Utils.escapeHtmlForIdClass(this.id)}" class="addon-settings-license" 
            data-license-href="${this.licenseUrl}" data-id="${Utils.escapeHtmlForIdClass(this.id)}">
            (license)
          </span>
        </div>
        <div class="addon-settings-controls">
          ${el}
        </div>
      </li>`;
  }

  /**
   * Render DiscoveredAddon view and add to DOM.
   */
  render() {
    this.container.insertAdjacentHTML('beforeend', this.view());

    if (!this.installed) {
      const button = document.getElementById(
        `addon-install-${Utils.escapeHtmlForIdClass(this.id)}`);
      button.addEventListener('click', this.handleInstall.bind(this));
    }
      
    const licenseButton = document.getElementById(
      `addon-license-${Utils.escapeHtmlForIdClass(this.id)}`);
    licenseButton.addEventListener('click', this.handleLicense.bind(this));
	  
  }

  /**
   * Handle a click on the install button.
   */
  handleInstall(e) {
    const controlDiv = e.target.parentNode;
    const installing =
      `<span class="addon-discovery-settings-installing"
             data-l10n-id="addon-discovery-installing"></span>`;
    controlDiv.innerHTML = installing;

    API.installAddon(this.id, this.url, this.checksum)
      .then((settings) => {
        const el = `<span class="addon-discovery-settings-added"
          data-l10n-id="addon-discovery-added"></span>`;
        controlDiv.innerHTML = el;
        const addon = this.availableAddonsMap.get(this.id);
        if (addon) {
          addon.installed = true;
        }
        this.installedAddonsMap.set(this.id, settings);

        if (settings.content_scripts && settings.content_scripts.length > 0) {	
          window.location.reload();	
        }
      })
      .catch((err) => {
        console.error(`Failed to install add-on: ${this.id}\n${err}`);
        const el =
          `<span class="addon-discovery-settings-install-failed"
                 data-l10n-id="addon-discovery-failed"></span>`;
        controlDiv.innerHTML = el;
      });
  }
  
  /**
   * Handle a click on the license button.
   */
  handleLicense(e) {
		if(e.target.getAttribute('data-id')) {
			const license_url = "https://api.mozilla-iot.org:8443/addons/license/" + e.target.getAttribute('data-id');

			var modal = document.getElementById('media-modal');
			
			if(modal == null){
		  	var modal_container = document.createElement('div');
		  	modal_container.className = "media-modal";
				modal_container.id = "media-modal";
			
		  	var modal_frame = document.createElement('div');
		  	modal_frame.className = "media-modal-frame";
		  	modal_frame.innerHTML = '<div class="media-modal-close" id="modal-close-button"></div><div class="media-modal-content"><p id="media-modal-text">Loading...</p></div>';

		  	modal_container.appendChild(modal_frame);
		  	document.body.appendChild(modal_container);
				
				var modal_close_button = document.getElementById('modal-close-button');
		    modal_close_button.addEventListener(
		      'click',
		      () => {
					  modal = document.getElementById("media-modal");
					  modal.parentNode.removeChild(modal);
		      }
		    );
				
				fetch(license_url).then(response => {
				  if (!response.ok) {
				    throw new Error("HTTP error " + response.status);
						document.getElementById("media-modal-text").innerText = "Error while trying to load license";
				  }
				  return response.text();
				})
				.then(data => {
				  document.getElementById("media-modal-text").innerText = data;
			  })
				.catch((error) => {
				  document.getElementById("media-modal-text").innerText = "Connection error while trying to load license";
				});
						
			}	
		}
  }
    
}

module.exports = DiscoveredAddon;
