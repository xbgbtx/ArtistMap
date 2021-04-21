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

    @staticmethod
    def csv_headers():
        return ["location", "lat", "lon"]

    def csv_data(self):
        return [self.wikidata,self.coord.y,self.coord.x]

@dataclass(frozen=True)
class Artist:
    wikidata: str


    @staticmethod
    def csv_headers():
        return ["artist"]

    def csv_data(self):
        return [self.wikidata]



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
    artist = Artist(strip_wikidata(row["artist"]))
    return ( loc, artist )


def process_raw_data(data_path):
    location_artists = dict()
    with open(data_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            print(row)
            if len(row) != 3:
                continue

            row_data = process_row(row)
            location_artists.setdefault(row_data[0], []).append(row_data[1])

    return location_artists


def write_csv_data( data, out_path ):
    with open(out_path, "w", newline="") as csvfile:
        w = csv.writer(csvfile, delimiter=",")
        for d in data:
            w.writerow(d)


def location_data(location_artists):
    data = []
    data.append ( Location.csv_headers () + [ "artist_count" ] )

    for loc, artists in location_artists.items():
        data.append ( loc.csv_data () + [ len ( artists ) ] )

    return data

def create_output_files(location_artists, out_path):
    write_csv_data(location_data(location_artists), out_path / "locations.csv")

    for loc, artists in location_artists.items ():
        data = [ Artist.csv_headers () ] + [ x.csv_data() for x in artists ]
        write_csv_data(data, out_path / f"{loc.wikidata}.csv" )



def main(**kwargs):
    data_path = Path ( kwargs [ "data_path" ] ).resolve ()
    out_path = Path ( kwargs [ "out_path" ] ).resolve ()
    print ( f"Artists Data Processing: {data_path}." )

    location_artists = process_raw_data(data_path)
    create_output_files(location_artists, out_path)


if __name__ == "__main__":
    formatter = argparse.ArgumentDefaultsHelpFormatter
    parser = argparse.ArgumentParser(description="Mud Fuzz",
                                     formatter_class=formatter)

    parser.add_argument("data_path", help="Path to raw csv")
    parser.add_argument("out_path", help="Path to output directory")

    args = parser.parse_args ()

    main (data_path=args.data_path, out_path=args.out_path)
