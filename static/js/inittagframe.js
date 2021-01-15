var tagSet= new Set([])
var tagSet_user= new Set([])
var tagSet_exclusive= new Set([])
var tagSet_big= new Set([])
var tagSet_strong= new Set([])

function initTagframe(){
  let userTagbox = document.getElementById('userTagbox')
  makeTagopenB(userTagbox)
}



function makeTagopenB(tagFrame){
  let tagB = document.createElement('button')
  tagB.type = 'button' // if want submit, change. see mdn button
  tagB.className = 'tagOpenB'
  tagB.innerText = '태그 로드'
  tagB.setAttribute('value','0')
  tagB.addEventListener('click', function(){tagOpen(tagFrame)} )
  tagFrame.appendChild(tagB)
}

function tagOpen(tagFrame){
  let params = { 'board': board }
  let fetchurl = '/fetchtaglist'
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
    tagDict = myJson
    loadUsertag(tagFrame,myJson)
  })
}

function loadUsertag(tagFrame,pre_userTagdict){

  let userTagdict = {}
  Object.keys(pre_userTagdict).sort( function(a,b){
    return (pre_userTagdict[a].length<pre_userTagdict[b].length)*2-1
  }).forEach(function(key){
    userTagdict[key]=pre_userTagdict[key]
  })
  console.log(userTagdict)
  tagFrame.innerHTML =""

  //global var characterList by html maker... also unitList
  for( var text in userTagdict){
    tagclassList = ['tagB',"tagB_big","tagB_character"]
    if(characterList.includes(text)){
      /*fillTagframe(tagFrame, text, tagNumber=userTagdict[text].length, tagclassList)*/
      fillTagframe(tagFrame, text, tagNumber=userTagdict[text].length, tagclassList, shownumber=false)
    }
  }
  tagFrame.appendChild(document.createElement('br'))
  for( var text in userTagdict){
    if(unitList.includes(text) && !characterList.includes(text) ){
      /*tagclassList = ['tagB',"tagB_big","tagB_unit"]*/
      tagclassList = ['tagB',"tagB_unit"]
      fillTagframe(tagFrame, text, tagNumber=userTagdict[text].length, tagclassList)
    }
  }
  tagFrame.appendChild(document.createElement('br'))
  for( var text in userTagdict){
    if(artistList.includes(text)){
      /*tagclassList = ['tagB',"tagB_big","tagB_artist"]*/
      tagclassList = ['tagB',"tagB_artist"]
      fillTagframe(tagFrame, text, tagNumber=userTagdict[text].length, tagclassList)
    }
  }
  tagFrame.appendChild(document.createElement('br'))

  for( var text in userTagdict){
    if(!characterList.includes(text) && !unitList.includes(text) && !artistList.includes(text) ){
      tagclassList = ['tagB']
      fillTagframe(tagFrame, text, tagNumber=userTagdict[text].length, tagclassList)
    }
  }
  tagFrame.appendChild(document.createElement('br'))

  let utildiv = document.createElement('div')
  makeviewListN(utildiv)
  makeResetB(utildiv)
  makebigThrebar(utildiv)
  maketagshowbar(utildiv)
  tagFrame.appendChild(utildiv)
}


function makeResetB(tagFrame){
  let tagB = document.createElement('button')
  tagB.type = 'button' // if want submit, change. see mdn button
  tagB.className = 'tagResetB'
  tagB.innerText = '리셋'
  tagB.addEventListener('click',tagBReset )
  tagFrame.appendChild(tagB)
}

function tagBReset(){
  let inter_Class = document.getElementsByClassName("tagB_inter")
  let union_Class = document.getElementsByClassName("tagB_union")
  let exclude_Class = document.getElementsByClassName("tagB_exclude")

  //for list change problem
  let inter_List=[]
  let union_List=[]
  let exclude_List=[]
  for(var button of inter_Class){ inter_List.push(button) }
  for(var button of union_Class){ union_List.push(button) }
  for(var button of exclude_Class){ exclude_List.push(button) }

  for(var button of inter_List){ button.classList.remove("tagB_inter")}
  for(var button of union_List){ button.classList.remove("tagB_union")}
  for(var button of exclude_List){ button.classList.remove("tagB_exclude")}
  tagBshow()
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
  tagB.addEventListener('change', tagBReset )// simple.! could be click()..


  let partisan = document.createElement('div')
  partisan.style.float = "right"
  //partisan.style.display = "none"/*not use it.. just 10.*/
  let valval = document.createElement('span')
  valval.id = 'bigThretext'
  valval.innerHTML = tagB.value

  //partisan.appendChild(document.createElement('span').innerText='|')
  partisan.appendChild(tagB)
  partisan.appendChild(valval)
  tagFrame.appendChild(partisan)

}



function maketagshowbar(tagFrame){
  var lala = document.getElementsByClassName('tagB').length
  var csl = document.getElementsByClassName('tagB_character').length

  let tagB = document.createElement('input')
  tagB.type = 'range'
  tagB.className = 'tagshowbar'
  tagB.id = 'tagshowbar'
  tagB.min = "0"
  tagB.max = lala-csl
  tagB.setAttribute('value',15)
  //value jnot working
  //tagB.oninput = 'getNewbigguy(this.value)'
  tagB.addEventListener('input', gettagshowtext )
  tagB.addEventListener('change', tagBReset )// simple.! could be click()..


  let partisan = document.createElement('div')
  partisan.style.float = "right"
  let valval = document.createElement('span')
  valval.id = 'tagshowtext'
  valval.innerHTML = tagB.value

  //partisan.appendChild(document.createElement('span').innerText='|')
  partisan.appendChild(tagB)
  partisan.appendChild(valval)
  tagFrame.appendChild(partisan)

}
function gettagshowtext(){
  var tex = document.getElementById('tagshowtext')
  var shownumber = event.currentTarget.value
  tex.innerHTML = shownumber

  var bs = document.getElementsByClassName('tagB')
  var shown = 0
  for(b of bs){
    if(! b.classList.value.includes('tagB_character')){
      if(shown<shownumber){b.hidden = false; shown+=1;}
      else{b.hidden = true}
    }

  }
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
  let tagB_class = document.getElementsByClassName("tagB")
  let tagB_List=[]
  for(var button of tagB_class){ tagB_List.push(button) }

  for( var butt of tagB_List){
    let classList = butt.classList
    if(!classList.contains("tagB_character")){
      if( butt.tagN >= bigguyval ){butt.classList.add('tagB_big')}
      else{butt.classList.remove('tagB_big')}
    }
  }
}


function makeviewListN(tagFrame){
  let viewListN = document.createElement('span')
  viewListN.className = 'viewListN'
  viewListN.id = 'viewListN'
  viewListN.innerText = viewList.length
  tagFrame.appendChild(viewListN)
}
function setviewListN(){
  let viewListN = document.getElementById('viewListN')
  viewListN.innerText = viewList.length
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
