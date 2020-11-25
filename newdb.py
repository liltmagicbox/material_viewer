from jar import parseKeys, imgKeys

id_key, title_key, writer_key, date_key, body_key = parseKeys
originkey,resizedkey,thumbkey = imgKeys


dberrname = "errdb.txt"

view_key    ="조회"
recom_key   ="추천"
like_key    ="좋아"
hero_key    ="주연"
tag_key     ="태그"
comm_key    ="댓글"
fluidKeys = [ view_key, recom_key, like_key, hero_key, tag_key, comm_key ]

time_key = "시간"
user_key = "유저"
text_key = "내용"
see_key = "보기"
userKeys = [ time_key, user_key, text_key, see_key ]
#userinfo = {time_key:time, user_key:user, text_key:text, see_key:see}
see_default = "all"
see_trash = "trash"
see_hidden = "hidden"


uploader_key = "업로더"



db={}

def newboard(name):
    db[name] ={}
    backup()

def backup():
    saveJson(db,"db.json")
def backdown():
    global db
    db = loadJson("db.json")

#time may be defaulted. if need, it will be updated.
#no! time will be logged in server.
def newarticle(board,id, uploader):
    db[board][id]={}
    db[board][id][see_key] = see_default
    db[board][id][uploader_key] = uploader
    for i in parseKeys:
        db[board][id][i]=""
    for i in imgKeys:
        db[board][id][i]=[]
    for i in fluidKeys:
        db[board][id][i]={}

def subarticle(board,id,):
    del db[board][id]
def hidearticle(board,id,):
    db[board][id][see_key] = see_hidden
def trasharticle(board,id,):
    db[board][id][see_key] = see_trash

# concern write speed.
def after_article(board):
    headcheck(board)
    backup()

# userinfo not need? time here and user,text is only need? and if see, want.
#no! time will be logged in server.
def setuserinfo(time,user,text,see=see_default):
    return {time_key:time, user_key:user, text_key:text, see_key:see}


def add(board,id,key,userinfo):
    target = db[board][id][key]
    if len(target)==0:
        idx = "1"
    else:
        idx = str(int(sorted(target.keys(), key = lambda x: (len(x),x),reverse=True)[0])+1)
    target[idx] = userinfo

def sub(board,id,key,userinfo):
    target = db[board][id][key]
    idx = userinfo[text_key]
    del target[idx]

def trash(board,id,key,userinfo):
    target = db[board][id][key]
    idx = userinfo[text_key]
    target[idx][see_key]=see_trash
def hide(board,id,key,userinfo):
    target = db[board][id][key]
    idx = userinfo[text_key]
    target[idx][see_key]=see_hidden



#def iswriter()
def isuser(board,id,key, userinfo):
    target = db[board][id][key]
    idx = userinfo[text_key]
    user = userinfo[user_key]
    return target[idx][user_key] == user

#--------------------------------------------------idscan

import time
def millisec():
    return str(int(time.time()*1000))

from jsonio import *


#from dhexmaker import dhexstr, dhex3
#dhexstr(list) -> str

headidkey = "K"
headtitlekey = "T"
headdatekey = "D"
headimgkey = "IM"
headthumbkey = "TH"


head = {}

def headcheck(board):
    global head
    if head.get(board) == None:
        head[board] = [ "0",{} ]

    newhead = scan_head(board)
    if newhead != head[board][1]:
        head[board][1] = newhead
        head[board][0] = millisec()

def gethead(board,head_ver):
    headcheck(board)
    global head
    if head[board][0] == head_ver:
        headdict = {}
    else:
        headdict = head[board][1]

    return [
    headdict,
    scan_hero(board),
    scan_tag(board),
    strsort(board,title_key),
    strsort(board,date_key),
    lensort(board,view_key),
    lensort(board,recom_key),
    lensort(board,like_key),
    lensort(board,comm_key),
    lensort(board,tag_key),
    newsort(board,comm_key),
    newsort(board,tag_key),
    ]



def scan_head(board):
    tempdict = {}
    for id in db[board]:
        tmpdict = {}
        #tmpdict[headidkey] = k
        tmpdict[headtitlekey] = db[board][id][title_key]
        tmpdict[headdatekey] = db[board][id][date_key]
        tmpdict[imgkey] =[]
        if db[board][id].get(resizedkey) !=[]:
            for i in db[board][id][resizedkey]:
                tmpdict[imgkey].append( i.split(id)[1] )
        # tmpdict[thumbkey] =[]
        # if db[board][id].get(thumbkey) !=[]:
        #     for i in db[board][id][thumbkey]:
        #         tmpdict[thumbkey].append( i.split(id)[1] )

        tempdict[id] = tmpdict

    return tempdict


#--------------------------------------------------tagdict

def scan_tag(board):
    tmpdict = {}
    for id in db[board]:
        for tname in db[board][id][tag_key]:
            if tmpdict.get(tname) == None:
                tmpdict[tname] = []#hope same id in tname not happen
            tmpdict[tname].append(id)
    return tmpdict

def scan_hero(board):
    tmpdict = {}
    for id in db[board]:
        for tname in db[board][id][hero_key]:
            if tmpdict.get(tname) == None:
                tmpdict[tname] = []#hope same id in tname not happen
            tmpdict[tname].append(id)
    return tmpdict

#--------------------------------------------------sort
#too fast. order made.

#dhexstr(list) -> str

def strsort(board,kname):
    #id = idscan[board]["data"][k]
    sortedi = sorted( db[board].keys() , key= lambda k: db[board][k][kname]  ,reverse = True)#higher first
    return sortedi

def lensort(board,kname):
    #id = idscan[board]["data"][k]
    sortedi = sorted( db[board].keys() , key= lambda k: len( db[board][k][kname] )  ,reverse = True)#higher first
    return sortedi
    #return dhexstr(sortedi)

def newsort(board,kname):
    sortedi = sorted( db[board].keys() , key = lambda k: db[board][k][kname][ max(db[board][k][kname]) ][time_key] if len(db[board][k][kname]) != 0 else "0"  ,reverse = True)#higher first
    return sortedi
    #return dhexstr(sortedi)

def newtagsortfunc(k):
    kname = tag_key
    id = idscan[board][k]
    if len(db[board][id][kname]) != 0:
        return db[board][id][kname][ max(db[board][id][kname]) ][time_key]
    else:
        return "0"
#lambda k: db[board][idscan[board]["data"][k]][kname][ max(db[board][idscan[board]["data"][k]][kname]) ][time_key] if len(db[board][idscan[board]["data"][k]][kname]) != 0 else "0"


#--------------------------------------------------


def bodyload(board,id):
    text = db[board][id][body_key]
    tag = db[board][id][tag_key]
    comm = db[board][id][comm_key]
    return [text,tag,comm]
    #js show for loop.fine.



#---------------when loading, load before.
try:
    backdown()
    print("db backup loaded")
except:
    print("db backup not")








#
# from dhexmaker import dhexstr, dhex3
# #dhexstr(list) -> str
#
# headid_key = "K"
# headtitle_key = "T"
# headdate_key = "D"
# headimg_key = "IM"
# headthumb_key = "TH"
#
# verscan="0"
# idxscan = {}#for sort. list(keys) slow!
# #idscan[board]["ver"]
# #idscan[board]["data"]
# idscan = {}
# def getidscan(board):
#     global verscan
#     global idscan
#     global idxscan
#
#     tmpids = list( db[board].keys() )
#
#     if idscan.get(board) != None:
#         if tmpids == idscan[board]:
#             return False
#
#     idscan[board] = tmpids
#     idxscan[board] = list(range(len(idscan[board])))
#     verscan = millisec()
#
#     return True
#
# headscan = {}
# def getheaddict(board):
#     global headscan
#
#     templist = []
#     for id in enumerate( idscan[board] ):
#         tmpdict = {}
#
#         #tmpdict[headid_key] = k
#         tmpdict[headtitle_key] = db[board][id][title_key]
#         tmpdict[headdate_key] = db[board][id][date_key]
#         tmpdict[img_key] =[]
#         if db[board][id].get(resizedkey) !=[]:
#             for i in db[board][id][resizedkey]:
#                 tmpdict[img_key].append( i.split(id)[1] )
#         # tmpdict[thumb_key] =[]
#         # if db[board][id].get(thumbkey) !=[]:
#         #     for i in db[board][id][thumbkey]:
#         #         tmpdict[thumb_key].append( i.split(id)[1] )
#
#         templist.append(tmpdict)
#
#     if headscan.get(board) != None:
#         if templist == headscan[board]:
#             return False
#
#     headscan[board] = templist
#     return True
#
#
# #--------------------------------------------------tagdict
#
# tagscan={}
# def tagscan(board):
#     global tagscan
#
#     tmpdict = {}
#     for id in db[board]:
#         for tname in db[board][id][tag_key]:
#             if tmpdict.get(tname) == None:
#                 tmpdict[tname] = []#hope same id in tname not happen
#             tmpdict[tname].append(id)
#
#     if tagscan.get(board) != None:
#         if tmpdict == tagscan[board]:
#             return False
#
#     tagscan[board] = tmpdict
#     return True
#
#
# heroscan={}
# def herotagscan(board):
#     global heroscan
#
#     tmpdict = {}
#     for id in db[board]:
#         for tname in db[board][id][hero_key]:
#             if tmpdict.get(tname) == None:
#                 tmpdict[tname] = []#hope same id in tname not happen
#             tmpdict[tname].append(id)
#
#     if heroscan.get(board) != None:
#         if tmpdict == heroscan[board]:
#             return False
#
#     heroscan[board] = tmpdict
#     return True








# #headdict[board]["ver"]
# #headdict[board]["data"]
# headdict = {}
# def gethead(board):
#     global headdict
#
#     for idx,id in enumerate( db[board].keys() ):
#         tmpdict = {}
#         tmpdict[headtitle_key] = db[board][id][title_key]
#         tmpdict[headdate_key] = db[board][id][date_key]
#
#         tmpdict[img_key] =[]
#         if db[board][id].get(resizedkey) !=[]:
#             for i in db[board][id][resizedkey]:
#                 tmpdict[img_key].append( i.split(id)[1] )
#         # tmpdict[thumb_key] =[]
#         # if db[board][id].get(thumbkey) !=[]:
#         #     for i in db[board][id][thumbkey]:
#         #         tmpdict[thumb_key].append( i.split(id)[1] )
#
#     if headdict.get(board) == None:
#         headdict[board]["data"] = tmpdict
#         headdict[board]["ver"] = millisec()
#
#     if not tmpdict == headdict[board]["data"]:
#         headdict[board]["data"] = tmpdict
#         headdict[board]["ver"] = millisec()



# idlist = []
# def scanidlist(board):
#     global idlist
#     idlist = list(db[board].keys())
#
# idxs = []
# def scanidxs():
#     global idxs
#     idxs = list(range(len(idlist)))



# def getbody(board,id):
#     return db[board][id][body_key]
# def gettag(board,id):
#     return db[board][id][body_key]
# def getcomm(board,id):
#     return db[board][id][body_key]



# class db():
#     'each board entangled. same log, same save.'
#     def __init__(ss):
#         ss.name = "boardname"
#         ss.box = {}

#both not working.
# def newboard(boardname):
#     exec( "ha = dict()" )
#     a=board()
