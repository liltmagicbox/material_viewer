function initColB(){
  let sortFrame = 'sortFrame'
  frame = document.getElementById(sortFrame)

  //frame.appendChild(document.createElement('br'))

  let btext = document.createElement('span')
  //btext.innerText=" 줄:"
  //frame.appendChild(btext)

  let colNumber = document.createElement('input')
  colNumber.type = "number"
  colNumber.id = "colNumber"//it should remained, by this is global one.
  colNumber.className = "colNumber"
  colNumber.name = "colNumber"
  colNumber.value = 2
  colNumber.style.display ="None"
  frame.appendChild(colNumber)

  let colMinus = document.createElement('button')
  colMinus.type = "button"
  colMinus.className = 'colB'
  //colMinus.id = "colMinus"// the policy
  colMinus.name = "colMinus"
  colMinus.value = -1
  colMinus.innerText = '+'//whats funny..
  colMinus.addEventListener('click', addColnumber)
  frame.appendChild(colMinus)

  let colPlus = document.createElement('button')
  colPlus.type = "button"
  colPlus.className = 'colB'
  //colPlus.id = "colPlus"
  colPlus.name = "colPlus"
  colPlus.value = 1
  colPlus.innerText = '-'
  colPlus.addEventListener('click', addColnumber)
  frame.appendChild(colPlus)

}

function getColnum(){
  let colNumber = document.getElementById('colNumber')
  return parseInt(colNumber.value)
}

function addColnumber(){
  let val = parseInt(event.currentTarget.value)

  let colNumber = document.getElementById('colNumber')
  colNumber.value = parseInt(colNumber.value)+val
  if(colNumber.value>6){colNumber.value=6}
  else if (colNumber.value<1) {colNumber.value=1}

  let outFrame = getImgframe()
  setupCol(outFrame, parseInt(colNumber.value) )
  fillImgcol(viewList,outFrame,1)
  //initImgcol(colNumber.value)
}




function initSortB(){
  let sortFrame = "sortFrame"
  let sortbList = ['랜덤',
  '날짜',
  '제목',
  '조회',
  '추천',
  '댓글',
  '길게']
  frame = document.getElementById(sortFrame)

  for(var sorttext of sortbList){
    let sortB = document.createElement('button')
    sortB.type = "button"
    sortB.className = 'sortB'
    //sortB.id = sorttext //seems too brute.. and same as name.
    sortB.name = sorttext
    sortB.value = 0
    //sortB.pressed = false //not seen,works fine.
    //sortB.setAttribute('pressed',false)
    sortB.innerText = sorttext

    if (sorttext == "랜덤"){
      sortB.className = 'randSortB'
      sortB.addEventListener('click', sortRand)
    }
    if (sorttext == "날짜"){ sortB.addEventListener('click', sortDate) }
    else if (sorttext == "제목"){ sortB.addEventListener('click', sortTitle) }

    else if (sorttext == "조회"){ sortB.addEventListener('click', sortview) }
    else if (sorttext == "추천"){ sortB.addEventListener('click', sortrecom) }
    else if (sorttext == "댓글"){ sortB.addEventListener('click', sortcomment) }

    else if (sorttext == "길게"){
      sortB.className = "thumbONB"
      sortB.addEventListener('click', thumbON)
    }

    frame.appendChild(sortB)
  }
}


function sortBReset(){
  let tagclassList = document.getElementsByClassName('sortB')
  for(var tagB of tagclassList){
    tagB.value = 0
    if (tagB.innerText.includes("날짜") ){ tagB.innerText = "날짜" }
    else if (tagB.innerText.includes("최신") ){ tagB.innerText = "날짜" }
    else if (tagB.innerText.includes("과거") ){ tagB.innerText = "날짜" }

    else if (tagB.innerText.includes("제목") ){ tagB.innerText = "제목" }

    else if (tagB.innerText.includes("조회") ){ tagB.innerText = "조회" }
    else if (tagB.innerText.includes("추천") ){ tagB.innerText = "추천" }
    else if (tagB.innerText.includes("댓글") ){ tagB.innerText = "댓글" }

  }
}


function sortRand(){
  //event.currentTarget.value = (1-event.currentTarget.value)
  sortBReset()
  viewList = sortNolist(datas,viewList,'random')
  fillNewlist(viewList)
}


function sortDate(){
  //event.currentTarget.value = (1-event.currentTarget.value)
  let value = parseInt( event.currentTarget.value ) +1
  if(value>2){ value = 1 }
  event.currentTarget.value = value

  if (event.currentTarget.value==1) {
    viewList = sortNolist(datas,viewList,'new')
    event.currentTarget.innerText = "최신"
  }
  else{
    viewList = sortNolist(datas,viewList,'old')
    event.currentTarget.innerText = "과거"
  }

  fillNewlist(viewList)
}
function sortTitle(){
  let value = parseInt( event.currentTarget.value ) +1
  if(value>2){ value = 1 }
  event.currentTarget.value = value

  if (event.currentTarget.value==1) {
    viewList = sortNolist(datas,viewList,'atoz')
    //event.currentTarget.innerText = event.currentTarget.innerText.slice(0,-1)+"+"
  }
  else{
    viewList = sortNolist(datas,viewList,'ztoa')
    //event.currentTarget.innerText = event.currentTarget.innerText.slice(0,-1)+"-"
  }
  fillNewlist(viewList)
}

function get_sortlist(target){
  var url = '/getsortlist'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  xhr.addEventListener("load", function(event){
    let response = event.srcElement.responseText
    resList = JSON.parse(response)
    if(target=="view"){sortviewList=resList}
    else if(target=="recom"){sortrecomList=resList}
    else if(target=="comment"){sortcommentList=resList}

  } )

  let board = getParameterByName('board')
  formData.append("target", target)
  formData.append("board", board)
  xhr.send(formData)
}

sortviewList = []
sortrecomList = []
sortcommentList = []

function sortview(){
  if(sortviewList.length==0){get_sortlist('view')
  return 1  }

  let value = parseInt( event.currentTarget.value ) +1
  if(value>2){ value = 1 }
  event.currentTarget.value = value

  viewList = JSON.parse(JSON.stringify(sortviewList))
  if (event.currentTarget.value==1) {1}
  else{ viewList.reverse() }
  fillNewlist(viewList)
}
function sortrecom(){
  if(sortrecomList.length==0){get_sortlist('recom')
    return 1  }

  let value = parseInt( event.currentTarget.value ) +1
  if(value>2){ value = 1 }
  event.currentTarget.value = value

  viewList = JSON.parse(JSON.stringify(sortrecomList))
  if (event.currentTarget.value==1) {1}
  else{ viewList.reverse()}
  fillNewlist(viewList)
}
function sortcomment(){
  if(sortcommentList.length==0){get_sortlist('comment')
    return 1  }

  let value = parseInt( event.currentTarget.value ) +1
  if(value>2){ value = 1 }
  event.currentTarget.value = value

  viewList = JSON.parse(JSON.stringify(sortcommentList))
  if (event.currentTarget.value==1) { 1 }
  else{ viewList.reverse() }
  fillNewlist(viewList)
}



function thumbON(){
  event.currentTarget.value = (1-event.currentTarget.value)
  if (event.currentTarget.value==1) {
    //event.currentTarget.innerText = event.currentTarget.innerText.slice(0,-1)+"+"
    event.currentTarget.innerText = "짧게"
  }
  else{
    //event.currentTarget.innerText = event.currentTarget.innerText.slice(0,-1)+"-"
    event.currentTarget.innerText = "길게"
  }

  fillNewlist(viewList)
}

/*
function sortFrame(sortKey){
  //console.log(event)
  console.log(sortKey)
  noList = sortNolist(datas,noList,sortKey)
  outFrame = document.getElementById('imgFrame')
  outFrame.innerHTML = ""
  fillImgframe(noList,outFrame,1)
  }
  */
