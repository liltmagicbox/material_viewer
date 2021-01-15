function sortNolist(datas,noList,sortby){
  "sortby: new old random"
  // input noList , outputs noList.
  //it only sorts by given standard.
  if ( sortby == 'new' ){
    var c=[]
    for (var key of noList) {  c.push( [ key , datas[key]['날짜'].replaceAll('.','')   ]  )    }
    c.sort( function(a,b){ return b[1] - a[1]; }  )
    noList = []
    for (var d of c) {  noList.push( d[0] )  }
  }
  else if( sortby == 'old'){
    var c=[]
    for (var key of noList) {  c.push( [ key , datas[key]['날짜'].replaceAll('.','')   ]  )    }
    c.sort( function(a,b){ return a[1] - b[1]; }  )
    noList = []
    for (var d of c) {  noList.push( d[0] )  }

  }
  else if( sortby == 'random'){
    noList.sort( function(){ return Math.random() - Math.random() ; } )
  }

//-------------added by title atoz ztoa
  else if( sortby == 'atoz'){
    var c=[]
    for (var key of noList) {  c.push( [ key , datas[key]['제목']   ]  )    }
    //c.sort( function(a,b){ return a[1] < b[1]; }  )
    c.sort(function(a, b){
    if(a[1] < b[1]) { return -1; }
    if(a[1] > b[1]) { return 1; }
    return 0;
    })
    noList = []
    for (var d of c) {  noList.push( d[0] )  }
  }
  else if( sortby == 'ztoa'){
    var c=[]
    for (var key of noList) {  c.push( [ key , datas[key]['제목']   ]  )    }
    c.sort(function(a, b){
    if(a[1] > b[1]) { return -1; }
    if(a[1] < b[1]) { return 1; }
    return 0;
    })
    noList = []
    for (var d of c) {  noList.push( d[0] )  }
  }

//-----------------------------view list
  else if( sortby == 'view+'){
    console.log('++')
    var c=[]
    for (var key of noList) {  c.push( [ key , datas[key]['제목']   ]  )    }
    //c.sort( function(a,b){ return a[1] < b[1]; }  )
    c.sort(function(a, b){
    if(a[1] < b[1]) { return -1; }
    if(a[1] > b[1]) { return 1; }
    return 0;
    })
    noList = []
    for (var d of c) {  noList.push( d[0] )  }
  }
  else if( sortby == 'view-'){
    console.log('--')
    var c=[]
    for (var key of noList) {  c.push( [ key , datas[key]['제목']   ]  )    }
    c.sort(function(a, b){
    if(a[1] > b[1]) { return -1; }
    if(a[1] < b[1]) { return 1; }
    return 0;
    })
    noList = []
    for (var d of c) {  noList.push( d[0] )  }
  }

  return noList
}
