
function fillTagframe(tagFrame, tagtext,tagNumber=0, tagclassList, shownumber=true ){
    let tagB = document.createElement('button')
    tagB.type = 'button'
    tagB.name = tagtext
    tagB.tagN = tagNumber

    let taginnertext = tagtext
    // if( taginnertext.indexOf("작가:") != -1){ taginnertext = taginnertext.split("작가:")[1] }
    if(shownumber){tagB.innerText = taginnertext+'('+tagNumber+')'}
    else{tagB.innerText = taginnertext}


    for( var className of tagclassList){
      tagB.classList.add(className)
    }

    tagB.addEventListener('click',eventTagclick )
    tagFrame.appendChild(tagB)
}


function eventTagclick(event){
  let name = event.currentTarget.name
  let classList = event.currentTarget.classList

  //big:  "" , "inter", "exclude"
  if(classList.contains('tagB_big')){

    if(classList.contains('tagB_inter')){
      classList.remove("tagB_inter")
      classList.add("tagB_exclude")
    }
    else if(classList.contains('tagB_exclude')){
      classList.remove("tagB_exclude")
    }
    else if(!classList.contains('tagB_inter') && !classList.contains('tagB_exclude') ){
      classList.add("tagB_inter")
    }

  }
  //normal:  "" , "union", "exclude"
  else{

    if(classList.contains('tagB_union')){
      classList.remove("tagB_union")
      classList.add("tagB_exclude")
    }
    else if(classList.contains('tagB_exclude')){
      classList.remove("tagB_exclude")
    }
    else if(!classList.contains('tagB_union') && !classList.contains('tagB_exclude') ){
      classList.add("tagB_union")
    }

  }

  tagBshow()
}

function tagBshow(){
  let inter_Set = new Set([])
  let union_Set = new Set([])
  let exclude_Set = new Set([])

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

  for(var button of inter_List){ inter_Set.add(button.name)}
  for(var button of union_List){ union_Set.add(button.name)}
  for(var button of exclude_List){ exclude_Set.add(button.name)}

  console.log("-----")
  console.log(inter_Set)
  console.log(union_Set)
  console.log(exclude_Set)

  setBanner(inter_Set)
  viewList = tagsetSort(inter_Set, union_Set, exclude_Set)
  fillNewlist(viewList)
  setviewListN()
}




function issameset(set1,set2){
  let intersection = new Set(  [...set1].filter( x => set2.has(x) )  )
  if(set1.size == intersection.size && set2.size == intersection.size && set1.size == set2.size){return true}
  else{return false}
}


function tagsetSort(inter_Set, union_Set, exclude_Set){
  var allset = new Set( Object.keys(datas) )
  var set1 = new Set( Object.keys(datas) )

  if(inter_Set.size == 0){set1 = new Set() }

  for( var name of inter_Set){
  var set2 = new Set(tagDict[name])
  set1 = interout(set1,set2)
  }

  for( var name of union_Set){
    var set2 = new Set(tagDict[name])
    set1 = unionout(set1,set2)
  }

  //this caused only exclude to all.
  if(inter_Set.size==0 && union_Set.size ==0 ){
    set1 = allset
  }

  for( var name of exclude_Set){
    var set2 = new Set(tagDict[name])
    set1 = differout(set1,set2)
  }


  return Array.from(set1)
}

function interout(set1,set2){
  return new Set(  [...set1].filter( x => set2.has(x) )  )
}
function unionout(set1,set2){
  for( var v of set2){set1.add(v)}
  return set1
}
function differout(set1,set2){
  return new Set([...set1].filter(x => !set2.has(x)))
}

//need: only unit, not char. but scan char also. not only units.
function setBanner(inter_Set){
  let thisunit = "default"

  for(var key of Object.keys(unitDict)){
    let unit = unitDict[key]
    if(issameset(inter_Set,unit)==true){ thisunit = key }
  }

  var boardname = getParameterByName('board')
  document.getElementsByClassName("bannerImg")[0].src = "/static/banner/board/unit.png".replace('unit',thisunit).replace('board',boardname)
  document.getElementsByClassName("bannerImg")[0].alt = thisunit
}

function setColor(){
  let inter_Set = new Set([])
  let inter_Class = document.getElementsByClassName("tagB_inter")
  for(var button of inter_Class){ inter_Set.add(button.name)}

  let thisunit = "default"//better, default.

  for(var key of Object.keys(unitDict)){
    let unit = unitDict[key]
    if(issameset(inter_Set,unit)==true){ thisunit = key }
  }
  return thisunit
}
