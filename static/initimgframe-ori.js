
//imgframe init.
pagenum=1

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

/*
리스트갖고있고,
메이크박스로는 개별생성가능.

일단 외부프레임을 얻고나서
외부프레임에,지정된페이지번호의 생성을 명령함.
..그럼 끝.이후는 버튼이 눌리면서 될것이다..이벤트발생하거나. init이니까.ㅇㅋ.
*/
