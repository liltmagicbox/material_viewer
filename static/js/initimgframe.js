
//imgframe init.
pagenum=1

board = decodeURI( window.location.search.split("board=")[1].split("&")[0] )
//board for first loading , used to load body, it access to db[board][id]..

function initImgframe(outFrameid = 'imgFrame'){

  //noList = keys(datas)
  viewList = Object.keys(datas)// here was first used nolist  glovally
  outFrame = document.getElementById(outFrameid)
  outFrame.innerHTML=""
  fillImgframe(viewList,outFrame,pagenum)
}


function initImgcol(){

  //noList = keys(datas)
  viewList = Object.keys(datas)

  let colNum = getColnum()
  let outFrame = getImgframe()
  setupCol(outFrame,colNum)
  fillImgcol(viewList,outFrame,pagenum)
}

function getImgframe(){
  return document.getElementById('imgFrame')
}

// replaced by {{}} template render. version.!
// function fetchHead(){
//   let headver =
//   let params = { 'headver': headver }
//
//   let url = window.location.href.split(window.location.pathname)[0]
//   let fetchurl = url+'/fetchhead'
//   fetch(fetchurl,
//   {
//     method: 'POST', // or 'PUT'
//     body: JSON.stringify(params), // data can be `string` or {object}!
//     headers:{
//       'Content-Type': 'application/json'
//     }
//   })
//
//
//   let head =
//   return head
// }


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

/*
리스트갖고있고,
메이크박스로는 개별생성가능.

일단 외부프레임을 얻고나서
외부프레임에,지정된페이지번호의 생성을 명령함.
..그럼 끝.이후는 버튼이 눌리면서 될것이다..이벤트발생하거나. init이니까.ㅇㅋ.
*/
