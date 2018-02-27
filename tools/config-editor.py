#!/usr/bin/env python3

import argparse
import json
import os
import sqlite3
import subprocess
import sys
import tempfile


_MOZIOT_HOME = os.getenv('MOZIOT_HOME')
if not _MOZIOT_HOME:
    _MOZIOT_HOME = os.path.join(os.path.expanduser('~'), '.mozilla-iot')

_DEFAULT_DATABASE = os.path.join(_MOZIOT_HOME, 'config', 'db.sqlite3')
_DEFAULT_EDITOR = 'nano'


def main():
    parser = argparse.ArgumentParser(
        description='View and edit add-on configs.')
    parser.add_argument('package_name',
                        metavar='package-name',
                        type=str,
                        help='Name of add-on package')
    parser.add_argument('-e', '--edit',
                        dest='edit',
                        action='store_true',
                        help='Edit the existing config')
    args = parser.parse_args()

    database = os.getenv('MOZIOT_DATABASE')
    if not database:
        database = _DEFAULT_DATABASE

    if not os.path.isfile(database):
        print('Config database not found.')
        sys.exit(1)

    # Open the config database.
    conn = sqlite3.connect(database)
    c = conn.cursor()

    # Get the current config data from the database.
    key = 'addons.' + args.package_name
    c.execute('SELECT value FROM settings WHERE key=?',
              (key,))
    val = c.fetchone()

    if val is None:
        print('Add-on not found in database.')
        sys.exit(1)

    # Parse the current config data.
    try:
        val = json.loads(val[0])

        if 'moziot' not in val:
            raise ValueError()
    except ValueError:
        print('Current config data is invalid.')
        sys.exit(1)

    # Load the config object.
    config = {}
    if 'config' in val['moziot']:
        config = val['moziot']['config']

    config_str = json.dumps(config, indent=2, sort_keys=True)

    if args.edit:
        # Write the config data to a temp file.
        fd, fname = tempfile.mkstemp(dir='/tmp', text=True, suffix='.json')
        f = os.fdopen(fd, 'wt')
        f.write(config_str)
        f.close()

        # Start up an editor for the user.
        editor = os.getenv('EDITOR')
        if not editor:
            editor = _DEFAULT_EDITOR

        subprocess.call([editor, fname])

        # Read the content back in.
        try:
            with open(fname, 'rt') as f:
                new_config = f.read()

            config = json.loads(new_config)

            # Compare to the old config to see if we need to update the
            # database.
            new_config = json.dumps(config, indent=2, sort_keys=True)
            if new_config != config_str:
                val['moziot']['config'] = config
                c.execute('UPDATE settings SET value=? WHERE key=?',
                          (json.dumps(val), key))
                conn.commit()
                print('Database updated.')
            else:
                print('Config was unchanged.')
        except (IOError, OSError):
            print('Failed to read config back from temp file.')
            sys.exit(1)
        except ValueError:
            print('Failed to parse new config data.')
            sys.exit(1)
    else:
        print(config_str)

    c.close()
    conn.close()


if __name__ == '__main__':
    main()
