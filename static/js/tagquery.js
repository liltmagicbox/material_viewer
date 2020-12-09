function unionU(tagdict,queryList){
  let tagList=[]
  for ( var query of queryList){
    tagList = tagList.concat( tagdict[query] )
  }
  return tagList//[] if no union.fine.
}



function intersectSlit(targetList, userTagdict, queryList){
  for(var  query of queryList){
    let tagList=[]
    for(var no of userTagdict[query]){
      no =String(no)
      if(targetList.includes( no ) ){ tagList.push(no) }
    }
    targetList = tagList// finally..
  }
  return targetList//return no if no hit.fine. ,,,but query=[], ?
}


function exclusiveSlit(targetList, userTagdict, queryList){
  let exList = []
  let tmpList = targetList
  //includes: list, elemnt, str, ' '.
  for ( var query of queryList) {
    for(var no of userTagdict[query] ){
      no=String(no)//AH!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! input dict only "133935"
      if( targetList.includes( no ) ){ exList.push( no )}
    }
  }

  //we got exclude list.. from querylist.
  let tagList = []
  for(var no of tmpList){
    no=String(no)
    if( !exList.includes(no) ){tagList.push(no)}
  }

  return tagList//get fullbody if no query.fine.
}


// when has datas, input nolist, quert hits, outputs.fineway.
function tagQueryInter(datas,noList,queryList ){
  "intersection. up is union."
  "from nolist, remove if not."

  let tagList = noList
  let tmpList = []
  //includes: list, elemnt, str, ' '.

  for ( var query of queryList){
    for ( key of tagList) {
      if( fluid[key] !=undefined){
        if( datas[key]['캐릭터태그'].includes(query) ){
          if( !tmpList.includes(key) ){ tmpList.push( key )
          }
        }
      }
    }
    tagList = tmpList
    tmpList = []
  }

  return tagList
}



//------------below not used

function tagQuery(datas,noList,queryList ){
  "query as list. ['호노카','코토리']  sort if hits, outputs noList.fine."

  let tagList=[]
    //includes: list, elemnt, str, ' '.
  for ( var query of queryList){
    for ( var key of noList) {
      let usertagList=[]
      let usertag = datas[key]['유저태그']
      for( var k of Object.keys( usertag )){ usertagList = usertagList.concat( usertag[k] ) }
      //anyway get every user's TAG LIST OF THIS KEY.
      if( usertagList.includes(query) ){
        if( !tagList.includes(key) ){tagList.push( key )
        }
      }
    }
  }

  return tagList
}



function tagQueryEx(datas,noList,queryList ){
  "exclusive.  remove ."

  let tagList = noList
  let tmpList = []
  //includes: list, elemnt, str, ' '.
  for ( var query of queryList){
    for ( var key of tagList) {
      let usertagList=[]
      let usertag = datas[key]['유저태그']
      for( var k of Object.keys( usertag )){ usertagList = usertagList.concat( usertag[k] ) }

      if( !usertagList.includes(query) ){
        if( !tmpList.includes(key) ){ tmpList.push( key )
        }
      }
    }
    tagList = tmpList
    tmpList = []
  }

  return tagList
}
