#https://yeowool0217.tistory.com/536
import hashlib
#file_hash = hashlib.sha256()
#file_hash.update('massman25')
#print (file_hash.hexdigest())
a = hashlib.sha256( 'mas'.encode() )
#print( a.hexdigest() )
#a = hashlib.sha256( '언젠가는말하고싶언s'.encode() ).hexdigest()[:10] easy 10 id.

import random

"""
계쩡에 업로드 로그 남기기. 파워레벨과 순차 용량증가로 2기가트롤링 방지.
그외요청은뭐있나? 아.소트. 토큰만들때 랜덤샤로 토큰만들자. 토큰에 랜뎜샤+비번할까싶다.?
노큰주의,토큰대신 비번만으로하면 비번으로뚫는게됨. 그래서 토큰으로 뚫게하는게 의미는좀있다..만
"""

def shasha(intext):
    return hashlib.sha256(intext.encode() ).hexdigest()

print("userdb loading..")

# username, sha, salt, token
tokens={}
user={}
def newuser(username,sha):
    if len(username)>20:
        return 'too long username'
    if len(username)==0:
        return 'too short username'
    if user.get(username) == None:
        #salt = username
        salt = str(random.randint(1,100000000)+random.randint(1,100000000))
        #tsalt = 'nosaltfrenchfries'
        tsalt = str(random.randint(1,100000000)+random.randint(1,100000000))
        #user[username] = { "sha" : shasha(sha+salt) ,"token":shasha(username+tsalt), "salt" : salt ,  "tsalt" : tsalt  }
        user[username] = { "sha" : shasha(sha+salt) ,"token":shasha(username+tsalt), "salt" : salt , }
        tokens[ user[username]["token"] ] = username
        backup()
        return 'new account!'
    else:
        return 'username already exist..'

def login(username,sha):
    if user.get(username) == None:
        return 'no'#for secure reason..
    salt = user[username]["salt"]
    if user[username]["sha"] == shasha(sha+salt):
        #return 'log in! hello {}'.format(username)
        return user[username]["token"]
    else:
        return 'no'#see function fetchlogin() in userfunc.js ...it's used for key..

# def tokencheck(username,token):
#     if user.get(username) == None:
#         return False
#     if token == user[username]["token"]:
#         return True
#     else:
#         return False
def tokencheck(token):
    if token in tokens:
        return tokens[token]#username
    else:
        return 'no'


def getname(token):
    if token in tokens:
        return tokens[token]#username
    else:
        return 'noname'

masters = []
managers = []

def newmaster(username):
    if username in user and username not in masters:
        masters.append(username)
        backup()
        return "greeting new master:{}".format(username)
    else:
        return "no"

def newmanager(username):
    if username in user and username not in managers:
        managers.append(username)
        backup()
        return "greeting new manager:{}".format(username)
    else:
        return "no"

def ismaster(username):
    return username in masters

def ismanager(username):
    return username in managers


def normaluser(username):
    if username in user and username in managers:
        managers.pop(managers.index(username))
    if username in user and username in masters:
        masters.pop(masters.index(username))

        backup()
        return "normal user :{}".format(username)
    else:
        return "no"

def deluser(username):
    if username in user and username in managers:
        managers.pop(managers.index(username))
    if username in user and username in masters:
        masters.pop(masters.index(username))
    if username in user:
        del user[username]

        backup()
        return "delete user :{}".format(username)
    else:
        return "no"

#----------------
from jsonio import *



def backup():
    saveJson( [tokens,user,masters,managers],"userdb.json")
def backdown():
    global tokens,user,masters,managers
    tokens,user,masters,managers = loadJson("userdb.json")

try:
    backdown()
    print("userdb backup loaded")
except:
    print("userdb backup not")
