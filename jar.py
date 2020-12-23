from os import listdir, mkdir, rename, remove
from os.path import isfile, join, splitext, isdir, getsize
from shutil import rmtree#remove not work if filled.rmtree(tempdir)
from sys import exc_info#for log
##from hashlib import sha256#for id10
#from hashlib import sha256#for id10
from uuid import uuid4

#----------------------- user funcion variable
import file2dir
import txt2dict
from resizer import resizeDir

#from newdb import parseKeys, imgKeys,  jar_dir, errlog_dir, imgtower_dir , jarerrname
#id_key, title_key, writer_key, date_key, body_key = parseKeys
#multiLineKey = body_key#for txt2dict
#originkey,resizedkey,thumbkey = imgKeys

jar_dir = 'jar' #not to ./ . it's to attached.
errlog_dir = 'static'
imgtower_dir = 'static/imgtower'
formakedirs = [jar_dir, errlog_dir, imgtower_dir]

jarerrname = "errjar.txt"

id_key = "번호"
title_key = "제목"
writer_key = "작성자"
date_key = "날짜"
body_key = "본문"
parseKeys = [ id_key, title_key, writer_key, date_key, body_key]
#custom option:"태그"
originkey = "원본"
resizedkey = "리사이즈"
thumbkey = "썸네일"
imgKeys = [originkey,resizedkey,thumbkey]

multiLineKey = body_key#for txt2dict

#----------------------- user funcion variable

maxMB=20# >20MB, del.
safeext = {'.jpg','.jpeg','.png','.gif','.webp','.bmp','.txt', '.jfif'}

msgemptyjar = 'empty jar_dir'
msgdirdir = "dir in dir.. deleted dir."
msgnotsafe = "not img or txt.skip file."
msgtoolarge = "too large file size.. skip file."

errmultitxt = 'txt shall be only one! : '
erremptydir = 'empty dir! : '
errinpreventset = 'in preventSet ! : '


#--------------for minimul dirs.
def makedirs():
    for i in formakedirs:
        try:
            mkdir(i)
            print( "{} dir created".format(i) )
        except:
            pass
makedirs()
#--------------for minimul dirs.

#------------------------------for errlog
errlist=[]
#for all log in here.
def logerr():
    with open( join(errlog_dir,jarerrname) ,'a',encoding='utf-8') as f:
        for i in errlist:
            f.write(i)
            f.write('\n')
    #errlist.clear() in front of the loop.

#-------------for log time.
import datetime
tzinfo=datetime.timezone(datetime.timedelta(seconds=32400))#+9
def datestr():
    now = datetime.datetime.now()
    now=now.astimezone(tzinfo)
    return now.strftime("%Y.%m.%d %H:%M:%S")
#------------------------------for errlog


# a in set or dict is O(1).
def getJar(preventSet={}):
    """
    returns new dict. if some fails, to pastebin.
    """
    errlist.clear()

    # raw txts to dir:
    txts,elist = file2dir.txt2dir(jar_dir)
    errlist.extend(elist)
    # raw imgs to dir:
    imgs,elist = file2dir.img2dir(jar_dir)
    errlist.extend(elist)

    #------pre check dir is.
    dirList = []
    for i in listdir(jar_dir):
        if isdir(  join(jar_dir,i) ):
            dirList.append(i)

    if len(dirList) == 0:
        errlist.append( "{}:{}".format( datestr(),msgemptyjar) )

    newDatas = {} #for data insure.

    #noFolder is not full-path, only str.
    for noFolder in dirList:
        noDir = join( jar_dir,noFolder)
        try:
            #-------pre-process.remove dir already, except safeext, >maxMB.
            indir = listdir( noDir )
            if len(indir)==0:#not to occur resizer empty err.
                raise Exception(erremptydir + str(noFolder))
            for f in indir:
                fdir = join(noDir,f)
                if isdir( fdir ):
                    rmtree( fdir )
                    errlist.append( "{}:,{},{}".format(datestr(),fdir,msgdirdir) )
                    continue# not to remove removed!
                name,ext = splitext(f)
                if not ext.lower() in safeext:
                    remove( fdir )
                    errlist.append( "{}:,{},{}".format(datestr(),fdir,msgnotsafe) )
                    continue
                elif getsize(fdir)//1024//1024 > maxMB:
                    remove( fdir )
                    errlist.append( "{}:,{},{}".format(datestr(),fdir,msgtoolarge) )



            #----------------- txt file parser
            txtfiles = []
            for f in listdir( noDir ):
                name,ext = splitext(f)
                if ext.lower() =='.txt':
                    txtfiles.append(f)

            if len(txtfiles) == 1:
                txtFile = join( noDir, txtfiles[0])
                parsedDict = txt2dict.parseTxt(txtFile,parseKeys,multiLineKey)
            elif len(txtfiles) == 0:
                parsedDict = {}
            elif len(txtfiles) > 1:
                raise Exception(errmultitxt + str(noFolder))
            #parsedDict {} or {multiLineKey} or {parseKeys}

            if len(parsedDict) != len(parseKeys):
                parsedDict[title_key] = noFolder
                #parsedDict[id_key] = '_'+sha256( parsedDict[title_key].encode() ).hexdigest()[:10]
                #parsedDict[id_key] = '_'+str(uuid4())[:13]
            parsedDict[id_key] = str(uuid4())[:13]
            #----------------- txt file parser




            #resizer. create imgs, get imglist.
            resizedlist, elist = resizeDir(noDir,imgname = parsedDict[id_key] )#0 origin 1 re 2 thumb.
            errlist.extend(elist)
            parsedDict[originkey] = resizedlist[0]
            parsedDict[resizedkey] = resizedlist[1]
            parsedDict[thumbkey] = resizedlist[2]


            #--------------exceptions. not to be departed.!
            #no img, and no bodytext?! it's empty!
            #1. fullkeys, multiLineKey='--' or ''. imgonly, len!=0. txtonly, multiLineKey=''.
            if len(parsedDict[originkey])==0 and parsedDict.get(multiLineKey)==None:
                raise Exception(erremptydir + str(noFolder))
            # #if already, don't. fine.
            if parsedDict[id_key] in preventSet:
                raise Exception(errinpreventset + str(noFolder))
            #--------------exceptions. not to bedeparted.!


            #3.what? ah. move to ..the.. storage.
            #assume already was not happens..   ..maybe.rollback, it can happen

            #id_key  1113033 if crawl / hash10 if user.
            idDir = join( imgtower_dir, parsedDict[id_key] )
            rename( noDir, idDir )
            tmpKey = parsedDict[id_key]
            newDatas[tmpKey] = parsedDict

        except Exception as e:
            exc = exc_info()#below except.
            errmsg = exc[1],':at line',exc[2].tb_lineno

            #byte err, 300lines..
            errmsg = str(errmsg)[0:280]
            #print(errmsg)
            errlist.append( "{}:,{},{}".format(datestr(),noFolder,errmsg) )

            #remove( join(getcwd(),noDir) )#note it requires path, not dir. perm. error!
            rmtree(noDir)
            continue#what is it? im not sure..
            #pass go through, continue break,next!

    #print( "newdatas:{},err:{}".format(len(newDatas),len(errlist) ) )
    logerr()

    #clean jar. both resizer, img2dict seems ram-safe.(err after load file)
    for i in listdir(jar_dir):
        idir = join(jar_dir,i)
        if isdir( idir ):
            rmtree( idir  )
        if isfile( idir):
            remove( idir )
    return newDatas,errlist
