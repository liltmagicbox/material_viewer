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
  let url = window.location.href.split(window.location.pathname)[0]
  let fetchurl = url+'/fetchlogin'

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
  let token = myJson['token']
  if(token=='no'){
    alert('뭔가 문제가..!')
    return false
  }
  else{
    document.cookie = "token="+token
    document.cookie = "username="+username
    document.cookie = "sha="+sha
    document.getElementById("username").value = username
    document.getElementById("sha").value = '로그인성공'
    showlogout()
    return true
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
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "sha=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.reload()
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
