#!/usr/bin/env python3

import subprocess


def parse_cells(text):
    cells = []
    cell = {}
    for line in text.splitlines():
        line = line.strip()

        # New cell, start over
        if line.startswith('Cell '):
            if 'ESSID' in cell and \
                    'Quality' in cell and \
                    'Encryption' in cell and \
                    len(cell['ESSID']) > 0:
                cells.append(cell)

            cell = {}

        if line.startswith('ESSID:'):
            cell['ESSID'] = line[7:len(line) - 1]

        if line.startswith('Quality='):
            line = line.split(' ')[0]
            qual = line.split('=')[1].split('/')[0]
            cell['Quality'] = int(qual)

        if line.startswith('Encryption key:'):
            cell['Encryption'] = line[15:]

    return cells


def print_cells(cells):
    for cell in sorted(cells, key=lambda x: x['Quality'], reverse=True):
        print('{:02d} {}  {}'.format(cell['Quality'],
                                     cell['Encryption'],
                                     cell['ESSID']))


def main():
    p = subprocess.run(['iwlist', 'wlan0', 'scan'], stdout=subprocess.PIPE)
    cells = parse_cells(p.stdout.decode('utf-8'))
    print_cells(cells)


if __name__ == '__main__':
    main()
