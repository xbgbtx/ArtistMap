#!/usr/bin/env python3

import argparse
import csv
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Point:
    x: float
    y: float


@dataclass(frozen=True)
class Location:
    wikidata: str
    coord: Point


@dataclass(frozen=True)
class Band:
    wikidata: str


def parse_point(s):
    m = re.search("Point\((.+) (.+)\)", s )
    p = Point(float(m.group(1)), float(m.group(2)))
    return p


def process_row(row):
    p = parse_point(row["coor"])
    loc = Location(row["location"], p)
    band = Band(row["band"])
    return ( loc, band )


def process_raw_data( data_path ):
    location_bands = dict()
    with open(data_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            row_data = process_row(row)
            location_bands.setdefault(row_data[0], []).append(row_data[1])

    return location_bands


def main(**kwargs):
    data_path = Path ( kwargs [ "data_path" ] ).resolve ()
    print ( f"Artists Data Processing: {data_path}." )

    location_bands = process_raw_data(data_path)


if __name__ == "__main__":
    formatter = argparse.ArgumentDefaultsHelpFormatter
    parser = argparse.ArgumentParser(description="Mud Fuzz",
                                     formatter_class=formatter)

    parser.add_argument("data_path", help="Path to raw csv")

    args = parser.parse_args ()

    main (data_path=args.data_path)
