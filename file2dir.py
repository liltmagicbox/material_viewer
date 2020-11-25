from os import listdir, mkdir, rename
from os.path import isfile, join, splitext

def txt2dir( targetdir ):
    txtlist = []
    errlist = []

    flist = listdir( targetdir)
    for i in flist:
        if isfile(i):
            continue
        ipath = join( targetdir, i)

        name,ext = splitext(i)
        namedir = join( targetdir, name)
        if ext.lower() == '.txt':
            try:
                mkdir(namedir)
                rename(ipath, join(namedir,i) )# if mk fail, skip.
                txtlist.append(name)
            except Exception as e:
                errlist.append('txt2dir:'+str(e)[:280] )
                #print(e)
    #lastword = "in dir:{},txtdir:{}".format(len(flist),len(txtlist))
    #print( lastword )
    return txtlist,errlist

imgExt = {'.jpg','.jpeg','.png','.gif','.webp','.bmp',}

def img2dir( targetdir ):
    imglist = []
    errlist = []

    flist = listdir( targetdir)
    for i in flist:
        if isfile(i):
            continue
        ipath = join( targetdir, i)

        name,ext = splitext(i)
        namedir = join( targetdir, name )
        #note if dirname == 1.jpg , split works. wow...jpg -> can be so!
        if ext.lower() in imgExt:
            try:
                mkdir(namedir)
                rename(ipath, join(namedir,i) )
                imglist.append(name)
            except Exception as e:
                errlist.append('img2dir:'+str(e)[:280] )
                #print(e)
    #lastword = "in dir:{},imgdir:{}".format(len(flist),len(imglist))
    #print( lastword )
    return imglist,errlist
