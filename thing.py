#!/usr/bin/env python3
#
# Simple client for connecting with the server.
#

import argparse
import requests
import json
import sys

def print_property_value(label, property, value):
    if 'label' in property:
        print('  {}{}({}) = {}'.format(label, property['name'], property['label'], value))
    else:
        print('  {}{} = {}'.format(label, property['name'], value))


def main():
    default_server = 'localhost'
    default_port = 8088
    parser = argparse.ArgumentParser(
        prog="thing.py",
        usage="%(prog)s [options] [command]",
        description="Interact with Web-of-Things",
    )
    parser.add_argument(
        '-s', '--server',
        dest='server',
        default=default_server,
        help='Server to connect to (default is {})'.format(default_server),
    )
    parser.add_argument(
        '-p', '--port',
        dest='port',
        action='store',
        type=int,
        default=default_port,
        help='Port to connect to (default is {})'.format(default_port),
    )
    parser.add_argument(
        '--things',
        dest='things',
        action='store_true',
        help='List the available things',
    )
    parser.add_argument(
        '--thing',
        dest='thing',
        action='store',
        help='List the things which match',
    )
    parser.add_argument(
        '--properties',
        dest='properties',
        action='store_true',
        help='List the properties'
    )
    parser.add_argument(
        '--get',
        dest='get',
        action='store',
        help='Retrieves the current value from the named property',
    )
    parser.add_argument(
        '--set',
        dest='set',
        action='store',
        help='Sets the value of the named property. (i.e. --set name=value)',
    )
    parser.add_argument(
        '-v', '--verbose',
        dest='verbose',
        action='store_true',
        help='Turn on verbose messages',
        default=False
    )
    args = parser.parse_args(sys.argv[1:])

    server_url = 'http://{}:{}'.format(args.server, args.port)
    things_url = '{}/things'.format(server_url)

    if args.verbose:
        print('server_url =', server_url)
        print('things_url =', things_url)
        print('server =', args.server)
        print('port =', args.port)
        print('things =', args.things)
        print('get =', args.get)
        print('set =', args.set)

    try:
        if args.verbose:
            print('Sending GET to {}'.format(things_url))
        r = requests.get(things_url)
        if args.verbose:
            print('Got response of {}'.format(r.text))
    except requests.exceptions.ConnectionError:
        print('Unable to connect to server @ {}'.format(services_url))
        return

    things = json.loads(str(r.content, 'utf-8'))

    for thing_id in sorted(things):
        selected = True
        thing_id_printed = False
        thing_url = things_url + '/' + thing_id
        if args.verbose:
            print('Sending GET to {}'.format(thing_url))
        req = requests.get(thing_url)
        if args.verbose:
            print('Got response of {}'.format(req.text))
        thing_descr = json.loads(str(req.content, 'utf8'))
        if args.verbose:
            print(thing_descr)
        thing_name = thing_descr['name']
        if args.thing or args.things or args.properties:
            if not args.thing or args.thing in thing_id or args.thing in thing_name:
                print('Id:{} Name: {}'.format(thing_id, thing_name))
                thing_id_printed = True
            else:
                selected = False
        if selected:
            if args.properties:
                properties = thing_descr['properties']
                for property in properties:
                    property_url = '{}{}'.format(server_url, property['href'])
                    value_req = requests.get(property_url)
                    value = str(value_req.content, 'utf8')
                    #print('  name =', property['name'])
                    #print('  value =', value)
                    print_property_value('', property, value)
            if args.get:
                thing_url = things_url + '/' + thing_id
                req = requests.get(thing_url)
                thing_descr = json.loads(str(req.content, 'utf8'))
                properties = thing_descr['properties']
                if not thing_id_printed:
                    print('Id:{} Name: {}'.format(thing_id, thing_name))
                for property in properties:
                    if args.get in property['name']:
                        property_url = '{}{}'.format(server_url, property['href'])
                        value_req = requests.get(property_url)
                        value = str(value_req.content, 'utf8')
                        print_property_value('', property, value)
            if args.set:
                if '=' in args.set:
                    set_name, set_value = args.set.split('=', 1)
                else:
                    set_name = args.set
                    set_value = ''
                if args.verbose:
                    print('set_name =', set_name)
                    print('set_value =', set_value)
                thing_url = things_url + '/' + thing_id
                req = requests.get(thing_url)
                thing_descr = json.loads(str(req.content, 'utf8'))
                properties = thing_descr['properties']
                if not thing_id_printed:
                    print('Id:{} Name: {}'.format(thing_id, thing_name))
                for property in properties:
                    if set_name == property['name']:
                        property_url = '{}{}'.format(server_url, property['href'])
                        print('property_url =', property_url)
                        body = json.dumps({'name': 'value'})
                        print('body =', body)
                        #value_req = requests.post(property_url, headers={'ContentType': 'application/json'}, data=bytes(body, encoding='utf8'))
                        value_req = requests.put(property_url, data={'value': set_value})
                        print_property_value('Set ', property, set_value)

            

if __name__ == "__main__":
    main()

