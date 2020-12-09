//for make tag buttons..or block.
//once i try , to plane html, but too bad to see. use [].
// <button type="button" class="tagB" name="코토리">코토리</button>

//input tagList, makes tag buttons in parentElement.
/*
<div class="tagFrame" id="tagFrame">
  <div class="tagBox" id="characterTagbox">
*/

//taglist as list of tagtext. str input.





function fillTagframe(tagtext,tagFrame,tagclassName,state=1, tagNumber=0){
    let tagB = document.createElement('button')
    //console only works add atrr, tagB.setAttribute('nana',50)
    tagB.type = 'button' // if want submit, change. see mdn button
    tagB.className = tagclassName
    //tagB.id = 'tagB-' + tagtext for the policy. created, has no id. only html
    tagB.innerText = tagtext
    tagB.name = tagtext
    tagB.value = 0 //is css connected. whoa..
    tagB.maxValue = state
    //tagB.setAttribute("tagNumber",tagNumber) why this not?!
    tagB.tagNumber = tagNumber
    //tagB.bigguy = 0 cannot, since not offical attr.
    //tagB.setAttribute("isBigguy",0)

    if(tagNumber!=0){ //regard now it's usertag.
      tagB.innerText = tagtext+'('+tagNumber+')'
      //tagB.setAttribute("tagNumber",tagNumber)
      //if(tagNumber>=threhold){tagB.classList.add( bigTagname ) }
    }
    //tagB.pressed = false
    tagB.addEventListener('click',eventTagclick )

    tagFrame.appendChild(tagB)
}


//if( !(a in tagList) ){ tagList.push(a) }
//in init,   var tagSet= new Set([])


function eventTagclick(event){
  //global option var. of smallTagthre . get id, it's a button

  //event.currentTarget.setAttribute('pressed', 1) not working!
  //console.log(event.currentTarget.pressed)
  //event.currentTarget.value = (1-event.currentTarget.value)
  let name = event.currentTarget.name
  //let value = event.currentTarget.value
  let className = event.currentTarget.className
  let classList = event.currentTarget.classList
  //let isBigguy = event.currentTarget.isBigguy

  let maxValue = event.currentTarget.maxValue
  let value = parseInt( event.currentTarget.value ) +1
  if(value>maxValue){ value = 0 }
  event.currentTarget.value = value
  //console.log(value)

  //let pressed = event.currentTarget.pressed
  //location.search
  //if (location.hash.search('tag') )
  //location.hash += '%26'+value
  //console.log(tagSet)
  // now dual sorter!


  //if(className == 'tagB_character'){
  if(classList.contains('tagB_character')){
    //if(value == 1){tagSet_strong.add(name)}
    //else if(value == 0){tagSet.delete(name)}
    if(value == 1){tagSet.add(name)}
    //else if(value == 2){tagSet.delete(name); tagSet_strong.add(name);}
    //else if(value == 0){tagSet_strong.delete(name)}

    else if(value == 0){tagSet.delete(name)}
  }

  //else if(className == 'tagB_user'){
  else if(classList.contains('tagB_user')){
    if(classList.contains('bigguy')){
      if(value == 1){tagSet_big.add(name)}
      else if(value == 2){tagSet_big.delete(name); tagSet_exclusive.add(name);}
      else if(value == 0){tagSet_exclusive.delete(name)}
    }
    else{
      if(value == 1){tagSet_user.add(name)}
      else if(value == 2){tagSet_user.delete(name); tagSet_exclusive.add(name);}
      else if(value == 0){tagSet_exclusive.delete(name)}
    }
  }

  /*if(maxValue == 1){
    if(value == 1){tagSet.add(name)}
    else if(value == 0){tagSet.delete(name)}
  }

  else if(maxValue == 2){
    if(value == 1){tagSet_user.add(name)}
    else if(value == 2){tagSet_user.delete(name); tagSet_exclusive.add(name);}
    else if(value == 0){tagSet_exclusive.delete(name)}
  }*/
  //------------ set done. it has tagset. globally..


  trueBanner()
  //noList = tagsetSort()
  //nolist shall remain fulllist, possiblely..
  viewList = tagsetSort()
  fillNewlist(viewList)
}


function tagsetSort(){
  //userTagdict as global dict. ilnke datas.
   queryList = Array.from(tagSet.values())// A ^ B
   queryList_user = Array.from(tagSet_user.values())//A U B
   queryList_exclusive = Array.from(tagSet_exclusive.values())// exclude
   queryList_big = Array.from(tagSet_big.values()) //for A ^ (B=user AUB)

  let allList = Object.keys(datas)

  if(tagSet_strong.size!=0){  queryList = Array.from(tagSet_strong.values()) }


  /*if(queryList.length == 0){
     if(queryList_user.length == 0){
       if(queryList_exclusive.length == 0){viewList = allList}
     }
  }
  */
  //seems it's old, ..but why this IS? is it init?
  //nolist shall be always full length.. it's actually reset code.
  //i think it can be placed tagreset.. but here fine.
  //--i tinkt it's insure if no query, , but usless for below.

  //console.log(queryList_user)

  let unionList = allList
  if(queryList_user.length != 0){unionList = unionU(userTagdict,queryList_user)}
  let interList = tagQueryInter(fluid,unionList,queryList)// inter 1st.character.
  if(queryList_big.length != 0){interList = intersectSlit(interList, userTagdict,queryList_big)}//if online
  if(queryList_exclusive.length != 0){interList = exclusiveSlit(interList, userTagdict, queryList_exclusive)}
  return interList
}


  /*
  let unionList = []

  if(){
    unionList = allList
    let interList = tagQueryInter(datas,unionList,queryList)// inter 1st.character.
    return interList
  }
  else{
    if(queryList_user.length != 0){unionList = unionU(userTagdict,queryList_user)}//if online
    let interList = tagQueryInter(datas,unionList,queryList)// inter 1st.character.
    if(queryList_big.length != 0){interList = intersectSlit(interList, userTagdict,queryList_big)}//if online
    if(queryList_exclusive.length != 0){exList = exclusiveSlit(interList, userTagdict, queryList_exclusive)}
    return exList
  //return tagQueryEx(datas,interList,queryList_exclusive)// is also from fluids..
  }
  */


function arraysEqual(a, b) {
  //https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function trueBanner(){
  let boxColor = setColor()
  if(tagSet_strong.size !=0){
    document.getElementsByClassName("bannerImg")[0].src = "./static/resource/banner/truebanner/"+boxColor+".jpg"
  }
  else{
    document.getElementsByClassName("bannerImg")[0].src = "./static/resource/banner/"+boxColor+".jpg"
  }
  document.getElementsByClassName("bannerImg")[0].alt = boxColor
}

function loadBanner(){
  let boxColor = setColor()
  document.getElementsByClassName("bannerImg")[0].src = "./static/resource/banner/"+boxColor+".jpg"
  document.getElementsByClassName("bannerImg")[0].alt = boxColor
}

function setColor(){
  let 에리="에리"
  let 노조미="노조미"
  let 우미="우미"
  let 니코="니코"
  let 마키="마키"
  let 호노카="호노카"
  let 코토리="코토리"
  let 하나요="하나요"
  let 린="린"

  let chardict = {
    "뮤즈":[코토리,우미,호노카,마키,린,하나요,노조미,에리,니코],

    "에리" :[에리],
    "노조미":[노조미],
    "우미" :[우미],
    "니코" :[니코],
    "마키" :[마키],
    "호노카":[호노카],
    "코토리":[코토리],
    "하나요":[하나요],
    "린":[린],

    "1학년":[린,하나요,마키],
    "2학년":[우미,코토리,호노카],
    "3학년":[노조미,에리,니코],

    "비비":[니코,마키,에리],
    "릴화":[노조미,우미,린],
    "쁘랭땅":[코토리,호노카,하나요],

    "노조에리":[노조미,에리],
    "니코마키":[니코,마키],
    "린파나":[린,하나요],
    "코토우미":[코토리,우미],

    "니코린파나":[니코,린,하나요],
    "린마키":[린,마키],
    "에리우미":[에리,우미],
    "코토파나":[코토리,하나요],
    "노조니코":[노조미,니코],

    "호노린":[호노카,린],
    "솔겜조":[에리,우미,마키],

  }

  let strongs = Array.from(tagSet_strong.values()).sort()
  let weaks = Array.from(tagSet.values()).sort()
  if(strongs.length!=0){a = strongs}
  else{a = weaks}


  for(var charset in chardict){
    if( arraysEqual(a, chardict[charset].sort())==true ){
      return charset
    }
  }
}





  //tagB.name = tagtext//for submit. name=value...for button as also submit
