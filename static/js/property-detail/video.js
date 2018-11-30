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

const API = require('../api');
const Hls = require('hls.js/dist/hls.min');
const Utils = require('../utils');

class VideoDetail {
  constructor(thing, name, property) {
    this.thing = thing;
    this.name = name;
    this.label = property.label || name;
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
    element.innerHTML = `
      <div class="media-modal">
        <div class="media-modal-close"></div>
        <div class="media-modal-frame">
          <video class="media-modal-video" controls autoplay></video>
          </video>
        </div>
      </div>
      `;

    document.body.appendChild(element);

    element.querySelector('.media-modal-close').addEventListener(
      'click',
      () => {
        document.body.removeChild(element);
      }
    );

    const video = document.querySelector('.media-modal-video');

    if (this.dashHref) {
      const player = window.dashjs.MediaPlayer().create();
      player.extend('RequestModifier', () => {
        return {
          modifyRequestHeader: (xhr) => {
            xhr.setRequestHeader('Authorization', `Bearer ${API.jwt}`);
            return xhr;
          },
          modifyRequestURL: (url) => {
            return url;
          },
        };
      });
      player.initialize(video, this.dashHref, true);
    } else if (this.hlsHref) {
      const config = Hls.DefaultConfig;
      config.xhrSetup = (xhr) => {
        xhr.setRequestHeader('Authorization', `Bearer ${API.jwt}`);
      };
      config.fetchSetup = (context, initParams) => {
        return new Request(
          context,
          Object.assign(
            initParams,
            {
              headers: {
                Authorization: `Bearer ${API.jwt}`,
              },
            })
        );
      };
      Hls.DefaultConfig = config;
      const hls = new Hls();
      hls.loadSource(this.hlsHref);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    }
  }
}

module.exports = VideoDetail;
