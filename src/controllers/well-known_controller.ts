/**
 * Well-Known Controller
 *
 * Handles HTTP requests to /.well-known
 */

import express from 'express';
import * as Constants from '../constants';

function build(): express.Router {
  const controller = express.Router();

  /**
   * OAuth 2.0 Authorization Server Metadata (RFC 8414)
   * https://datatracker.ietf.org/doc/html/rfc8414
   */
  controller.get('/oauth-authorization-server', (request, response) => {
    const origin = `${request.protocol}://${request.headers.host}`;
    response.json({
      issuer: origin,
      authorization_endpoint: `${origin}${Constants.OAUTH_PATH}/authorize`,
      token_endpoint: `${origin}${Constants.OAUTH_PATH}/token`,
      response_types_supported: ['code'],
      // Only expose top-level scopes to unauthenticated clients
      scopes_supported: [Constants.THINGS_PATH, `${Constants.THINGS_PATH}:readwrite`],
    });
  });

  /**
   * WoT Thing Description Directory
   * https://www.w3.org/TR/wot-discovery/#exploration-directory
   */
  controller.get('/wot', (request, response) => {
    const origin = `${request.protocol}://${request.headers.host}`;
    response.json({
      '@context': [
        'https://www.w3.org/2022/wot/td/v1.1', 
        'https://www.w3.org/2022/wot/discovery'
      ],
      '@type': 'ThingDirectory',
      'id': origin,
      'base': origin,
      'title': 'WebThings Gateway',
      'securityDefinitions': {
        'oauth2_sc': {
          'scheme': 'oauth2',
          'flow': 'code',
          'authorization': `${origin}${Constants.OAUTH_PATH}/authorize`,
          'token': `${origin}${Constants.OAUTH_PATH}/token`,
          'scopes': [Constants.THINGS_PATH, `${Constants.THINGS_PATH}:readwrite`],
        }
      },
      'security': 'oauth2_sc',
      'properties': {
        'things': {
          'title': 'Things',
          'description': 'Retrieve all Thing Descriptions',
          'type': 'array',
          'items': {
            'type': 'object'
          },
          'forms': [
            {
              'href': '/things',
              'htv:methodName': 'GET',
              'response': {
                'description': 'Success response',
                'htv:statusCodeValue': 200,
                'contentType': 'application/json'
              },
              'additionalResponses': [
                {
                  'description': 'Token must contain scope',
                  'htv:statusCodeValue': 400
                }
              ]
            }
          ]
        }
      },
      'actions': {
        'createAnonymousThing': {
          'description': 'Create a Thing Description',
          'input': {
            'type': 'object'
          },
          'forms': [
            {
              'href': '/things',
              'htv:methodName': 'POST',
              'contentType': 'application/json',
              'response': {
                'htv:statusCodeValue': 201
              },
              'additionalResponses': [
                {
                  'description': 'Invalid or duplicate Thing Description',
                  'htv:statusCodeValue': 400
                },
                {
                  'description': 'Internal error saving new Thing Description',
                  'htv:statusCodeValue': 500
                }
              ]
            }
          ]
        },
        'retrieveThing': {
          'description': 'Retrieve a Thing Description',
          'uriVariables': {
            'id': {
              '@type': 'ThingID',
              'title': 'Thing Description ID',
              'type': 'string',
              'format': 'iri-reference'
            }
          },
          'output': {
            'description': 'The schema is implied by the content type',
            'type': 'object'
          },
          'safe': true,
          'idempotent': true,
          'forms': [
            {
              'href': '/things/{id}',
              'htv:methodName': 'GET',
              'response': {
                'description': 'Success response',
                'htv:statusCodeValue': 200,
                'contentType': 'application/json'
              },
              'additionalResponses': [
                {
                  'description': 'TD with the given id not found',
                  'htv:statusCodeValue': 404
                }
              ]
            }
          ]
        },
        'updateThing': {
          'description': 'Update a Thing Description',
          'uriVariables': {
            'id': {
              '@type': 'ThingID',
              'title': 'Thing Description ID',
              'type': 'string',
              'format': 'iri-reference'
            }
          },
          'input': {
            'type': 'object'
          },
          'forms': [
            {
              'href': '/things/{id}',
              'htv:methodName': 'PUT',
              'contentType': 'application/json',
              'response': {
                'description': 'Success response',
                'htv:statusCodeValue': 200
              },
              'additionalResponses': [
                {
                  'description': 'Invalid serialization or TD',
                  'htv:statusCodeValue': 400
                },
                {
                  'description': 'Failed to update Thing',
                  'htv:statusCodeValue': 500
                }
              ]
            }
          ]
        },
        'partiallyUpdateThing': {
          'description': 'Partially update a Thing Description',
          'uriVariables': {
            'id': {
              '@type': 'ThingID',
              'title': 'Thing Description ID',
              'type': 'string',
              'format': 'iri-reference'
            }
          },
          'input': {
            'type': 'object'
          },
          'forms': [
            {
              'href': '/things/{id}',
              'htv:methodName': 'PATCH',
              'contentType': 'application/merge-patch+json',
              'response': {
                'description': 'Success response',
                'htv:statusCodeValue': 200
              },
              'additionalResponses': [
                {
                  'description': 'Request body missing required parameters',
                  'htv:statusCodeValue': 400
                },
                {
                  'description': 'TD with the given id not found',
                  'htv:statusCodeValue': 404
                },
                {
                  'description': 'Failed to update Thing',
                  'htv:statusCodeValue': 500
                }
              ]
            }
          ]
        },
        'deleteThing': {
          'description': 'Delete a Thing Description',
          'uriVariables': {
            'id': {
              '@type': 'ThingID',
              'title': 'Thing Description ID',
              'type': 'string',
              'format': 'iri-reference'
            }
          },
          'forms': [
            {
              'href': '/things/{id}',
              'htv:methodName': 'DELETE',
              'response': {
                'description': 'Success response',
                'htv:statusCodeValue': 204
              },
              'additionalResponses': [
                {
                  'description': 'TD with the given id not found',
                  'htv:statusCodeValue': 404
                },
                {
                  'description': 'Failed to remove Thing',
                  'htv:statusCodeValue': 500
                }
              ]
            }
          ]
        }
      }
    });
  });

  return controller;
}

export default build;
