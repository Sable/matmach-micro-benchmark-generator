import numpy as np
import time
import json
import sys

def runner(*args):
    output=0
    # %vars
   
    for i in range(10):
        3
        # %pre
        # %content
        # %post
    # %pre
    start = time.time()
    # %content
    end = time.time()
    # %post
    res = {
        "input": args,
        "output": output,
        "time": end - start
    }
    json.dump(res, sys.stdout)


