#!/usr/bin/env python3

import argparse
from pathlib import Path


def main (**kwargs):
    data_path = Path ( kwargs [ "data_path" ] ).resolve ()
    print ( f"Artists Data Processing: {data_path}." )


if __name__ == "__main__":
    formatter = argparse.ArgumentDefaultsHelpFormatter
    parser = argparse.ArgumentParser(description="Mud Fuzz",
                                     formatter_class=formatter)

    parser.add_argument("data_path", 
                        help="Path to raw csv")

    args = parser.parse_args ()

    main (data_path=args.data_path)
