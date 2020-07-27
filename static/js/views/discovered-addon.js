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
          <span id="addon-license-${Utils.escapeHtmlForIdClass(this.id)}" class="addon-settings-license" data-license-href="${this.licenseUrl}">
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
	  
      const licenseButton = document.getElementById(
        `addon-license-${Utils.escapeHtmlForIdClass(this.id)}`);
      licenseButton.addEventListener('click', this.handleLicense.bind(this));
	  
    }
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
		console.log(e);
	  //const button = e.target;
		console.log(e.target);
		const data_href = e.target.getAttribute('data-license-href');
	  console.log("data_href = " + data_href);
		
		if(e.target.getAttribute('data-license-href')) {
			
			const license_url = e.target.getAttribute("data-license-href");
			console.log(license_url);
			
			var url = license_url.replace("blob/", "");
			url = url.replace("https://github.com/", "https://raw.githubusercontent.com/");

			
			
			var modal = document.getElementById('media-modal');
			
			if(modal == null){
				console.log("modal was null");
		  	var overlay_container = document.createElement('div');
		  	overlay_container.className = "media-modal";
				overlay_container.id = "media-modal";
			
		  	var overlay_frame = document.createElement('div');
		  	overlay_frame.className = "media-modal-frame";

		  	overlay_frame.innerHTML = '<div class="media-modal-close" id="modal-close-button"></div><div class="media-modal-content"><p><span>License text license text License text license text License text license text License text license text License text license text License text license text License text license text License text license text License text license text License text license text</span></p><iframe src="' + url + '"></iframe></div>';

		  	overlay_container.appendChild(overlay_frame);
		  	document.body.appendChild(overlay_container);
				console.log("appended overlay to body");
			
				var modal_close_button = document.getElementById('modal-close-button');
		    modal_close_button.addEventListener(
		      'click',
		      () => {
						console.log("close button clicked");
					  var elem = document.getElementById("media-modal");
					  elem.parentNode.removeChild(elem);
		      }
		    );
				
				//fetch(url,{"mode": "no-cors","credentials": "omit"}).then(response => {
				fetch(url).then(response => {
							console.log("fetch response:");
							console.log(response);
				      if (!response.ok) {
				      	throw new Error("HTTP error " + response.status); // Rejects the promise
				      }
				    })
						.then(data => {
						  console.log('Success:', data);
							console.log(data);
							console.log(data.body);
						})
						.catch((error) => {
						  console.error('Error:', error);
						});
				
				
				
			}	
		}
  }
    
}

module.exports = DiscoveredAddon;
