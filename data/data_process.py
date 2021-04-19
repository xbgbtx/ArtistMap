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


def strip_wikidata(s):
    m = re.search("http://www.wikidata.org/entity/(Q.+)$", s)
    return m.group(1)

def process_row(row):
    p = parse_point(row["coor"])
    loc = Location(strip_wikidata(row["location"]), p)
    band = Band(strip_wikidata(row["band"]))
    return ( loc, band )


def process_raw_data(data_path):
    location_bands = dict()
    with open(data_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            row_data = process_row(row)
            location_bands.setdefault(row_data[0], []).append(row_data[1])

    return location_bands


def create_output_files(location_bands, out_path):
    with open(out_path / "locations.csv", "w", newline="") as csvfile:
        loc_write = csv.writer(csvfile, delimiter=",")
        loc_write.writerow(["location", "artist_count","lat", "long"])

        for l in location_bands.keys ():
            loc_write.writerow([l.wikidata, len(location_bands[l]), 
                                l.coord.x, l.coord.y ])


def main(**kwargs):
    data_path = Path ( kwargs [ "data_path" ] ).resolve ()
    out_path = Path ( kwargs [ "out_path" ] ).resolve ()
    print ( f"Artists Data Processing: {data_path}." )

    location_bands = process_raw_data(data_path)
    create_output_files(location_bands, out_path)


if __name__ == "__main__":
    formatter = argparse.ArgumentDefaultsHelpFormatter
    parser = argparse.ArgumentParser(description="Mud Fuzz",
                                     formatter_class=formatter)

    parser.add_argument("data_path", help="Path to raw csv")
    parser.add_argument("out_path", help="Path to output directory")

    args = parser.parse_args ()

    main (data_path=args.data_path, out_path=args.out_path)
