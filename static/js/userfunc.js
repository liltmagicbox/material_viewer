function fetchnewuser(){
  let username = document.getElementById("username").value
  let sha = sha256(encodeURI( document.getElementById("sha").value ))
  let params = { 'username': username, 'sha': sha,}
  let url = window.location.href.split(window.location.pathname)[0]
  let fetchurl = url+'/fetchnewuser'
fetch(fetchurl,
{
  method: 'POST', // or 'PUT'
  body: JSON.stringify(params), // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json'
  }
})
//.then( function(response){return response.json()})
.then( response => response.json() )
.then(function(myJson){
  let rawText = myJson['bodytext']
  //console.log(rawText)

  let a = document.createElement('p')
  a.innerText = rawText
  document.body.appendChild(a)
  alert(rawText)

})

}


//get from value, do.fine. ..if you filled value, you can log in..hehe..
function fetchlogin(){
  let username = document.getElementById("username").value
  let sha = sha256(encodeURI( document.getElementById("sha").value ))
  //let sha = document.getElementById("sha").value

  //document.cookie = "username="+username
  //document.cookie = "sha="+sha
  realfetchlogin( username, sha)
}

function realfetchlogin( username, sha){

  let params = { 'username': username, 'sha': sha,}
  //let url = window.location.href.split(window.location.pathname)[0]
  //let fetchurl = url+'/fetchlogin'
  let fetchurl = '/fetchlogin'

//fetch(fetchurl, {method: 'POST', body: JSON.stringify( params )} )
fetch(fetchurl,
{
  method: 'POST', // or 'PUT'
  body: JSON.stringify(params), // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json'
  }
})

//.then( function(response){return response.json()})
.then( response => response.json() )
.then(function(myJson){
  //let rawText = myJson['bodytext']
  //console.log(rawText)

  //let username = myJson['username']
  let userlevel = myJson['userlevel']
  let token = myJson['token']
  if(token=='no'){
    alert('뭔가 문제가..!')
    return false
  }
  else{
    document.cookie = "token="+token
    document.cookie = "username="+username
    document.cookie = "sha="+sha
    document.cookie = "userlevel="+userlevel
    document.getElementById("username").value = username
    document.getElementById("sha").value = '로그인성공'
    document.getElementById("userlevel").value = userlevel
    document.getElementById("userlevel").innerText = userlevel
    showlogout()
    return true//do we need it?
  }
})

}




function showlogout(){
  let username = document.getElementById("username")
  let sha = document.getElementById("sha")
  username.disabled=true
  sha.disabled=true
  let fetchnewuserB = document.getElementById("fetchnewuserB")
  let fetchloginB = document.getElementById("fetchloginB")
  let fetchlogoutB = document.getElementById("fetchlogoutB")
  fetchnewuserB.hidden=true
  fetchloginB.hidden=true
  fetchlogoutB.hidden=false
}

function fetchlogout(){
  username.disabled=false
  sha.disabled=false
  /*
  let fetchnewuserB = document.getElementById("fetchnewuserB")
  fetchnewuserB.hidden=false
  let fetchloginB = document.getElementById("fetchloginB")
  fetchloginB.hidden=false
  let fetchlogoutB = document.getElementById("fetchlogoutB")
  fetchlogoutB.hidden=true
  */

  //document.cookie = "username=no"
  //document.cookie = "token=no"
  //document.cookie = "sha=no"
  //NOTE : path/path2/path3 .. problem. if so, del path.
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "sha=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "userlevel=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.reload()
}


function filltoken(){
//username = document.getElementById("username")
let token = getCookie("token")
if (token == ""){
  console.log('no token. get again after 1s..')
setTimeout("filltoken()", 1000)
}

else{
let userbox = document.getElementById("token")
userbox.value = token
}

}



function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//lol use not this www
/*
function gettoken(){
  var decodedCookie = decodeURIComponent(document.cookie)
  var ca = decodedCookie.split(';')
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i].trim()
    var name = 'token='
    if (c.indexOf(name) == 0)
    if( c.includes() ){
    var token = c.slice( c.indexOf('token=')+1+5 ).trim()
    }
  }
  return token
}
*/



let lazyhtml =`
<form pop = 0 action="/login" method="post" autocomplete="on">
  <br>
  <span>닉네임 : </span><input type="text" name="username" id="username"><br>
  <span>주문 : </span><input type="text" name="sha" id="sha"><br>
  <!--span>data : </span><input type="text" name="data"><br-->
  <br>
  <!--button type="submit" formmethod="POST">로그인</button-->
</form>
<button id= "fetchloginB" type="button" name="button">로그인</button>
<button id= "fetchnewuserB" type="button" name="button"> <a href="/newuserpage">새로만들기</a> </button>
<button id= "fetchlogoutB" type="button" name="button" hidden>로그아웃</button>
<button id= "userlevel" type="button" ></button>
`
function makeloginbox(frame){
  //frame.innerHtml = lazyhtml

  let template = document.createElement('template')
  template.innerHTML = lazyhtml
  //frame.appendChild(template.content.firstChild)
  frame.appendChild(template.content)

  fetchloginB = document.getElementById("fetchloginB")
  fetchloginB.addEventListener('click', fetchlogin)
  fetchlogoutB = document.getElementById("fetchlogoutB")
  fetchlogoutB.addEventListener('click', fetchlogout)

  initlogin()
}



function initlogin(){
  let username = getCookie('username')
  let sha = getCookie('sha')
  if(username!=''){
    realfetchlogin( username, sha)
  }
  // reayl..is false..
    //document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //document.cookie = "sha=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


//https://mine-it-record.tistory.com/278
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(window.location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


//-----below imported functions.

function xmldelarticle(board,id,token){
  var url = '/xmldelarticle'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)// true means async.
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  xhr.addEventListener("load", function(e){
    //Fshowarticles()
    ( e.srcElement.status==200 ? alert(e.srcElement.responseText) : alert("fail..") )
  })

  formData.append("board", board  )
  formData.append("id", id  )
  formData.append("token", token  )
  xhr.send(formData)
}

function xmlmodtitle(board,id,token,newtitle){
  var url = '/xmlmodtitle'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)// true means async.
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  xhr.addEventListener("load", function(e){
    //Fshowarticles()
    ( e.srcElement.status==200 ? alert(e.srcElement.responseText) : alert("fail..") )
  })

  formData.append("board", board  )
  formData.append("id", id  )
  formData.append("token", token  )
  formData.append("newtitle", newtitle  )
  xhr.send(formData)
}

function xmldelcomm(board,id,idx,token ,commloadB=null){
  if(confirm("삭제?")==false){return false}
  var url = '/xmldelcomm'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  xhr.addEventListener("load", function(event){
    let response = event.srcElement.responseText
    if( response == "noname"){alert("안된다")}
    if( response == "done" ){
      if(commloadB!=null){commloadB.click()}
    }
  } )

  formData.append("board", board)
  formData.append("id", id)
  formData.append("idx", idx)
  formData.append("token", token)
  xhr.send(formData)
}

function xmldeltag(board,id,idx,token ,commloadB=null){
  if(confirm("삭제?")==false){return false}
  var url = '/xmldeltag'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  xhr.addEventListener("load", function(event){
    let response = event.srcElement.responseText
    if( response == "noname"){alert("안된다")}
    if( response == "done" ){
      if(commloadB!=null){commloadB.click()}
    }
  } )

  formData.append("board", board)
  formData.append("id", id)
  formData.append("idx", idx)
  formData.append("token", token)
  xhr.send(formData)
}
