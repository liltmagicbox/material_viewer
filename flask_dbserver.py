"prevent #-*- coding:utf-8 -*-"

from os import listdir, mkdir, rename, remove, makedirs
from os.path import isfile, join, splitext, isdir, getsize
from shutil import rmtree#remove not work if filled.rmtree(tempdir)

from jar import getJar, jar_dir, imgtower_dir
import newdb
import userdb
from jsonio import *

from flask import send_from_directory, send_file
from flask import Flask, render_template, request, jsonify, abort

app = Flask(__name__)

@app.route('/')
def hello():
   return 'hello'


@app.route('/view')
def viewmain():
   return render_template('rocketbox.html')

@app.route('/taginput')
def taginput():
   return render_template('highspeedtag.html')

@app.route('/server_info')
def hello_json():
    data = {'server_name' : '0.0.0.0', 'server_port' : '8080'}
    return jsonify(data)




@app.route('/jarscan')
def jarScan():
    global datas
    no = backupDatas(datas)
    datas = minidb.jarScan(datas)
    return "backup no:"+str(no)+'jarscan after:'+str(len(datas))

# @app.route('/file/<path:filenameinput>', methods=['GET', 'POST'])
# def download(filenameinput):
#     # 디렉터리에선 폴더명이다. upload 로 s안붙이니 안나왔음;
#     #파일네임을 입력을 받은걸, 어떻게든 넘기는구조같다.
#     #디렉터리에서 파일을 보내는 함수라는것은 알겠어..
#     return send_from_directory(directory='uploads', filename=filenameinput)




#used /static/js/---.js or so.
@app.route('/static/<path:filenameinput>', methods=['GET', 'POST'])
def staticFile(filenameinput):
    # 디렉터리에선 폴더명이다. upload 로 s안붙이니 안나왔음;
    #파일네임을 입력을 받은걸, 어떻게든 넘기는구조같다.
    #디렉터리에서 파일을 보내는 함수라는것은 알겠어..
    print('filenameinput',filenameinput)
    #return send_file( filename=filenameinput )
    return send_file( filename_or_fp = filenameinput )
    #http://localhost:12800/static/mah.txt로 접속시,staic폴더안에연결됨.ㅇㅋ




#------------------------ fetch

#toolong @app.route('/fetch/bodytext/<path:no>')
@app.route('/fetch')
def fetchParse():
    global datas
    no = request.args.get('no')
    key = request.args.get('key')
    #request.query_string
    ##print(no,key)
    valueText = datas[no][key]
    ##print(valueText)
    #return( valueText )
    #data = {'server_name' : '0.0.0.0', 'server_port' : '8080'}# it! works!
    data = { 'bodytext':valueText }
    return jsonify(data)

@app.route('/heavyfetch')
def heavyfetchParse():
    global datas
    global fluid
    #no = request.args.get('no')
    key = request.args.get('key')
    #request.query_string
    tmplist=[]
    tmplist2=[]
    tmpdict={}
    for n in fluid:
        tmpdict[n] = fluid[n][key]

    valueText = datas[no][key]
    print(no,key)
    print(valueText)
    #return( valueText )
    #data = {'server_name' : '0.0.0.0', 'server_port' : '8080'}# it! works!
    data = { 'bodytext':valueText }
    return jsonify(data)

# @app.route('/bodyload')
# def bodyload():
#     global datas
#     global fluid
#     key = request.args.get('key')
#     tmpdict[n] = fluid[n][key]
#     data = { 'bodytext':valueText }
#     return jsonify(data)





#이거보단명령어.ㅇㅋ. fluiddb.fluid[no]['캐릭터태그']

tdict={}
@app.route('/fetchtag')
def fetchtag():
    global datas
    global tdict
    #print(request.query_string)
    no = request.args.get('no')
    taglist = request.args.get('taglist')
    taglist = taglist.split(',')
    #tdict[no]=taglist
    taglist = list(set(taglist))

    if taglist[0]=='뮤즈':
        taglist=['호노카','코토리','우미','마키','린','하나요','에리','니코','노조미']



    no=str(no)
    user='핫산테크'
    key='캐릭터태그'
    if taglist[0]=='':
        fluiddb.cleartext(user,no,key,)

    if fluiddb.fluidset(no) == True:#made this time.
        for text in taglist:
            if fluiddb.addtext(user,no,key,text) != True:
                print('NEVER SEE THIS error but exception it exit.bad!')
            else:
                print('add first ok')
    else:#alreadywas. rewrite
        fluiddb.cleartext(user,no,key,)
        for text in taglist:
            #fluiddb.subtext(user,no,key,text)
            fluiddb.addtext(user,no,key,text)
            #print('subtext', fluiddb.subtext(user,no,key,text) )
            #print('addagain', fluiddb.addtext(user,no,key,text) )
    #fluiddb.addn(user,no,'조')
    print(no,taglist)
    return 'ok'






def clearjar():
    pass

#----------------------upload
from timemaker import millisec, datestr, intsec, datestrstamp
from uuid import uuid4
#-------lock jar.
# user, time, remainT, key(secret)
jarinfo = ["",0,0,""]


def isfreejar():
    global jarinfo
    if jarinfo[2]-intsec()<0:
        unlockjar()
    return jarinfo[0] == ""

def lockjar(username):
    global jarinfo
    jarinfo[0] = username
    jarinfo[1] = intsec()
    jarinfo[2] = jarinfo[1]+30
    jarinfo[3] = str(uuid4())[:13]
    return jarinfo[3]

def unlockjar():
    global jarinfo
    jarinfo[0] = ""
    jarinfo[1] = intsec()
    jarinfo[3] = ""

# def authjar(username):
#     global jarinfo
#     return jarinfo[0] == username

def jaraddtime(size):
    global jarinfo
    jarinfo[2] += int(float(size)*2) #1000MB, 2000sec.

def keycheck(uploadkey):
    return jarinfo[3]==uploadkey

def getuploadkey(username):
    if isfreejar() == True:
        return lockjar(username)
    else:
        return ""

#this can be bad by js change.
# @app.route('/lockjar', methods = [ 'POST'])
# def lockjar():
#     global jarinfo
#     if jarinfo[0] == "":
#         token = request.form['token']
#         username = userdb.getname(token)
#         if username == "noname":
#             "only logged in."
#         jarinfo[0] = username
#         jarinfo[1] = datestr()
#         return "jar in"
#     else:
#         return "jar busy! by {}, from {}".format(jarinfo[0],jarinfo[1])
#
# @app.route('/unlockjar', methods = [ 'POST'])
# def unlockjar():
#     global jarinfo
#     token = request.form['token']
#     username = userdb.getname(token)
#     if username == jarinfo[0]:
#         jarinfo[0] == ""
#     jarinfo[1] = datestr()

from tidyname import tidyName

@app.route('/uploadkey', methods = [ 'POST'])
def uploadkey():
    if request.method == 'POST':
        token = request.form['token']

        username = userdb.getname(token)
        if username == "noname":
            abort(403)#403 Forbidden
        #---jar auth.
        uploadkey = getuploadkey(username)
        if uploadkey == "":
            msg = "jar busy! by {}, from {}, remain time: {}".format(jarinfo[0], datestrstamp(jarinfo[1]), (jarinfo[2]-intsec()) )
        else:
            msg = ""

        data = { 'uploadkey': uploadkey, 'msg':msg }
        return jsonify(data)

import zipfile
import zipfileuni
from werkzeug.utils import secure_filename
#업로드 HTML 렌더링
@app.route('/upload')
def render_file():
    boardList = list(newdb.db.keys())
    return render_template('filedrop.html', galleryList = boardList )

#파일 업로드 처리
#https://flask.palletsprojects.com/en/1.1.x/patterns/fileuploads/
@app.route('/zipfileup', methods = [ 'POST'])
def zipfileup():
    if request.method == 'POST':
        board = request.form['board']
        ziptype = request.form['ziptype']
        zipsize = request.form['zipsize']#for jaresti(size)

        upload_key = request.form['upload_key']
        if keycheck(upload_key) == False: abort(403)#403 Forbidden

        if not board in newdb.db.keys():
            abort(403)#403 Forbidden
        if float(zipsize)>2000:
            abort(403)#403 Forbidden


        f = request.files['file']
        #f.save(secure_filename(f.filename))
        #print(f.filename)
        if f.filename[-3:] != 'zip':
            abort(403)#403 Forbidden
        #sname = secure_filename(f.filename)
        sname = tidyName(f.filename)
        #print(sname)

        if ziptype=="단일만화":#manga
            fname = splitext(sname)[0]
            unzipdir = join(jar_dir,fname)
            mkdir( unzipdir)
        if ziptype == "여러개묶음":#novels, imgs, crawl
            unzipdir = jar_dir

        filepath = join(unzipdir,sname)
        f.save( filepath )
        size = getsize( filepath )//1024//1024#xMB.
        if size>2000:
            remove(filepath)# need log here.
            abort(403)#403 Forbidden

        jaraddtime(size)
        zf = zipfileuni.ZipFile( filepath )
        zf.extractall(unzipdir)
        zf.close()
        remove(filepath)

        newdict,jarerrlist = getJar( newdb.db[board] )
        errstr = ""
        for i in jarerrlist: errstr+=i

        #board = board
        uploader = jarinfo[0]
        uploadtime = datestr()
        for id in newdict:
            #----------------------for custom dict additional option
            #del only [번역]---.
            if newdict[id]['제목'].startswith('[번역]'):
                newdict[id]['제목'] = newdict[id]['제목'].split('[번역]')[1].strip()
            #if '센세)', add 태그.
            tagtext = ""#for tag exist.
            if newdict[id]['제목'].find('센세)') != -1 :
                tagtext = '작가:'+newdict[id]['제목'].split('센세)')[0].strip()

            #-general work
            newdb.newarticle(board,id,uploader,uploadtime)
            newdb.db[board][id].update( newdict[id] )

            #post-custom additonal option..it caused err!
            if tagtext != "":
                newdb.addtag(board,id, uploadtime,uploader,tagtext )

        #get headdict, backup.
        newdb.after_newarticle(board)

        unlockjar()
        zipdonetext = "success:{}, err:{}, errmsg:{}".format( len(newdict), len(jarerrlist), errstr )
        return zipdonetext
        #return str(newdict)+str(jarerrlist)
        #return '처리완료:{},{}MB <br>이전 목록 길이:{} <br> {}'.format(sname,size,oldlen,scann)


# @app.route('/rawfileup', methods = [ 'POST'])
# def rawfileup():
#     if request.method == 'POST':
#         board = request.form['board']
#
#         f = request.files['file']
#         if f.filename[-3:] != 'zip':
#             return 'zip파일을 줘!'
#         sname = secure_filename(f.filename)
#         fname = splitext(sname)[0]
#         unzipdir = join(jar_dir,fname)
#         mkdir( unzipdir)
#         filepath = join(unzipdir,sname)
#         f.save( filepath )
#         size = getsize( filepath )//1024//1024
#         zf = zipfile.ZipFile( filepath )
#         zf.extractall(unzipdir)
#         zf.close()
#         return "done"



#------------------------ post file upload.


@app.route("/xmliterimg", methods=['POST'])
def xmliterimg():
    f = request.files['file']
    iter = request.form['iter']
    #print(f)
    #print(iter)
    upload_key = request.form['upload_key']
    if keycheck(upload_key) == False: abort(403)#403 Forbidden

    #--------make dir
    titletext = request.form['titletext']
    if titletext == "":titletext = "no title"
    titletext = titletext[:30]
    sname = tidyName(titletext)
    unzipdir = join(jar_dir,sname)
    makedirs(unzipdir, exist_ok=True)

    ext = splitext(f.filename)[1]
    sname =  iter+ext
    #sname = secure_filename(f.filename)
    filepath = join(unzipdir,sname)
    jaraddtime(5)
    f.save( filepath )
    return "imgup"#it's key to tell success! see filedrop.html

@app.route("/xmltext", methods=['POST'])
def xmltext():
    board = request.form['board']
    #uploader = request.form['username']
    bodytext = request.form['bodytext']

    upload_key = request.form['upload_key']
    #print(upload_key) #note that if same tab, fast clicked, it fails. by new key.
    if keycheck(upload_key) == False: abort(403)#403 Forbidden

    #--------make dir
    titletext = request.form['titletext']
    if titletext == "":titletext = "no title"
    titletext = titletext[:30]
    sname = tidyName(titletext)
    unzipdir = join(jar_dir,sname)
    makedirs(unzipdir, exist_ok=True)

    #print(1) if 1==2 else print(2)
    txtname = join(unzipdir,"body.txt")
    with open ( txtname, 'w', encoding = "utf-8") as f:
        f.write(bodytext)

    #---get jar seq.
    newdict,jarerrlist = getJar( newdb.db[board] )
    errstr = ""
    for i in jarerrlist: errstr+=i

    #board = board
    uploader = jarinfo[0]
    uploadtime = datestr()
    for id in newdict:
        newdb.newarticle(board,id,uploader,uploadtime)
        newdb.db[board][id].update( newdict[id] )

    newdb.after_newarticle(board)

    unlockjar()
    return "txtup"#it's key to tell success! see filedrop.html


#-----------------------------new board.
#
# @app.route('/parent', methods=['GET', 'POST'])
# def parent():
#     return render_template('htmlparent.html')

@app.route('/son', methods=['GET', 'POST'])
def son():
    a={}
    a['age']=3
    return render_template('son.html' , ob=a)


@app.route('/newboard', methods=['GET', 'POST'])
def newboard():
    return render_template('newboard.html')

@app.route('/createboard', methods=['GET', 'POST'])
def createboard():
    if request.method == 'POST':
        name = request.form['name']
        boardtype = request.form['boardtype']
        heros = request.form['heros']
        newdb.newboard(name)
        return "new board created : {}".format(name)


#제목하고 작성자,업로더 등 비밀스런 풀정보 다 공개하기.. 및 수정,삭제모드.
#정렬은 솔직히 하기 싫은데요..

# @app.route('/articleboard' )
# def articleboard():
#     dataList = []
#     board = "gallery"
#     for id in newdb.db[board]:
#         item = {}
#         item["id"] = newdb.db[board][id][newdb.id_key]
#         item["title"] = newdb.db[board][id][newdb.title_key]
#         item["writer"] = newdb.db[board][id][newdb.writer_key]
#         item["date"] = newdb.db[board][id][newdb.date_key]
#
#         item["uploadtime"] = newdb.db[board][id].get(newdb.uploadtime_key)
#         item["uploader"] = newdb.db[board][id].get(newdb.uploader_key)
#
#         dataList.append( item )
#
#         boardList = list(newdb.db.keys())
#     #return render_template('articleboard.html' ,dataList = dataList, boardList = boardList)


@app.route('/articleboard' )
def articleboard():
    boardList = list(newdb.db.keys())
    return render_template('articleboard.html' , boardList = boardList)

@app.route('/articleview/<path:input>' )
def articleview(input):
    board = input
    dataList=[]
    for id in newdb.db[board]:
        item = {}
        item["id"] = newdb.db[board][id][newdb.id_key]
        item["title"] = newdb.db[board][id][newdb.title_key]
        item["writer"] = newdb.db[board][id][newdb.writer_key]
        item["date"] = newdb.db[board][id][newdb.date_key]

        item["uploadtime"] = newdb.db[board][id].get(newdb.uploadtime_key)
        item["uploader"] = newdb.db[board][id].get(newdb.uploader_key)

        dataList.append( item )

    sortedList = sorted( dataList , key= lambda k: k["uploadtime"]  ,reverse = True)#higher first
    return render_template('articleviewer.html' , boardname = board, itemList = sortedList)

@app.route('/Fshowarticles' , methods = ['POST'] )
def Fshowarticles():
    requestdict = request.get_json()
    board = requestdict['board']
    print(board)

    dataList=[]
    for id in newdb.db[board]:
        item = {}
        item["id"] = newdb.db[board][id][newdb.id_key]
        item["title"] = newdb.db[board][id][newdb.title_key]
        item["writer"] = newdb.db[board][id][newdb.writer_key]
        item["date"] = newdb.db[board][id][newdb.date_key]

        item["uploadtime"] = newdb.db[board][id].get(newdb.uploadtime_key)
        item["uploader"] = newdb.db[board][id].get(newdb.uploader_key)

        dataList.append( item )

    return jsonify(dataList)


@app.route('/xmldelarticle' , methods = ['POST'] )
def xmldelarticle():
    board = request.form['board']
    id = request.form['id']
    token = request.form['token']

    username = userdb.getname(token)

    if userdb.ismanager(username) or userdb.ismaster(username):
        pass
    else:
        return "you can not delete!"

    if subarticle(board,id) == True:
        text = "del success!"
    else:
        text = "del fail.."
    return text

@app.route('/fetchdelarticle' , methods = ['POST'] )
def fetchdelarticle():
    requestdict = request.get_json()
    board = requestdict['board']
    id = requestdict['id']
    if subarticle(board,id) == True:
        text = "sub success!"
    else:
        text = "sub fail.."
    data={"text" : text}
    return jsonify(data)


#x버튼에연계, post로 들어오면,제거하기.?
def subarticle(board,id):
    newdb.subarticle(board,id)
    subimgs(id)
    return True

def subimgs(id):
    try:
        rmtree( join(imgtower_dir, id) )
    except FileNotFoundError:
        pass

# too tricky, even imgtower. we do not prevent from now.!
#def getpreventset():
#    newdb.db[board][id]

#--------------------------user methods

@app.route('/assignuser' )
def assignuser():
    return render_template('assignuser.html')

@app.route('/assignauth', methods = [ 'POST'] )
def assignauth():
    name = request.form['name']
    auth = request.form['auth']
    if auth == "master":
        return userdb.newmaster(name)
    elif auth == "manager":
        return userdb.newmanager(name)
    return "badgateway"


@app.route('/newuserpage' )
def newuserpage():
    return render_template('newuserpage.html')

@app.route('/newuser' , methods = [ 'POST'])#why need get?
def newuser():
    if request.method == 'POST':
        username = request.form['username']
        sha = request.form['sha']
        return userdb.newuser(username,sha)

@app.route('/login' , methods = [ 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        sha = request.form['sha']
        return userdb.login(username,sha)


#-------------------------log in fetch.

@app.route('/fetchlogin', methods = [ 'POST'] )
def fetchlogin():
    #print( request.get_json() )
    requestdict = request.get_json()
    #print(type(requestdict)) dict.fine.
    username = requestdict['username']
    sha = requestdict['sha']
    #print(username,sha)

    #token = userdb.user.get(username).get('token')
    token = userdb.login(username,sha)#token='no' if not in.
    data = { 'token': token, 'username':username }
    return jsonify(data)

@app.route('/fetchnewuser' , methods = [ 'POST'])
def fetchnewuser():
    requestdict = request.get_json()
    username = requestdict['username']
    sha = requestdict['sha']
    print(username,sha)
    data = { 'bodytext' : userdb.newuser(username,sha) }
    return jsonify(data)



if __name__ == "__main__":
    app.run(debug = True, host='0.0.0.0' , port = '12800')
