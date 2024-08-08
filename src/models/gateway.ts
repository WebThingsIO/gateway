/**
 * Gateway Model.
 *
 * Represents the gateway and its interaction affordances, including
 * acting as a Thing Description Directory.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Constants from '../constants';
import { ThingDescription } from './thing';

export default class Gateway {
  /**
   *
   * Get a JSON Thing Description for this gateway.
   *
   * @param {String} reqHost request host, if coming via HTTP
   * @param {Boolean} reqSecure whether or not the request is secure, i.e. TLS
   * @returns {ThingDescription} A Thing Description describing the gateway.
   */
  static getDescription(reqHost?: string, reqSecure?: boolean): ThingDescription {
    const origin = `${reqSecure ? 'https' : 'http'}://${reqHost}`;
    const desc: ThingDescription = {
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://www.w3.org/2022/wot/discovery'],
      '@type': 'ThingDirectory',
      id: origin,
      base: origin,
      title: 'WebThings Gateway',
      securityDefinitions: {
        oauth2_sc: {
          scheme: 'oauth2',
          flow: 'code',
          authorization: `${origin}${Constants.OAUTH_PATH}/authorize`,
          token: `${origin}${Constants.OAUTH_PATH}/token`,
          scopes: [Constants.THINGS_PATH, `${Constants.THINGS_PATH}:readwrite`],
        },
      },
      security: 'oauth2_sc',
      properties: {
        things: {
          title: 'Things',
          description: 'Retrieve all Thing Descriptions',
          type: 'array',
          items: {
            type: 'object',
          },
          forms: [
            {
              href: '/things',
              'htv:methodName': 'GET',
              response: {
                description: 'Success response',
                'htv:statusCodeValue': 200,
                contentType: 'application/json',
              },
              additionalResponses: [
                {
                  description: 'Token must contain scope',
                  'htv:statusCodeValue': 400,
                },
              ],
            },
          ],
        },
      },
      actions: {
        createAnonymousThing: {
          description: 'Create a Thing Description',
          input: {
            type: 'object',
          },
          forms: [
            {
              href: '/things',
              'htv:methodName': 'POST',
              contentType: 'application/json',
              response: {
                'htv:statusCodeValue': 201,
              },
              additionalResponses: [
                {
                  description: 'Invalid or duplicate Thing Description',
                  'htv:statusCodeValue': 400,
                },
                {
                  description: 'Internal error saving new Thing Description',
                  'htv:statusCodeValue': 500,
                },
              ],
            },
          ],
        },
        retrieveThing: {
          description: 'Retrieve a Thing Description',
          uriVariables: {
            id: {
              '@type': 'ThingID',
              title: 'Thing Description ID',
              type: 'string',
              format: 'iri-reference',
            },
          },
          output: {
            description: 'The schema is implied by the content type',
            type: 'object',
          },
          safe: true,
          idempotent: true,
          forms: [
            {
              href: '/things/{id}',
              'htv:methodName': 'GET',
              response: {
                description: 'Success response',
                'htv:statusCodeValue': 200,
                contentType: 'application/json',
              },
              additionalResponses: [
                {
                  description: 'TD with the given id not found',
                  'htv:statusCodeValue': 404,
                },
              ],
            },
          ],
        },
        updateThing: {
          description: 'Update a Thing Description',
          uriVariables: {
            id: {
              '@type': 'ThingID',
              title: 'Thing Description ID',
              type: 'string',
              format: 'iri-reference',
            },
          },
          input: {
            type: 'object',
          },
          forms: [
            {
              href: '/things/{id}',
              'htv:methodName': 'PUT',
              contentType: 'application/json',
              response: {
                description: 'Success response',
                'htv:statusCodeValue': 200,
              },
              additionalResponses: [
                {
                  description: 'Invalid serialization or TD',
                  'htv:statusCodeValue': 400,
                },
                {
                  description: 'Failed to update Thing',
                  'htv:statusCodeValue': 500,
                },
              ],
            },
          ],
        },
        partiallyUpdateThing: {
          description: 'Partially update a Thing Description',
          uriVariables: {
            id: {
              '@type': 'ThingID',
              title: 'Thing Description ID',
              type: 'string',
              format: 'iri-reference',
            },
          },
          input: {
            type: 'object',
          },
          forms: [
            {
              href: '/things/{id}',
              'htv:methodName': 'PATCH',
              contentType: 'application/merge-patch+json',
              response: {
                description: 'Success response',
                'htv:statusCodeValue': 200,
              },
              additionalResponses: [
                {
                  description: 'Request body missing required parameters',
                  'htv:statusCodeValue': 400,
                },
                {
                  description: 'TD with the given id not found',
                  'htv:statusCodeValue': 404,
                },
                {
                  description: 'Failed to update Thing',
                  'htv:statusCodeValue': 500,
                },
              ],
            },
          ],
        },
        deleteThing: {
          description: 'Delete a Thing Description',
          uriVariables: {
            id: {
              '@type': 'ThingID',
              title: 'Thing Description ID',
              type: 'string',
              format: 'iri-reference',
            },
          },
          forms: [
            {
              href: '/things/{id}',
              'htv:methodName': 'DELETE',
              response: {
                description: 'Success response',
                'htv:statusCodeValue': 204,
              },
              additionalResponses: [
                {
                  description: 'TD with the given id not found',
                  'htv:statusCodeValue': 404,
                },
                {
                  description: 'Failed to remove Thing',
                  'htv:statusCodeValue': 500,
                },
              ],
            },
          ],
        },
      },
    };

    return desc;
  }
}
