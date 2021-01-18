/*input noList, creates block using dict. img loaded by get.*/
//for (var i = 0; i<20; i++){


function fillNewlist(noList){
  let colNum = getColnum()
  let outFrame = getImgframe()
  setupCol(outFrame,colNum)
  pagenum=1
  fillImgcol(noList,outFrame,pagenum)
}

function setupCol(outFrame,col){
  outFrame.innerHTML=""
  let endN = col+1
  let step;
  for (step = 1; step < endN; step++) {
    let column = document.createElement('div')
    column.className = 'imgCol'
    column.classList.add( 'col'+col )
    //column.id = "imgCol_"+step //maybe we can delete, by only html id policy. see worklog5, ln819.
    outFrame.appendChild(column)
  }
}




function fillImgcol(noList,outFrame,page){
  let boxColor = setColor()
  let miniLoad = parseInt( document.getElementsByClassName("thumbONB")[0].value )
  let colList = outFrame.getElementsByClassName('imgCol')
  let colNum = colList.length

  var boxLoad = 12

  var overLoad = noList.length
  var firstLoad = (page-1)*boxLoad
  var lastLoad = page * boxLoad
  //0 to 20, 20 to 40.
  //makes 0 to 19, 20 to 39.
  for (var step = firstLoad; step < lastLoad; step++) {
    if( step >= overLoad ){break}
    makeImgbox(datas,noList[step],colList[step%colNum] ,boxColor = boxColor ,miniLoad=miniLoad)
    //console.log(step%4)

  }
}
// function makemoreload(outFrame){
//   let butt = document.createElement('button')
//   butt.className = 'moreloadbutton'
//   butt.id = "moreloadbutton"
//   butt.innerText = "계속 로드"
//   outFrame.appendChild(butt)
// }

//page from 1
function fillImgframe(noList,outFrame,page){
  var boxLoad = 20

  var overLoad = noList.length
  var firstLoad = (page-1)*boxLoad
  var lastLoad = page * boxLoad
  //0 to 20, 20 to 40.
  //makes 0 to 19, 20 to 39.
  for (var step = firstLoad; step < lastLoad; step++) {
    if( step >= overLoad ){break}
    makeImgbox(datas,noList[step],outFrame)
  }
}
//for ( no of noList){    makeImgbox(datas,no,outFrame)  }


function makeImgbox(datas, no, outFrame,boxColor=0,miniLoad = 0){
  // get title, get date, get imgfilepath, create box
  //create box , img, title, date , attach to outframe

  //thumbPath = './static/resized/'+no+'/'+no+datas[no]['리사이즈'][0]
  let thumbPath = './static/resource/nothumb.jpg'
  if(datas[no]["리사이즈"].length!=0){
    thumbPath = './static/imgtower/'+no+'/resized/'+datas[no]['리사이즈'][0]
    //if(miniLoad==1){ thumbPath = './static/imgtower/' +no+ '/thumb/' +datas[no]['썸네일'][0] }
    if(miniLoad==1){ thumbPath = './static/imgtower/'+no+'/thumb/'+ no+'_1.jpg' }
  }

  let titleText = datas[no]['제목']
  let dateText = datas[no]['날짜']
  let imgNumber = datas[no]['리사이즈'].length
  let board = decodeURI( window.location.search.split("board=")[1].split("&")[0] )

  let box = document.createElement('div')
  box.className = 'imgBox'
  box.id = "imgBox_"+no
  box.no = no
  box.board = board
  box.setAttribute('color', boxColor)

  let title = document.createElement('h2')
  title.className = "imgTitle"
  title.innerText = titleText
  box.appendChild(title)

  let date = document.createElement('p')
  date.innerText = dateText
  date.className = "imgDate"
  box.appendChild(date)

  let imgArea = document.createElement('div')
  imgArea.className = 'imgArea'
  imgArea.id = "imgArea_"+no
  box.appendChild(imgArea)
  let im = document.createElement('img')
  //im.src = './static/resized/'+no+'/'+no+'_1.jpg'
  im.src = thumbPath
  //im.width = imgArea.clientWidth
  im.addEventListener('click', overLayview)
  imgArea.appendChild(im)

  // 더보기버튼이다, 누르면 더 로드된다. 스크롤처리하느라 고심함.
  let bodyB = document.createElement('button')
  bodyB.type = 'button' // if want submit, change. see mdn button
  bodyB.className = 'bodyB'
  bodyB.innerText = '로드('+(imgNumber-1)+')'
  //bodyB.id = "bodyB_"+no
  //bodyB.board= board
  //bodyB.no = no

  //bodyB.name = ""
  //bodyB.value = ""
  //bodyB.pressed = false
  bodyB.addEventListener('click',eventBodyload )
  box.appendChild(bodyB)


  let downB = document.createElement('button')
  downB.type = 'button' // if want submit, change. see mdn button
  downB.className = 'downB'
  downB.innerText = '다운'
  downB.addEventListener('click', function(e){eventDownload(box.no, box.board)} )
  box.appendChild(downB)




  if( getCookie("userlevel")=="manager"){

    let zipdownB = document.createElement('button')
    zipdownB.type = 'button' // if want submit, change. see mdn button
    zipdownB.className = 'zipdownB'
    zipdownB.innerText = 'zip다운'
    zipdownB.addEventListener('click', function(e){eventDownloadzip(box.no, box.board)} )
    box.appendChild(zipdownB)

    let delB = document.createElement('button')
    delB.type = 'button' // if want submit, change. see mdn button
    delB.className = 'delB'
    delB.innerText = '글삭제'
    delB.addEventListener('click', function(e){
      if(confirm("글을 삭제합니다?")==true){
        1
      }
      else{return false}

      let token = getCookie("token")
      xmldelarticle(board,no,token)
    })
    box.appendChild(delB)

    let modB = document.createElement('button')
    modB.type = 'button' // if want submit, change. see mdn button
    modB.className = 'modB'
    modB.innerText = '제목수정'
    modB.addEventListener('click', function(e){
      let token = getCookie("token")
      //xmldelarticle(board,no,token)
      let newtitle = prompt("최대30자)제목수정: "+titleText,titleText)
      if(newtitle!=null){xmlmodtitle(board,no,token,newtitle.substr(0,30))}
    })
    box.appendChild(modB)
  }




  //다운로드버튼이다. 누르면 zip으로다운해준다. ...필요한가??일단미작성.
  /*
  let downB = document.createElement('button')
  downB.type = 'button' // if want submit, change. see mdn button
  downB.className = 'downB'
  downB.innerText = '더 보기('+(imgNumber-1)+')'
  //downB.id = "bodyB_"+no
  downB.no = no
  //downB.name = ""
  //downB.value = ""
  downB.pressed = false
  downB.addEventListener('click',eventDownload )
  box.appendChild(downB)
  */

  outFrame.appendChild(box)

}

function overLayview(){
  preimg =event.currentTarget
  document.body.classList.add("stop_scroll")

  overviewer = document.createElement('div')
  overviewer.className = 'overviewer'
  overviewer.id = "overviewer"
  overviewer.width = window.innerWidth
  overviewer.height = window.innerHeight
  overviewer.addEventListener('click',overoff )
  //document.body.append
  document.body.appendChild(overviewer)
  //box.appendChild(overviewer)
  //im.addEventListener('click', overLayview)
  //imgArea.appendChild(im)
  innerviewer = document.createElement('div')
  innerviewer.className = 'innerviewer'
  innerviewer.id = "innerviewer"
  //innerviewer.width = window.innerWidth/2
  //innerviewer.height = window.innerHeight
  overviewer.appendChild(innerviewer)

  //innerviewer.innerHTML = preimg.parentElement.parentElement.innerHTML
  //makeImgbox(datas,noList[step],outFrame)


  box = innerviewer
  //let no= preimg.parentElement.id.split('_')[1]
  console.log(preimg)
  let before_id = preimg.parentElement.id.indexOf('_')
  let no = preimg.parentElement.id.slice(before_id+1)
  let board = preimg.parentElement.parentElement.board

  let titleText = datas[no]['제목']
  let dateText = datas[no]['날짜']

  let title = document.createElement('h2')
  title.className = "imgTitle"
  title.innerText = titleText
  box.appendChild(title)

  let date = document.createElement('p')
  date.innerText = dateText
  date.className = "imgDate"
  box.appendChild(date)

  let imlist = datas[no]['리사이즈']

  if(imlist.length!=0){

  let resizePath = './static/imgtower/'+no+'/resized/'
  //let partList = imlist.slice(1)
  for( var filename of imlist){
    let im = document.createElement('img')
    im.src = resizePath+filename
    innerviewer.appendChild(im)
  }
  }

  let bodyText = document.createElement('pre')
  bodyText.innerHTML+="<br><br>"

  let params = { 'no': no, 'key':'본문', "board" : board}
  var esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

  //let url = window.location.href.replace( window.location.pathname , '')
  let url = window.location.href.split(window.location.pathname)[0]
  let fetchurl = url+'/fetchbodytext?'+query

  fetch(fetchurl)
  .then( function(response){return response.json()})
  .then(function(myJson){
    let rawText = myJson['bodytext']
    let urls = rawText.match(/\bhttps?:\/\/\S+/gi)
    //console.log(urls.length)
    if(urls!=null){
      for( var u of urls){
        //linkalt = u.slice(u.indexOf('//')+2,25)+'...'
        let linkalt = u
        bodyText.innerHTML += linkalt.link(u)+'\n'+'\n'
      }
      let rawText2 = rawText
    for( var u of urls){
      //bodyText.innerHTML += rawText.slice(rawText.lastIndexOf(urls[urls.length-1])+urls[urls.length-1].length+1)
      let remain = ''
      for( var i of rawText2.split(u) ){remain+=i}
      rawText2 = remain

      //console.log(rawText2,'r2')
    }
    bodyText.innerHTML+=rawText2
    }
    else{
      bodyText.innerHTML+=rawText
    }
    innerviewer.appendChild(bodyText)
  })

}

overclickn = 0
function overoff(){
  overclickn +=1
  setTimeout( function(){overclickn=0}, 700)//350 for doubleclick. 500 for triple

  if(overclickn >1){//2 to triple
    overclickn=0
    document.body.classList.remove("stop_scroll")
    document.getElementById('overviewer').remove()
  }
}


//click img or box or button ? anyway we can choose.
function eventImclick(event){
  //event.currentTarget.pressed = !event.currentTarget.pressed
  let box = event.currentTarget
  bodyLoad(box)
}







function eventBodyload(event){
  //event.currentTarget.pressed = !event.currentTarget.pressed
  //let box = event.currentTarget.id
  scrollYbeforeloadbody = document.documentElement.scrollTop//become semi-global var for rollup
  //window.addEventListener('scroll', oldScrollY)

  //console.log(scrollYbeforeloadbody,'before')
  //window.scroll(0, scrollYbefore )

  let button = event.currentTarget//for delete self
  //let no = event.currentTarget.no
  //let board = event.currentTarget.board

  //let box = document.getElementById("imgBox_"+no)
  let box = event.currentTarget.parentElement
  //let imArea = document.getElementById("imgArea_"+no)
  //let imArea = box.firstElementChild

  let no = box.no
  let board = box.board



  box.getElementsByClassName("imgTitle")[0].setAttribute("shrink",0)


  let imgArea = box.getElementsByClassName('imgArea')[0]
  imgArea.innerHTML = "" // ONLY mobile n>1 requires thumbnail, fullchange.

  let imlist = datas[no]['리사이즈']

  if(imlist.length !=0){
  let resizePath = './static/imgtower/'+no+'/resized/'
  //imlist.shift()//for 1 already..

  let imList = []//
  //let partList = imlist.slice(1)
  for( var filename of imlist){

    let im = document.createElement('img')
    im.src = resizePath+filename
    //im.loading ='lazy'
    //im.width = imgArea.clientWidth
    im.style.display = 'none'//
    im.addEventListener('load', function(){window.scroll(0, scrollYbeforeloadbody )})
    imList.push(im)//
    imgArea.appendChild(im)
  }


  for( var im of imList){//
  im.style.display = 'inline'//
  window.scroll(0, scrollYbeforeloadbody )
  }
  window.scroll(0, scrollYbeforeloadbody )
  }


  let bodyText = document.createElement('pre')
  bodyText.innerHTML += "<br><br>"
  box.appendChild(bodyText)
  //bodyText.width = imgArea.clientWidth
  //box.appendChild(bodyText) why you here?!

  //make query string. flask gets and returns no,key mini datas.
  let params = { 'no': no, 'key':'본문', 'board': board }
  var esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
  //"parameter1=value_1&parameter2=value%202&parameter3=value%263"

  //http://liltbox.iptime.org:25252/fetch/bodytext/10399976
  //let url = window.location.href.replace( window.location.pathname , '')
  let url = window.location.href.split(window.location.pathname)[0]
  let fetchurl = url+'/fetchbodytext?'+query
  fetch(fetchurl)
  .then( function(response){return response.json()})
  .then(function(myJson){
    //bodyText.innerText = JSON.stringify(myJson)['bodytext']
    //console.log( JSON.stringify(myJson)['bodytext'] )

    //console.log( myJson['bodytext'] )
    let rawText = myJson['bodytext']



    // i tried parse http url myself, but failed.. when state: link text link .
    /*
    string = myJson['bodytext']
    console.log(string,'string')
    urlList=[]
    url = string.slice(  string.indexOf('http'), Math.min( string.indexOf(' '), string.indexOf('\n') )+1     )
    for(i=0;i<20;i++){if(url != ''){

      urlList.push(url)
      string = string.slice(  string.indexOf(url)+url.length+1     )
      url = string.slice(  string.indexOf('http'), Math.min( string.indexOf(' '), string.indexOf('\n') )+1     )
      console.log(url,'up')
    }}
    url = string.slice(  string.lastIndexOf('http'), Math.max( string.lastIndexOf(' '), string.lastIndexOf('\n'), string.lastIndexOf('') )+1    )
    for(i=0;i<20;i++){if(url != ''){
      urlList.push(url)
      string = string.slice(0,  string.lastIndexOf(url)  )
      url = string.slice(  string.lastIndexOf('http'), Math.max( string.lastIndexOf(' '), string.lastIndexOf('\n') , string.lastIndexOf('') )+1    )
      console.log(url,'dn')
    }}

    for(u of urlList){
      linkalt = '링크'
      bodyText.innerHTML += linkalt.link(u)+'\n'
    }
    //console.log(urls[urls.length-1])
    console.log(urlList[urlList.length-1])
    bodyText.innerHTML += string
    */





    let inText = document.createElement('p')

    //url parse and get link. notice that full url text will  go thorugh img box..
    let urls = rawText.match(/\bhttps?:\/\/\S+/gi)

    //console.log(urls.length)
    if(urls!=null){
      for( var u of urls){
        //linkalt = u.slice(u.indexOf('//')+2,25)+'...'
        //let linkalt = '링크'
        let linkalt = u
        bodyText.innerHTML += linkalt.link(u)+'\n'+'\n'
      }


    let rawText2 = rawText
    for( var u of urls){
      //bodyText.innerHTML += rawText.slice(rawText.lastIndexOf(urls[urls.length-1])+urls[urls.length-1].length+1)
      let remain = ''
      for( var i of rawText2.split(u) ){remain+=i+"*"}
      rawText2 = remain

      //console.log(rawText2,'r2')
    }


    inText.innerText = rawText2
    }
    else{
      inText.innerText = rawText
    }
    //rawText = rawText.replace(u, u.link(u)+'<br><br>' )
    //tryed this , but twitter.com  and twitter.com/view problem..ha.



    bodyText.appendChild(inText)
    //bodyText.innerText += myJson['bodytext']
    //bodyText.style.display = 'inline' text over, width change case.
    //box.appendChild(bodyText)







    window.scroll(0, scrollYbeforeloadbody )
    //console.log(document.documentElement.scrollTop,'after')
  })


  //bodyText.innerText = "get txt from ajax"


  //bodyLoad(box)
  //console.log(box);

  //button.remove()//now change button.fine! if remove, scroll Y confuse.
  button.removeEventListener('click',eventBodyload )
  button.innerText = '위로'
  //window.removeEventListener('scroll', oldScrollY)

  button.addEventListener('click',scrollup )


  //finally xml buttons.
  box.appendChild( document.createElement("hr") )

  addrecomB(box,no,board)
  addlikeB(box,no,board)
  addviewB(box,no,board)

  addcommarea(box,no,board)

  addtagarea(box,no,board)

}

function scrollup(){
  window.scroll(0, scrollYbeforeloadbody )
}


function addviewB(box,no,board){
  let recomB = document.createElement('button')
  recomB.type = 'button'
  recomB.className = 'viewB'
  recomB.classList.add( 'loadB' )
  recomB.innerText = '조회'
  recomB.value = "0"
  recomB.no = no
  recomB.board= board

  recomB.addEventListener('click', function(e){xmlviewB(recomB)} )
  box.appendChild(recomB)
}
function addrecomB(box,no,board){
  let recomB = document.createElement('button')
  recomB.type = 'button'
  recomB.className = 'recomB'
  recomB.innerText = '추천'
  recomB.value = "0"
  recomB.no = no
  recomB.board= board

  //recomB.id = "recomB_"+no
  //recomB.name = ""
  //recomB.value = ""
  //recomB.pressed = false
  recomB.addEventListener('click', function(e){xmlrecomB(recomB)} )
  box.appendChild(recomB)
}
function addlikeB(box,no,board){
  let likeB = document.createElement('button')
  likeB.type = 'button'
  likeB.className = 'likeB'
  likeB.innerText = '좋아'
  likeB.value = "0"
  likeB.no = no
  likeB.board= board

  //likeB.id = "likeB_"+no
  //likeB.name = ""
  //likeB.value = ""
  //likeB.pressed = false
  likeB.addEventListener('click', function(e){xmllikeB(likeB)} )
  box.appendChild(likeB)
}

function xmlviewB(recomB){
  var url = '/xmlview'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  xhr.addEventListener("load", function(event){
    let response = event.srcElement.responseText
    if( response<9999 ){recomB.innerText= "조회("+response+")"}
  } )

  let id = recomB.no
  let board = recomB.board
  formData.append("id", id)
  formData.append("board", board)
  xhr.send(formData)
}
function xmlrecomB(recomB){
  var url = '/xmlrecomlike'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  xhr.addEventListener("load", function(event){
    let response = event.srcElement.responseText
    if( response == "noname"){alert("로그인 하세요!")}
    //if( response == "value1"){recomB.value="1"; recomB.innerText="추천함";}
    //if( response == "value0"){recomB.value="0"; recomB.innerText="추천";}
    if( response<9999 ){recomB.innerText= "추천("+response+")"}
  } )

  let id = recomB.no
  let board = recomB.board
  let token = getCookie('token')
  formData.append("id", id)
  formData.append("board", board)
  formData.append("token", token)
  formData.append("key", "recom")
  xhr.send(formData)
}

function xmllikeB(likeB){
  var url = '/xmlrecomlike'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  xhr.addEventListener("load", function(event){
    let response = event.srcElement.responseText
    if( response == "noname"){alert("로그인 하세요!")}
    //if( response == "value1"){likeB.value="1"; likeB.innerText="추천함";}
    //if( response == "value0"){likeB.value="0"; likeB.innerText="추천";}
    if( response<9999 ){likeB.innerText= "좋아("+response+")"}
  } )

  let id = likeB.no
  let board = likeB.board
  let token = getCookie('token')
  formData.append("id", id)
  formData.append("board", board)
  formData.append("token", token)
  formData.append("key", "like")
  xhr.send(formData)
}



function addcommloadB(box,no,board){
  let commloadB = document.createElement('button')
  commloadB.type = 'button'
  commloadB.className = 'commloadB'
  commloadB.innerText = '로드'
  commloadB.no = no
  commloadB.board= board
  commloadB.value = 0

  //commloadB.id = "commloadB_"+no
  //commloadB.name = ""
  //commloadB.value = ""
  //commloadB.pressed = false
  commloadB.addEventListener('click', function(e){
    commloadB.value = 1
    fetchcommloadB(commloadB)} )
  box.appendChild(commloadB)
}
function fetchcommloadB(commloadB){
  let url = window.location.href.split(window.location.pathname)[0]
  //let fetchurl = url+'/fetchlogin'
  let fetchurl = '/fetchcommload'

  let id = commloadB.no
  let board = commloadB.board
  let token = getCookie('token')
  let params = { 'id': id, 'board': board,'token': token }
  fetch(fetchurl,
  {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(params), // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json() )
  .then( function(myJson){
    let commarea = commloadB.parentElement
    let commtext = commarea.getElementsByClassName("commtext")[0]
    commtext.innerHTML=""

    for( var idx of Object.keys(myJson) ){
      let d = myJson[idx]
      let li = document.createElement("li")
      li.idx = idx

      li.innerText = d["내용"] +' -'+d["유저"].slice(0,10)

      li.time = d["시간"]
      li.user = d["유저"]
      li.see = d["보기"]
      //these 3 are inner value.. may not seen..fine.

      let loginname = document.getElementById("username").value
      if(loginname == li.user || getCookie("userlevel")=="manager"){
      let delB = document.createElement("button")
      delB.innerText = "X"
      delB.addEventListener( "click", function(e){xmldelcomm(board,id,li.idx,token, commloadB)}  )
      li.appendChild(delB)
      }

      commtext.appendChild(li)
    }

  })

}

//moved to userfunc..
// function xmldelcomm(board,id,idx,token ,commloadB){
//   if(confirm("삭제?")==false){return false}
//   var url = '/xmldelcomm'
//   var xhr = new XMLHttpRequest()
//   var formData = new FormData()
//   xhr.open('POST', url, true)
//   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
//
//   xhr.addEventListener("load", function(event){
//     let response = event.srcElement.responseText
//     if( response == "noname"){alert("안된다")}
//     if( response == "done" ){
//       commloadB.click()
//     }
//   } )
//
//   formData.append("board", board)
//   formData.append("id", id)
//   formData.append("idx", idx)
//   formData.append("token", token)
//   xhr.send(formData)
// }




function addcommarea(box,no,board){
  let commarea = document.createElement('div')
  commarea.className = "commarea"

  commarea.appendChild(document.createElement('br'))
  //addcommloadB(commarea,no,board)

  let commtext = document.createElement('div')
  commtext.className = "commtext"
  commarea.appendChild(commtext)

  let comminput = document.createElement('input')
  comminput.type = "text"
  comminput.size = "15"
  comminput.maxlength = "80"
  comminput.placeholder = "댓글쓰기"

  comminput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      commsend.click()
    }
  })
  commarea.appendChild(comminput)

  let commsend = document.createElement('button')
  commsend.type = "button"
  commsend.className = 'commsendB'
  commsend.innerText = "등록"

  commsend.addEventListener('click', function(e){
    let text = comminput.value
    xmlcommsend(no,board,text,comminput)
  } )

  commarea.appendChild(commsend)

  addcommloadB(commarea,no,board)

  box.appendChild(commarea)
}

function xmlcommsend(no,board,text,comminput){
  var url = '/xmlcomm'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  xhr.addEventListener("load", function(event){
    let response = event.srcElement.responseText
    if( response == "noname"){alert("로그인 하세요!")}
    //if( response == "value1"){likeB.value="1"; likeB.innerText="추천함";}
    //if( response == "value0"){likeB.value="0"; likeB.innerText="추천";}
    if( response == "done" ){
      comminput.value=""
      comminput.parentElement.getElementsByClassName("commloadB")[0].click()
    }
  } )

  let token = getCookie('token')
  formData.append("id", no)
  formData.append("board", board)
  formData.append("token", token)
  formData.append("text", text)
  xhr.send(formData)
}









function addtagarea(box,no,board){
    let commarea = document.createElement('div')
    commarea.className = "tagarea"
    commarea.appendChild(document.createElement('br'))
    //addtagloadB(commarea,no,board)

    let commtext = document.createElement('div')
    commtext.className = "tagtext"
    commarea.appendChild(commtext)

    let comminput = document.createElement('input')
    comminput.type = "text"
    comminput.size = "15"
    comminput.maxlength = "80"
    comminput.placeholder = "태그추가"

    comminput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        commsend.click()
      }
    })
    commarea.appendChild(comminput)

    let commsend = document.createElement('button')
    commsend.type = "button"
    commsend.className = 'tagsendB'
    commsend.innerText = "등록"

    commsend.addEventListener('click', function(e){
      let text = comminput.value
      xmltagsend(no,board,text,comminput)
    } )

    commarea.appendChild(commsend)

    addtagloadB(commarea,no,board)

    box.appendChild(commarea)
  }
function xmltagsend(no,board,text,comminput){
    var url = '/xmltag'
    var xhr = new XMLHttpRequest()
    var formData = new FormData()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    xhr.addEventListener("load", function(event){
      let response = event.srcElement.responseText
      if( response == "noname"){alert("로그인 하세요!")}
      //if( response == "value1"){likeB.value="1"; likeB.innerText="추천함";}
      //if( response == "value0"){likeB.value="0"; likeB.innerText="추천";}
      if( response == "done" ){
        comminput.value=""
        comminput.parentElement.getElementsByClassName("tagloadB")[0].click()
      }
    } )

    let token = getCookie('token')
    formData.append("id", no)
    formData.append("board", board)
    formData.append("token", token)
    formData.append("text", text)
    xhr.send(formData)
  }




  function addtagloadB(box,no,board){
    let commloadB = document.createElement('button')
    commloadB.type = 'button'
    commloadB.className = 'tagloadB'
    commloadB.innerText = '로드'
    commloadB.no = no
    commloadB.board= board
    commloadB.value = 0

    //commloadB.id = "commloadB_"+no
    //commloadB.name = ""
    //commloadB.value = ""
    //commloadB.pressed = false
    commloadB.addEventListener('click', function(e){
      commloadB.value = 1
      fetchtagloadB(commloadB)} )
    box.appendChild(commloadB)
  }
  function fetchtagloadB(commloadB){
    let url = window.location.href.split(window.location.pathname)[0]
    //let fetchurl = url+'/fetchlogin'
    let fetchurl = '/fetchtagload'

    let id = commloadB.no
    let board = commloadB.board
    let token = getCookie('token')
    let params = { 'id': id, 'board': board,'token': token }
    fetch(fetchurl,
    {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(params), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then( response => response.json() )
    .then( function(myJson){
      let commarea = commloadB.parentElement
      let commtext = commarea.getElementsByClassName("tagtext")[0]
      commtext.innerHTML=""

      for( var idx of Object.keys(myJson) ){
        let d = myJson[idx]
        let li = document.createElement("li")
        li.idx = idx

        li.innerText = d["내용"] +' -'+d["유저"].slice(0,10)

        li.time = d["시간"]
        li.user = d["유저"]
        li.see = d["보기"]
        //these 3 are inner value.. may not seen..fine.

        let loginname = document.getElementById("username").value
        if(loginname == li.user || getCookie("userlevel")=="manager"){
        let delB = document.createElement("button")
        delB.innerText = "X"
        delB.addEventListener( "click", function(e){xmldeltag(board,id,li.idx,token, commloadB)}  )
        li.appendChild(delB)
        }

        commtext.appendChild(li)
      }
    })

  }

//moved to userfunc..

  // function xmldeltag(board,id,idx,token ,commloadB){
  //   if(confirm("삭제?")==false){return false}
  //   var url = '/xmldeltag'
  //   var xhr = new XMLHttpRequest()
  //   var formData = new FormData()
  //   xhr.open('POST', url, true)
  //   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  //
  //   xhr.addEventListener("load", function(event){
  //     let response = event.srcElement.responseText
  //     if( response == "noname"){alert("안된다")}
  //     if( response == "done" ){
  //       commloadB.click()
  //     }
  //   } )
  //
  //   formData.append("board", board)
  //   formData.append("id", id)
  //   formData.append("idx", idx)
  //   formData.append("token", token)
  //   xhr.send(formData)
  // }

  function eventDownloadzip(id, board){
    if(confirm("글의사본을다운로드?")==false){
      return false
    }
    var url = '/xmldownzip'
    var xhr = new XMLHttpRequest()
    var formData = new FormData()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    xhr.addEventListener("load", function(event){
      let response = event.srcElement.responseText
      let r = document.createElement("a")
        r.href = response
        r.target = "_blank"
        r.click()

    } )

    formData.append("board", board)
    formData.append("id", id)
    xhr.send(formData)
  }


  function eventDownload(id, board){
    if(confirm("다운로드 할까요?")==false){
      return false
    }

    let origin = "false"
    if(confirm("고화질원본으로 다운할까요?")==true){
      origin = "true"
    }

    var url = '/xmldownlist'
    var xhr = new XMLHttpRequest()
    var formData = new FormData()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')


    xhr.addEventListener("load", function(event){
      let response = event.srcElement.responseText
      let filelist = response.split(" ")
      downlist(id,board,origin, filelist)
    } )

    formData.append("board", board)
    formData.append("id", id)
    formData.append("origin", origin)
    xhr.send(formData)
  }

  function downlist(id,board,origin, filelist){
    let timey = 100
    for( var file of filelist){
      if (file==""){return false}
      let url = "/multidown?board="+board+"&id="+id+"&origin="+origin+"&file="+file

      let r = document.createElement("a")
      r.href=url

      setTimeout( function(){r.click()} ,timey)
      timey+=1100

      /*setTimeout( function(){
        //window.open( url )
        console.log(url)
      }, timey)
      timey+=2000*/
    }
  }
