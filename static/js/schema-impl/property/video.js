/**
 * VideoDetail
 *
 * A bubble showing an video icon, which, when clicked, expands to a video
 * view.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('../../api');
const Utils = require('../../utils');
const shaka = require('shaka-player/dist/shaka-player.compiled');

class VideoDetail {
  constructor(thing, name, property) {
    this.thing = thing;
    this.name = name;
    this.label = property.title || name;
    this.id = `video-${Utils.escapeHtmlForIdClass(this.name)}`;

    this.dashHref = null;
    this.hlsHref = null;

    for (const link of property.links) {
      if (link.rel === 'alternate') {
        if (this.dashHref === null &&
            link.mediaType === 'application/dash+xml') {
          this.dashHref = link.href;
        } else if (this.hlsHref === null &&
                   link.mediaType === 'application/vnd.apple.mpegurl') {
          this.hlsHref = link.href;
        }
      }
    }

    this.expandVideo = this._expandVideo.bind(this);
    this.positionButtons = this._positionButtons.bind(this);
  }

  /**
   * Attach to the view.
   */
  attach() {
    this.thing.element.querySelector(`#${this.id}`).addEventListener(
      'click',
      this.expandVideo
    );
  }

  /**
   * Build the detail view.
   */
  view() {
    return `
      <webthing-video-property data-name="${Utils.escapeHtml(this.label)}"
        id="${this.id}">
      </webthing-video-property>`;
  }

  /**
   * Expand the video view.
   */
  _expandVideo() {
    const element = document.createElement('div');
    element.classList.add('media-modal-backdrop');

    if (!shaka.Player.isBrowserSupported()) {
      element.innerHTML = `
        <div class="media-modal">
          <div class="media-modal-frame">
            <div class="media-modal-close"></div>
            <div class="media-modal-error">
              Sorry, video is not supported in your browser.
            </div>
          </div>
        </div>
        `;
    } else {
      element.innerHTML = `
        <div class="media-modal">
          <div class="media-modal-frame">
            <div class="media-modal-close"></div>
            <video class="media-modal-video" controls autoplay></video>
          </div>
        </div>
        `;
    }

    document.body.appendChild(element);
    document.querySelector('#things').style.display = 'none';

    if (!shaka.Player.isBrowserSupported()) {
      this.positionButtons();
    }

    element.querySelector('.media-modal-close').addEventListener(
      'click',
      () => {
        document.body.removeChild(element);
        document.querySelector('#things').style.display = 'block';
        window.removeEventListener('resize', this.positionButtons);
      }
    );

    window.addEventListener('resize', this.positionButtons);

    if (shaka.Player.isBrowserSupported() && (this.dashHref || this.hlsHref)) {
      element.querySelector('.media-modal-video').addEventListener(
        'loadeddata',
        this.positionButtons
      );

      const video = document.querySelector('.media-modal-video');
      const player = new shaka.Player(video);

      player.getNetworkingEngine().registerRequestFilter((type, request) => {
        request.headers = {
          Authorization: `Bearer ${API.jwt}`,
        };
      });

      player.addEventListener('error', console.error);

      player.load(this.dashHref || this.hlsHref).then(() => {
        video.play();
      });
    }
  }

  _positionButtons() {
    let video = document.querySelector('.media-modal-video');
    if (!video) {
      video = document.querySelector('.media-modal-error');
    }

    const close = document.querySelector('.media-modal-close');

    const parentWidth = video.parentNode.offsetWidth;
    const parentHeight = video.parentNode.offsetHeight;
    const videoWidth = video.offsetWidth;
    const videoHeight = video.offsetHeight;
    const xPadding = (parentWidth - videoWidth) / 2;
    const yPadding = (parentHeight - videoHeight) / 2;

    close.style.right = `${xPadding}px`;
    close.style.top = `${yPadding}px`;
  }
}

module.exports = VideoDetail;
