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
