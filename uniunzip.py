#-*- coding:utf-8 -*-

import zipfile, sys, os

##zf = zipfile.ZipFile(sys.argv[1], 'r')
##for m in zf.infolist():
##    data = zf.read(m) # extract zipped data into memory
##    # convert unicode file path to utf8
##    disk_file_name = m.filename.encode('utf8')
##    dir_name = os.path.dirname(disk_file_name)
##    try:
##        os.makedirs(dir_name)
##    except OSError as e:
##        if e.errno == os.errno.EEXIST:
##            pass
##        else:
##            raise
##    except Exception as e:
##        raise
##
##    with open(disk_file_name, 'wb') as fd:
##        fd.write(data)
##zf.close()

def ext(zipname):
    zf = zipfile.ZipFile(zipname, 'r')
    zf.extractall()
    zf.close() 

def cpunzipdir(zipname,targetdir):
    zf = zipfile.ZipFile(zipname, 'r')
    for m in zf.infolist():
        if m.external_attr == 16:
            print('dir not yet.')
        data = zf.read(m) # extract zipped data into memory
        # convert unicode file path to utf8
        try:
            disk_file_name = m.filename.encode('cp437').decode('cp949')
        except UnicodeEncodeError:
            disk_file_name = m.filename
        
        dir_name = os.path.dirname(targetdir)
        try:
            os.makedirs(dir_name)
        except OSError as e:
            if e.errno == os.errno.EEXIST:
                pass
            else:
                raise
        except Exception as e:
            raise

        disk_file_name = os.path.join( dir_name, disk_file_name)
        with open(disk_file_name, 'wb') as fd:
            fd.write(data)
    zf.close()


def cpunzip(zipname):
    zf = zipfile.ZipFile(zipname, 'r')
    for m in zf.infolist():

        if m.external_attr == 16:
            print('dir not yet.')
        
        data = zf.read(m) # extract zipped data into memory
        # convert unicode file path to utf8
        try:
            disk_file_name = m.filename.encode('cp437').decode('cp949')
        except UnicodeEncodeError:
            disk_file_name = m.filename
        
        print(disk_file_name)
        dir_name = os.path.dirname(disk_file_name)
        #os.makedirs(dir_name)
        with open(disk_file_name, 'wb') as fd:
            fd.write(data)
    zf.close()
