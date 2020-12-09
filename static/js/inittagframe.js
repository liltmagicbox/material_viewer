var tagSet= new Set([])
var tagSet_user= new Set([])
var tagSet_exclusive= new Set([])
var tagSet_big= new Set([])
var tagSet_strong= new Set([])

function initTagframe(){

  let ch_tagBox = document.getElementById('characterTagbox')
  let ch_className = 'tagB_character'
  let ch_Taglist = ['마키', '린', '하나요', '호노카', '코토리', '우미', '니코', '에리', '노조미']
  for( var tagtext of ch_Taglist){
    fillTagframe(tagtext,ch_tagBox,ch_className,state=1)
  }

  /*
  moodTagbox = document.getElementById('moodTagbox')
  moodclassname = "tagB_mood"
  moodTaglist = ['일상', '먹는다', '여행', '훈훈함', '모후모후', '엄격', '시리어스', '호러', '개그']
  for ( tagtext of moodTaglist){
  fillTagframe(tagtext,moodTagbox,moodclassname)
  }
  */


  let userTagbox = document.getElementById('userTagbox')
  makeTagopenB(userTagbox)





  makeResetB(userTagbox)

}

function makeTagopenB(tagFrame){
  let tagB = document.createElement('button')
  tagB.type = 'button' // if want submit, change. see mdn button
  tagB.className = 'tagOpenB'
  tagB.innerText = '추가 태그 로드'
  tagB.setAttribute('value','0')
  tagB.addEventListener('click',tagOpen )
  tagFrame.appendChild(tagB)
}

function tagOpen(){
  let userTagbox = document.getElementById('userTagbox')
  if(event.currentTarget.value ==0){loadUsertag(userTagbox)}//it draws gloval id. not intended!
  event.currentTarget.value =1
  //event.currentTarget.innerText = '모두의태그'
}


function loadUsertag(userTagbox){
  userTagbox.innerHTML =""
  userTagbox.innerText = '모두의 태그 : '
  let userclassname = 'tagB_user'
  //let bigTagname='tagB_big'
  //let userTaglist = ['안된다' ,'뭐?','뭐가','허허허', '아니','이양반아']
  // fetch,always.
  //no, load and add datas
  //and parse datas, get tagsortlist.fine.
  userTagdict = {'안된다':['9441582','9554060'] ,'뭐?':['9446903','9922107','10399976'],'뭐가':['9448768'],'허허허':['9448884'], '아니':['9449095'],'이양반아':['9449215']}
  for( var key in userTagdict){
    fillTagframe(key ,userTagbox,userclassname,state=2, tagNumber=userTagdict[key].length)
  }
  makeResetB(userTagbox)
  makebigThrebar(userTagbox)
}

function makeResetB(tagFrame){
  let tagB = document.createElement('button')
  tagB.type = 'button' // if want submit, change. see mdn button
  tagB.className = 'tagResetB'
  tagB.innerText = '리셋'
  tagB.addEventListener('click',tagReset )
  tagFrame.appendChild(tagB)
}
function tagReset(){
  let tagclassNameList = ["tagB_character",'tagB_user']
  for( var tagclassName of tagclassNameList){
    let tagclassList = document.getElementsByClassName(tagclassName)
    for( var tagB of tagclassList){ tagB.value = 0 }
  }
  tagSet = new Set([])
  tagSet_user = new Set([])
  tagSet_exclusive = new Set([])
  tagSet_big= new Set([])
  tagSet_strong= new Set([])

  trueBanner()

  //resetBigguy()//no other way.. not by input,change. inf.loop warn.
  viewList = Object.keys(datas)
  fillNewlist(viewList)
}



function makebigThrebar(tagFrame){
  let tagB = document.createElement('input')
  tagB.type = 'range'
  tagB.className = 'bigThrebar'
  tagB.id = 'bigThrebar'
  tagB.min = "0"
  tagB.max = "20"
  tagB.setAttribute('value',10)
  //value jnot working
  //tagB.oninput = 'getNewbigguy(this.value)'
  tagB.addEventListener('input', getNewtext )
  tagB.addEventListener('change', tagReset )// simple.! could be click()..


  let partisan = document.createElement('div')
  partisan.style.float = "right"
  let valval = document.createElement('span')
  valval.id = 'bigThretext'
  valval.innerHTML = tagB.value

  //partisan.appendChild(document.createElement('span').innerText='|')
  partisan.appendChild(tagB)
  partisan.appendChild(valval)
  tagFrame.appendChild(partisan)

}

/*
function resetBigguy(){//as reset..failed. for reset, simply, click.
  document.getElementById('bigThrebar').value = 10
  document.getElementById('bigThretext').innerHTML =10
  //setBigguy( parseInt(event.currentTarget.value) )
  setBigguy()
}*/

function getNewtext(){//as reset..failed. for reset, simply, click.
  tex = document.getElementById('bigThretext')
  tex.innerHTML = event.currentTarget.value
  //setBigguy( parseInt(event.currentTarget.value) )
  setBigguy()
}

function setBigguy(){
  let bigguyval = document.getElementById('bigThrebar').value
  let tagB_userList = document.getElementsByClassName("tagB_user")
  //console.log(tagclassList);
  for( var butt of tagB_userList){
    //console.log(butt.getAttribute(tagNumber))
    if( butt.tagNumber >= bigguyval ){butt.classList.add('bigguy')}
    else{ butt.className = "tagB_user" }
    //console.log(butt.tagNumber)
  }
}




function setTagvalue(){
  //from hash.. parse after..

  let tagList = []
  let tagListuser = []
  let tagListEX = []
  var tagSet= new Set([])
  var tagSet_user= new Set([])
  var tagSet_exclusive = new Set([])
  for(var tag of tagList){tagSet.add(tag)}
  for(var tag of tagListuser){tagSet_user.add(tag)}
  for(var tag of tagListEX){tagSet_exclusive.add(tag)}

  let queryList = Array.from(tagSet.values())
  let queryList_user = Array.from(tagSet_user.values())
  let queryList_exclusive = Array.from(tagSet_exclusive.values())

  let tagB_character = document.getElementsByClass("tagB_character")
  for( var tagB of tagB_character){
    if( queryList.includes(tagB.name) ){ tagB.value = 1 }
  }
  let tagB_user = document.getElementsByClass("tagB_user")
  for( var tagB of tagB_user){
    if( queryList_user.includes(tagB.name) ){ tagB.value = 1 }
    if( queryList_exclusive.includes(tagB.name) ){ tagB.value = 2 }
  }

}
