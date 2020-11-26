from os import listdir, mkdir, rename, remove, makedirs
from os.path import isfile, join, splitext, isdir, getsize

from jar import getJar, jar_dir
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
from timemaker import millisec, datestr, intsec

#-------lock jar.
jarinfo = ["",0,0]

def freejar():
    global jarinfo
    if intsec()-jarinfo[1] > 10 + jarinfo[2] :
        unlockjar()
    return jarinfo[0] == ""

def lockjar(username):
    global jarinfo
    jarinfo[0] = username
    jarinfo[1] = intsec()

def authjar(username):
    global jarinfo
    return jarinfo[0] == username

def unlockjar():
    global jarinfo
    jarinfo[0] = ""
    jarinfo[1] = intsec()

def jaresti(size):
    global jarinfo
    jarinfo[2] = int(float(size)*1.5)

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



import zipfile
from werkzeug.utils import secure_filename
#업로드 HTML 렌더링
@app.route('/upload')
def render_file():
    return render_template('filedrop.html')

#파일 업로드 처리
#https://flask.palletsprojects.com/en/1.1.x/patterns/fileuploads/
@app.route('/zipfileup', methods = [ 'POST'])
def zipfileup():
    if request.method == 'POST':
        token = request.form['token']
        board = request.form['board']
        ziptype = request.form['ziptype']
        zipsize = request.form['zipsize']#for jaresti(size)


        username = userdb.getname(token)
        if username == "noname":
            abort(403)#403 Forbidden

        if not board in newdb.db.keys():
            abort(403)#403 Forbidden

        #---jar auth.
        if freejar() == True:
            lockjar(username)
            jaresti(zipsize)
        else:
            return "jar busy! by {}, from {}, remain time: {}".format(jarinfo[0],jarinfo[1], (10+jarinfo[2])-(intsec()-jarinfo[1]) )

        f = request.files['file']
        #f.save(secure_filename(f.filename))
        if f.filename[-3:] != 'zip':
            abort(403)#403 Forbidden
        sname = secure_filename(f.filename)

        if ziptype=="만화":#manga
            fname = splitext(sname)[0]
            unzipdir = join(jar_dir,fname)
            mkdir( unzipdir)
        if ziptype == "개별파일들":#novels, imgs, crawl
            unzipdir = jar_dir
        if ziptype == "폴더들":#novels, imgs, crawl
            unzipdir = jar_dir

        filepath = join(unzipdir,sname)
        f.save( filepath )
        size = getsize( filepath )//1024//1024#xMB.
        if size>2000:
            remove(filepath)# need log here.
            abort(403)#403 Forbidden

        zf = zipfile.ZipFile( filepath )
        zf.extractall(unzipdir)
        zf.close()
        remove(filepath)
        #newdict,jarerrlist = getJar( newdb.db[board] )
        unlockjar()
        return "zip upload done"
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
from tidyname import tidyName

@app.route("/xmliterimg", methods=['POST'])
def xmliterimg():
    f = request.files['file']
    #print(f)
    iter = request.form['iter']
    #print(iter)
    #uploader = request.form['username']
    token = request.form['token']
    titletext = request.form['titletext']

    username = userdb.getname(token)
    if username == "noname":
        return "log in plz"
    if freejar() == True:
        lockjar(username)
        jaresti(20)

    if authjar(username) == True:
        pass
    else:
        return "jar busy! by {}, from {}, remain time: {}".format(jarinfo[0],jarinfo[1], (20+jarinfo[2])-(intsec()-jarinfo[1]) )

    if titletext == "":titletext = "no title"
    #unzipdir = join(jar_dir,"temp")
    sname = tidyName(titletext)
    unzipdir = join(jar_dir,sname)
    makedirs(unzipdir, exist_ok=True)

    ext = splitext(f.filename)[1]
    sname =  iter+ext
    #sname = secure_filename(f.filename)

    filepath = join(unzipdir,sname)
    f.save( filepath )
    unlockjar()
    return "imgup"#it's key to tell success! see filedrop.html

@app.route("/xmltext", methods=['POST'])
def xmltext():
    #uploader = request.form['username']
    token = request.form['token']
    username = userdb.getname(token)
    if username == "noname":
        #abort(403)#403 Forbidden
        return "log in plz"

    titletext = request.form['titletext']
    bodytext = request.form['bodytext']


    if freejar() == True:
        lockjar(username)
        jaresti(60)
    if authjar(username) == True:
        pass
    else:
        return "jar busy! by {}, from {}, remain time: {}".format(jarinfo[0],jarinfo[1], (60+jarinfo[2])-(intsec()-jarinfo[1]) )


    if titletext == "":titletext = "no title"
    titletext=titletext[:30]
    #print(1) if 1==2 else print(2)
    sname = tidyName(titletext)
    unzipdir = join(jar_dir,sname)
    makedirs(unzipdir, exist_ok=True)

    txtname = join(unzipdir,"body.txt")
    with open ( txtname, 'w', encoding = "utf-8") as f:
        f.write(bodytext)
    unlockjar()
    return "txtup"#it's key to tell success! see filedrop.html


#-----------------------------new board.

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
    app.run(debug = False, host='0.0.0.0' , port = '12800')
