import time
import json
import sys
# %imports
def runner(*args):
    output=0
    # %vars
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


