/**
 * Utility functions.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = {
  escapeHtml: function(text) {
    if (typeof (text) !== 'string') {
      text = `${text}`;
    }

    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },
  escapeHtmlForIdClass: function(text) {
    if (typeof (text) !== 'string') {
      text = `${text}`;
    }

    return text
      .replace(/&/g, 'amp')
      .replace(/</g, 'lt')
      .replace(/>/g, 'gt')
      .replace(/"/g, 'quot')
      .replace(/'/g, '039')
      .replace(/\s/g, 'nbsp');
  },
  fuzzyTime: function(date) {
    const now = new Date();
    const delta = Math.round((now - date) / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    let fuzzy;
    if (delta < 5) {
      fuzzy = 'now';
    } else if (delta < minute) {
      fuzzy = `${delta} secs ago`;
    } else if (delta < 2 * minute) {
      fuzzy = '1 min ago';
    } else if (delta < hour) {
      fuzzy = `${Math.floor(delta / minute)} mins ago`;
    } else if (delta < 2 * hour) {
      fuzzy = '1 hour ago';
    } else if (delta < day) {
      fuzzy = `${Math.floor(delta / hour)} hours ago`;
    } else if (delta < 2 * day) {
      fuzzy = '1 day ago';
    } else if (delta < week) {
      fuzzy = `${Math.floor(delta / day)} days ago`;
    } else if (delta < 2 * week) {
      fuzzy = '1 week ago';
    } else if (delta < month) {
      fuzzy = `${Math.floor(delta / week)} weeks ago`;
    } else if (delta < 2 * month) {
      fuzzy = '1 month ago';
    } else if (delta < year) {
      fuzzy = `${Math.floor(delta / month)} months ago`;
    } else if (delta < 2 * year) {
      fuzzy = '1 year ago';
    } else {
      fuzzy = `${Math.floor(delta / year)} years ago`;
    }

    return fuzzy;
  },
};

module.exports = Utils;
