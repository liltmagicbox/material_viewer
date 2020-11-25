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
  let thumbPath = './static/resized/'+no+'/'+datas[no]['리사이즈'][0]
  if(miniLoad==1){ thumbPath = './static/thumb/'+no+'/'+no+'_1.jpg' }
  let titleText = datas[no]['제목']
  let dateText = datas[no]['날짜']
  let imgNumber = datas[no]['리사이즈'].length

  let box = document.createElement('div')
  box.className = 'imgBox'
  box.id = "imgBox_"+no
  box.no = no
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
  bodyB.no = no
  //bodyB.name = ""
  //bodyB.value = ""
  //bodyB.pressed = false
  bodyB.addEventListener('click',eventBodyload )
  box.appendChild(bodyB)

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
  let no= preimg.parentElement.id.split('_')[1]

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
  let resizePath = './static/resized/'+no+'/'
  //let partList = imlist.slice(1)
  for( var filename of imlist){
    let im = document.createElement('img')
    im.src = resizePath+filename
    innerviewer.appendChild(im)
  }
  let bodyText = document.createElement('pre')

  let params = { 'no': no, 'key':'본문',}
  var esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

  //let url = window.location.href.replace( window.location.pathname , '')
  let url = window.location.href.split(window.location.pathname)[0]
  let fetchurl = url+'/fetch?'+query

  fetch(fetchurl)
  .then( function(response){return response.json()})
  .then(function(myJson){
    let rawText = myJson['bodytext']
    let urls = rawText.match(/\bhttps?:\/\/\S+/gi)
    //console.log(urls.length)
    if(urls!=null){
      for( var u of urls){
        //linkalt = u.slice(u.indexOf('//')+2,25)+'...'
        let linkalt = '링크'
        bodyText.innerHTML += linkalt.link(u)+'\n'
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

function overoff(){
  document.body.classList.remove("stop_scroll")
  document.getElementById('overviewer').remove()
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
  let no = event.currentTarget.no
  //let box = document.getElementById("imgBox_"+no)
  let box = event.currentTarget.parentElement
  //let imArea = document.getElementById("imgArea_"+no)
  //let imArea = box.firstElementChild

  box.getElementsByClassName("imgTitle")[0].setAttribute("shrink",0)


  let imgArea = box.getElementsByClassName('imgArea')[0]

  let imlist = datas[no]['리사이즈']
  let resizePath = './static/resized/'+no+'/'
  //imlist.shift()//for 1 already..

  imgArea.innerHTML = "" // ONLY mobile n>1 requires thumbnail, fullchange.
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


  let bodyText = document.createElement('pre')
  //bodyText.width = imgArea.clientWidth
  //box.appendChild(bodyText) why you here?!

  //make query string. flask gets and returns no,key mini datas.
  let params = { 'no': no, 'key':'본문',}
  var esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
  //"parameter1=value_1&parameter2=value%202&parameter3=value%263"

  //http://liltbox.iptime.org:25252/fetch/bodytext/10399976
  //let url = window.location.href.replace( window.location.pathname , '')
  let url = window.location.href.split(window.location.pathname)[0]
  let fetchurl = url+'/fetch?'+query
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





    //url parse and get link. notice that full url text will  go thorugh img box..
    let urls = rawText.match(/\bhttps?:\/\/\S+/gi)

    //console.log(urls.length)
    if(urls!=null){
      for( var u of urls){
        //linkalt = u.slice(u.indexOf('//')+2,25)+'...'
        let linkalt = '링크'
        bodyText.innerHTML += linkalt.link(u)+'\n'
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



    //bodyText.innerText += myJson['bodytext']
    //bodyText.style.display = 'inline' text over, width change case.
    box.appendChild(bodyText)







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


}

function scrollup(){
  window.scroll(0, scrollYbeforeloadbody )
}
