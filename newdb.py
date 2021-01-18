from jar import parseKeys, imgKeys

id_key, title_key, writer_key, date_key, body_key = parseKeys
originkey,resizedkey,thumbkey = imgKeys

lastbackuptime = 0

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

uploadtime_key = "업로드시"
uploader_key = "업로더"

#------------------------------temp board info list
artistList={}
characterList={}
unitDict={}

def newtaginfo(board):
    artistList[board]=[]
    characterList[board]=[]
    unitDict[board]={}

def deltaginfo(board):
    try:
        del artistList[board]
        del characterList[board]
        del unitDict[board]
    except:
        pass
#
# 에리="에리"
# 노조미="노조미"
# 우미="우미"
# 니코="니코"
# 마키="마키"
# 호노카="호노카"
# 코토리="코토리"
# 하나요="하나요"
# 린="린"
# characterList["게시판1"] = [호노카,우미,코토리,린,하나요,마키,노조미,에리,니코]
#
# unitDict["게시판1"] = {
# "뮤즈":[코토리,우미,호노카,마키,린,하나요,노조미,에리,니코],
#
# "에리" :[에리],
# "노조미":[노조미],
# "우미" :[우미],
# "니코" :[니코],
# "마키" :[마키],
# "호노카":[호노카],
# "코토리":[코토리],
# "하나요":[하나요],
# "린":[린],
#
# "1학년":[린,하나요,마키],
# "2학년":[우미,코토리,호노카],
# "3학년":[노조미,에리,니코],
#
# "비비":[니코,마키,에리],
# "릴화":[노조미,우미,린],
# "쁘랭땅":[코토리,호노카,하나요],
#
# "노조에리":[노조미,에리],
# "니코마키":[니코,마키],
# "린파나":[린,하나요],
# "코토우미":[코토리,우미],
#
# "니코린파나":[니코,린,하나요],
# "린마키":[린,마키],
# "에리우미":[에리,우미],
# "코토파나":[코토리,하나요],
# "노조니코":[노조미,니코],
#
# "호노린":[호노카,린],
# "솔겜조":[에리,우미,마키],
#
# }
#
# artistList["게시판1"] = ["reonardo",
# "あさかわさん",
# "うる",
# "う・ω・る",
# "みぃ",
# "ガリアブス",
# "ナカム",
# "天翔幻獣",
# "黒潮",]
#---------------------------------


db={}

charC={}
unitC={}

def newboard(name):
    if db.get(name) == None:
        db[name] ={}
        charC[name] ={}
        unitC[name] ={}
        newtaginfo(name)
        backup()
        return True
    return False

def backup():
    #saveJson(db,"db.json")
    # global db
    # global taginfo
    tmp ={"unitC":unitC,"charC":charC,"artistList":artistList,"characterList":characterList,"unitDict":unitDict, "db":db}
    saveJson(tmp,"data.json")

    boardList = list( db.keys() )
    for board in boardList:
        headcheck(board)
    return True

def backdown():
    global db
    #db = loadJson("db.json")
    global artistList
    global characterList
    global unitDict
    global charC
    global unitC
    data = loadJson("data.json")
    db = data["db"]

    artistList = data["artistList"]
    characterList = data["characterList"]
    unitDict = data["unitDict"]
    charC = data["charC"]
    unitC = data["unitC"]

    boardList = list( db.keys() )
    for board in boardList:
        headcheck(board)
    return True

#time may be defaulted. if need, it will be updated.
#no! time will be logged in server.
def newarticle(board,id, uploader,uploadtime):
    db[board][id]={}
    db[board][id][see_key] = see_default
    db[board][id][uploader_key] = uploader
    db[board][id][uploadtime_key] = uploadtime
    for i in parseKeys:
        db[board][id][i]=""
    for i in imgKeys:
        db[board][id][i]=[]
    for i in fluidKeys:
        db[board][id][i]={}

def subarticle(board,id,):
    del db[board][id]
    #after_newarticle(board)#CAUTION for perfomance issue, if happens.

def hidearticle(board,id,):
    db[board][id][see_key] = see_hidden
def trasharticle(board,id,):
    db[board][id][see_key] = see_trash

# concern write speed.
def after_newarticle(board):
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

def addtag(board,id, time,user,text ):
    key = tag_key
    userinfo = setuserinfo(time,user,text,see=see_default)
    add(board,id,key,userinfo)

def press_recomlike(board,id, time,user, key):
    userinfo = setuserinfo(time,user,text="",see=see_default)
    target = db[board][id][key]
    for k in target.keys():
        if target[k][user_key] == user:
            del target[k]
            return 0
    #means else.
    add(board,id,key,userinfo)
    return 1

def add_view(board,id, time, user):
    key = view_key
    userinfo = setuserinfo(time,user,text="",see=see_default)
    add(board,id,key,userinfo)
    return 1

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

# headidkey = "K"
# headtitlekey = "T"
# headdatekey = "D"
# headimgkey = "IM"
# headthumbkey = "TH"

headidkey = id_key
headtitlekey = title_key
headdatekey = date_key
headimgkey = resizedkey
headthumbkey = thumbkey


head = {}

def headcheck(board):
    global head
    if head.get(board) == None:
        head[board] = [ "0",{} ]

    newhead = scan_head(board)
    if newhead != head[board][1] or head[board][1] == {}:
        head[board][1] = newhead
        head[board][0] = millisec()

        dataspath = "./static/head_{}.json".format(board)
        saveVarjson( head[board][1] , dataspath )

#gethead is dead.
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
        tmpdict[headimgkey] =[]
        for i in db[board][id][resizedkey]:
            tmpdict[headimgkey].append( i )

        #if db[board][id].get(resizedkey) !=[]:
        #    for i in db[board][id][resizedkey]:
        #        tmpdict[headimgkey].append( i.split(id)[1] )

        # tmpdict[thumbkey] =[]
        # if db[board][id].get(thumbkey) !=[]:
        #     for i in db[board][id][thumbkey]:
        #         tmpdict[thumbkey].append( i.split(id)[1] )

        #added for tag sort legacy.
        #del 2020.12.23.
        # tmpdict[hero_key] =[]
        # for i in db[board][id][hero_key]:
        #     tmpdict[hero_key].append( i )

        tempdict[id] = tmpdict

    #return tempdict
    sortedList = dict(sorted( tempdict.items() , key= lambda k: db[board][k[0]][uploadtime_key]  ,reverse = True))
    return sortedList


#--------------------------------------------------tagdict

def scan_tag(board):
    tmpdict = {}
    for id in db[board]:
        for idx in db[board][id][tag_key]:
            tname = db[board][id][tag_key][idx][text_key]
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
