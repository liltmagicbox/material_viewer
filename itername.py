from os import listdir

def itername(filename,ext):
    if ext[0]==".":
        ext=ext[1:]
    flist = listdir()
    no=0
    isok = "{}_{}.{}".format(filename,no,ext)
    while isok in flist:
        no+=1
        isok = "{}_{}.{}".format(filename,no,ext)
    print('backup no:',no)
    return isok

def iternamedir(filename,ext,dir):
    if ext[0]==".":
        ext=ext[1:]
    flist = listdir(dir)
    print(flist)
    no=0
    isok = "{}_{}.{}".format(filename,no,ext)
    while isok in flist:
        no+=1
        isok = "{}_{}.{}".format(filename,no,ext)
    print('namee',isok)
    return isok
