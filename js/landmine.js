layer("请输入行数");
var lanMain = $("#lan-main");
var wrapWidth = $('#lan-wrap').offsetWidth;
var oUl = document.createElement("ul");
var row =  $("#row");
var subBtn = $("#sub");
var oLi,chosedNum;
var ctype= $(".ctype");
var paUl = $(".pa-ul");
var arr = [];
choseModle();
//选择难度
function choseModle(){
    ctype.onclick = function(){
        paUl.style.display = "block";
    }
    var paLi = paUl.getElementsByTagName('li');
    for(var i=0;i<paLi.length;i++){
        paLi[i].index = i;
        paLi[i].onclick = function(){
            // console.dir(this);
            var val = this.innerHTML;
            chosedNum = i;
            ctype.innerHTML = val;
            paUl.style.display = "none";
            switch(this.index){
                case 0:
                    makeSquare(9,10);
                    break;
                case 1:
                    makeSquare(16,40);
                    break;
                case 2:
                    makeSquare(30,99);
                    break;
            }
        }
    }
}
// 点击生成方格
subBtn.onclick = function() {
    var rowV = parseInt(row.value);
    var leiNumber = 0;
    if(rowV <= 5){
            layerMsg("请输入大于5的数字");
            return false;
    }else if(rowV < 10){
            leiNumber = 6;
    }else if(rowV <16){
            leiNumber = 20;
    }else if(rowV <30){
            leiNumber = 40;
    }else {
            leiNumber = 99;
    }
    makeSquare(rowV,leiNumber);
};
//点中雷爆
function cleanLan(_position){
    var oLi = oUl.getElementsByTagName('li');
    var allLei = [];
    for(var i = 0; i < oLi.length; i ++){
        oLi[i].onclick = function(){
            var lanP = this.getElementsByTagName("p")[0];
            setElementCss({'display':'none'},lanP);
            if(this.className.match(" lan")){
                    for(var n = 0; n < oLi.length; n ++) {
                        oLi[n].onclick = null;
                    }
                    for(var k in _position) {
                            var i = parseInt(k),j = parseInt(_position[k]);
                            /*setTimeout(function(){
                                    arr[i][j].getElementsByTagName('p')[0].style.display = "none";
                            },100)*/
                            allLei.push(i+"-"+j);
                    }
            }
            // console.log(allLei);
            if(!!allLei.join()){
                var u = 0;
                detonate();
                function detonate(){
                    if(u < allLei.length){
                        var z = allLei[u].split("-");
                        var x = z[0];
                        var y = z[1];
                        setTimeout(function(){
                            var p = arr[x][y].getElementsByTagName('p')[0];
                                p.style.display = "none";
                                setTimeout(function(){
                                    p.parentNode.className += " boom";
                                },100)
                                detonate();
                        },100);
                        u ++;
                    }
                }
            }
        }
    }
}
// 生成表格
function makeSquare(rowVal,leiNum){
    if((rowVal*21+1) < wrapWidth){
        lanMain.style.display = "block";
        lanMain.style.height = lanMain.style.width = rowVal*21 + 1 + "px";
        if(!!rowVal && typeof(rowVal) == "number"){
            var num = rowVal*rowVal;
            var str="";
            for(var i = 0; i < num; i ++){
                if(i%rowVal == 0){
                    str +='<li class="spe" data-num="0"><span></span><p></p></li>';
                }else {
                    str +='<li data-num="0"><span></span><p></p></li>';
                }
            }
            oUl.innerHTML = str;
            for(var i = 0; i < leiNum; i++){
                var lanPosition = parseInt(Math.random()*Math.pow(rowVal,2)); //生成个数
                deDuplication(lanPosition);
                function deDuplication(lanP){
                    var choseLi = oUl.getElementsByTagName('li')[lanP];
                    if(!choseLi.className.match(" lan")){
                        choseLi.className += " lan";
                        return;
                    }else if(lanP+1 < rowVal*rowVal){
                        deDuplication(lanP+1);
                    }else {
                        deDuplication(1);
                    }
                }
            }
            lanMain.appendChild(oUl);
            arrSq(rowVal);
            var leiPosition = arrImg;
            cleanLan(leiPosition);
        }
    }else {
        layerMsg();
    }
}

function arrSq(row){
    var codeNum = 97;
        arrImg = new Object(),
        linkNum = 0;
    for(var i = 0; i < row; i ++){
        arr[i] = [];
        linkNum = row * i;
        for(var j = 0; j < row; j++){
            arr[i][j] = oUl.getElementsByTagName('li')[linkNum+j];
            if(arr[i][j].className.match(' lan')){
                arrImg[i+String.fromCharCode(codeNum)] = j;
                codeNum++;
                // console.log(arrImg)
            }
        }
    }
    // console.dir(arrImg);
    for(var k in arrImg){
        var i = parseInt(k),j = parseInt(arrImg[k]);
        var type = ["-1|-1","-1|0","-1|1","1|-1","1|0","1|1","0|-1","0|1"];
        for(var n in type){
            var group = type[n].split("|"),
                    _i = parseInt(group[0]),
                    _j = parseInt(group[1]),
                    ii = i + _i,
                    jj = j + _j;
            if(ii<0||ii>row-1||jj<0||jj>row-1){
                    continue;
            }
            if(!arr[ii][jj].className.match(" lan")){
                var span = arr[ii][jj].getElementsByTagName('span')[0];
                var val = span.innerHTML==""?0:parseInt(span.innerHTML);
                span.innerHTML = ++val;
                switch(val){
                    case 2:
                        setElementCss({"color":"#5AE5F2"},span);
                        break;
                    case 3:
                        setElementCss({"color":"#DE5858"},span);
                        break;
                    case 4:
                        setElementCss({"color":"#4E2A21"},span);
                        break;
                    case 5:
                        setElementCss({"color":"#271217"},span);
                        break;
                }
            }
        }
            
    }
    return arrImg;
}
// 弹出框
function layer(txt){
    var laDiv = document.createElement("div");
    laDiv.id = "layer";
    laDiv.innerHTML = txt;
    document.body.appendChild(laDiv);
    var laObj = {
        "padding":"8px 20px",
        "lineHeight":"18px",
        "backgroundColor":"rgba(0,0,0,0.5)",
        "position":"fixed",
        "right":"50%",
        "top":"40%",
        "marginLeft":"-50px",
        "width":"100px",
        "color":"#fff",
        "textAlign":"center",
        "fontSize":"14px",
        "display":"none"
    };
    setElementCss(laObj,laDiv);
}
// 通过id或者class获取元素
function $(str){
    var element;
    if(str.match("#")){
        str = str.split('#')[1];
        element = document.getElementById(str);
    }else if(str.match(".")){
        str = str.split('.')[1];
        element = byClassName(str)[0];
    }
    return element;
}
// 获取class
function byClassName(cStr){
    var matchEle = cArr = [];
    var allEle = document.all;
    for(var i =0; i<allEle.length; i++){
        var cName = allEle[i].className;
        if(!!cName){
            cArr = cName.split(" ");
            for(var j = 0;j<cArr.length;j++){
                if(cArr[j] == cStr){
                    matchEle.push(allEle[i]);
                }
            }
        }
    }
    return matchEle;
}
// 设置元素的css
function setElementCss(obj,ele){
    for(var i in obj){
        ele.style[i] = obj[i];
    }
}
// 弹出框
function layerMsg(){
    var msg = arguments[0] || false;
    if(msg) {
        $("#layer").innerHTML = msg;
    }
    setElementCss({"display":"block"},$("#layer"));
    setTimeout(function(){
        setElementCss({"display":"none"},$("#layer"));
    },1500)
}