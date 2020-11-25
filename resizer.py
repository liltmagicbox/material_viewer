#created 2020-11-12. fine. target dir, check imgs, get it resized.
#note it outputs dict. with key.
#..think better list[0,1,2].. changed.
#...no. list(3) cant find what it is. dict can by key.
#...no. cant remember.. but 0,1,2 is origin, resized, thumb. too clear.

from os import listdir, mkdir, rename, remove
from os.path import isdir, join, splitext

from shutil import copy

from randname import barrand6

from PIL import Image
#it make more general..good.

origin_dir = 'origin'
resized_dir = 'resized'
thumb_dir = 'thumb'
ndirs = [origin_dir,resized_dir,thumb_dir]

imgExt = {'.jpg','.jpeg','.png','.gif','.webp','.bmp',}

def resizeDir( targetDir, resizew=700,thumbw=300 ,imgname = None):
    errlist=[]

    indir = listdir( targetDir )
    imgList = []
    for f in indir:
        if isdir( join(targetDir, f) ):
            continue
        ext = splitext( f )[1].lower()
        if ext in imgExt:     #now, it's img.
            imgList.append(f)

    #imgList=[]..

    # break below. no img, no dirs!
    if len(imgList)==0:
        returnList=[[],[],[]]
        errlist= ["resizer:no img!"]
        return returnList,errlist


    originList = []
    resizedList = []
    thumbList = []
    #make dirs in current folder.
    for i in ndirs:
        try:
            mkdir( join(targetDir, i ))
        except:
            pass

    nameAlready=[]#for 1.jpg and 1.gif.
    nameiter=1
    for i in imgList:
        #get iname, if already, +=barrand.
        iname,iexp = splitext( i )
        iexp = iexp.lower()
        if iname in nameAlready:
            iname = iname+barrand6()
        else:
            nameAlready.append(iname)
        #print(iexp,iname)
        if imgname != None:#how clever!
            iname = "{}_{}".format(imgname,nameiter)
            nameiter+=1

        isrc = join(targetDir, i) #dirname/imgfile.jpg
        idestname = join(targetDir, resized_dir ,iname)#+.jpg
        tdestname = join(targetDir, thumb_dir,iname )

        try:
            im = Image.open(isrc)#for cant load.
            #-----------resize----------------------
            imw = resizew
            # if gif, just save to dest.
            if iexp == ".gif":
                #im.save( idestname+'.gif') # its not copy.
                copy( isrc ,idestname+'.gif') # its  copy.
                resizedList.append( iname+'.gif' )
            else:
                imh = int(im.size[1]/(im.size[0]/imw))
                im.resize((imw,imh),Image.LANCZOS).convert('RGB').save( idestname+'.jpg' ,quality=90)
                resizedList.append( iname+'.jpg' )
                # #if >w, resize and save.
                # if im.size[0]>imw:
                #     imh = int(im.size[1]/(im.size[0]/imw))
                #     im.resize((imw,imh),Image.LANCZOS).convert('RGB').save( idestname+'.jpg' ,quality=90)
                #     resizedList.append( iname+'.jpg' )
                # #too small, just save jpg.
                # else:
                #     im.save( idestname+'.jpg')
                #     resizedList.append( iname+'.jpg' )
            #-----------resize----------------------


            #-----------thumbnail----------------------
            #it shall be justsize, even small.
            imw = thumbw
            imh = int(im.size[1]/(im.size[0]/imw))
            if imh >=imw:
                nim = im.resize((imw,imh),Image.LANCZOS)
                imh = imw
                nim.crop( (0,0,imw,imh) ).convert('RGB').save( tdestname+'.jpg' ,quality=80)
                #im.resize((300,imh),Image.LANCZOS).convert('RGB').save( tdestname+'.jpg' ,quality=80)
            elif imh <imw:
                imh = thumbw
                imw = int( (im.size[0]/im.size[1]*imh))
                nim = im.resize((imw,imh),Image.LANCZOS)
                #imw = imh
                nim.crop( ((imw/2 -imh/2), 0, (imw/2 +imh/2), imh) ).convert('RGB').save( tdestname+'.jpg' ,quality=80)
            thumbList.append( iname+'.jpg' )
            #-----------thumbnail----------------------

            #-----------origin----------------------
            osrcimg = join(targetDir,i)
            #odestimg = join(targetDir, origin_dir ,i)
            odestimg = join(targetDir, origin_dir ,iname+iexp)
            im = None# this was really problem!
            rename(osrcimg, odestimg)#move. we considered lot, but to zip(origin)!
            originList.append( iname+iexp )
            #-----------origin----------------------

        except Exception as e:
            #print(e)
            im = None
            remove(isrc)#for cant load.
            if imgname != None: nameiter-=1#1,2,4
            #raise Exception('resizer:{}:{}'.format(iname,e))
            errlist.append('resizer:{}:{}'.format(iname,e) )

    #originList# is imgList.
    #resizedList #is created.
    #thumbList #.. is  --.jpg. but if.. ..now we add it. fine.

    # imgDict = {}
    # imgDict[originkey] = originList
    # imgDict[resizedkey] = resizedList
    # imgDict[thumbkey] = thumbList
    #return imgDict

    returnList=[originList,resizedList,thumbList]
    return returnList,errlist
