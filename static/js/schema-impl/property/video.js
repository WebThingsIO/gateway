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

const API = require('../../api').default;
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
    this.mjpegHref = null;
    this.player = null;

    for (const form of property.forms) {
      if (this.dashHref === null && form.contentType === 'application/dash+xml') {
        this.dashHref = form.href;
      } else if (this.hlsHref === null && form.contentType === 'application/vnd.apple.mpegurl') {
        this.hlsHref = form.href;
      } else if (
        this.mjpegHref === null &&
        (form.contentType === 'video/x-motion-jpeg' || form.contentType === 'video/x-jpeg')
      ) {
        this.mjpegHref = form.href;
      }
    }

    this.expandVideo = this._expandVideo.bind(this);
    this.positionButtons = this._positionButtons.bind(this);
  }

  /**
   * Attach to the view.
   */
  attach() {
    this.thing.element.querySelector(`#${this.id}`).addEventListener('click', this.expandVideo);
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

    if (this.mjpegHref !== null) {
      element.innerHTML = `
        <div class="media-modal">
          <div class="media-modal-frame">
            <div class="media-modal-close"></div>
            <img class="media-modal-video"></img>
          </div>
        </div>
        `;
    } else if (!shaka.Player.isBrowserSupported()) {
      element.innerHTML = `
        <div class="media-modal">
          <div class="media-modal-frame">
            <div class="media-modal-close"></div>
            <div class="media-modal-error" data-l10n-id="video-unsupported">
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

    if (this.mjpegHref || !shaka.Player.isBrowserSupported()) {
      this.positionButtons();
    }

    element.querySelector('.media-modal-close').addEventListener('click', () => {
      if (this.player) {
        this.player.destroy();
        this.player = null;
      }

      document.body.removeChild(element);
      document.querySelector('#things').style.display = 'block';
      window.removeEventListener('resize', this.positionButtons);
    });

    window.addEventListener('resize', this.positionButtons);

    if (this.mjpegHref) {
      element.querySelector('.media-modal-video').addEventListener('load', this.positionButtons);
      element.querySelector('.media-modal-video').src = `${this.mjpegHref}?jwt=${API.jwt}`;
    } else if (shaka.Player.isBrowserSupported() && (this.dashHref || this.hlsHref)) {
      element
        .querySelector('.media-modal-video')
        .addEventListener('loadeddata', this.positionButtons);

      const video = document.querySelector('.media-modal-video');
      this.player = new shaka.Player(video);

      this.player.getNetworkingEngine().registerRequestFilter((type, request) => {
        request.headers = {
          Authorization: `Bearer ${API.jwt}`,
        };
      });

      this.player.addEventListener('error', (e) => {
        console.error('Error playing video:', e);
      });

      this.player
        .load(this.dashHref || this.hlsHref)
        .then(() => {
          video.play();
        })
        .catch((e) => {
          console.error('Error loading video:', e);
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
