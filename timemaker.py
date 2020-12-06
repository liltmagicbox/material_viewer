import time
def millisec():
    return str(int(time.time()*1000))
def strsec():
    return str(int(time.time()))

def intsec():
    return int(time.time())

import datetime
tzinfo=datetime.timezone(datetime.timedelta(seconds=32400))#+9
def datestr():
    now = datetime.datetime.now()
    now=now.astimezone(tzinfo)
    return now.strftime("%Y.%m.%d %H:%M:%S")

def daystr():
    now = datetime.datetime.now()
    now=now.astimezone(tzinfo)
    return now.strftime("%Y.%m.%d")

#datetime.datetime.utcfromtimestamp(1606644954)
#datetime.datetime(2020, 11, 29, 10, 15, 54)
#datetime.datetime.utcfromtimestamp(1606644954+(9*3600))
#datetime.datetime(2020, 11, 29, 19, 15, 54)
def datestrstamp(timestamp):
    return datetime.datetime.utcfromtimestamp(timestamp+(9*3600)).strftime("%Y.%m.%d %H:%M:%S")
