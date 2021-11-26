// ==UserScript==
// @name         s0urce botnet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A botnet for s0urce!
// @author       cmdenthusiant
// @match        http://s0urce.io/
// @icon         https://www.google.com/s2/favicons?domain=s0urce.io
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

var botName = "Botnet"; //Bot's name
var Message = "";
var reHackms = 2000;
var botAmount = 10;
var lastTarget = GM_getValue("target");
var porting = true;
var words = await fetch("https://raw.githubusercontent.com/cmdenthusiant/s0urce-botnet/main/words.json").then(r=>{if(r.ok){return r.json()}});
if(words==undefined){console.log("Can't get words\nExiting...");return;}


function bot(){
    $("#login-input").val(botName); //Input bot name
    $("#login-play").click(); //Login
    const checkPlLoop = setInterval(()=>{//check if player list was loaded
        const pl = document.getElementById("player-list");
        if(pl.children.length!=1){
            clearInterval(checkPlLoop); //Stop Loop
            console.log("yes");
            selectTarget(lastTarget);
            port();
            hack();
        }
    },100);
}

function hack(){
    let typeBox = document.getElementById("tool-type-word");
    var lags = 0;
    var lagReload = false;
    const loop = setInterval(()=>{
        if(porting){return;}
        if(GM_getValue("target")==undefined){console.log("Closing Bot");window.close();return;}
        if(GM_getValue("target")!=lastTarget){lastTarget=GM_getValue("target");selectTarget(lastTarget);port();}
        let imgWord = $(".tool-type-img")[0];
        if(imgWord.src=="http://s0urce.io/client/img/words/template.png"){
            let msgBox = $("#topwindow-success");
            if(msgBox.is(":visible")){
                $("#targetmessage-input").val((GM_getValue("msg")!=undefined)?GM_getValue("msg"):Message);
                $("#targetmessage-input").submit();
                port();
            }
            return;
        }
        let difficulty = imgWord.src.split("http://s0urce.io/client/img/word/")[1].split("/")[0];
        let imgNum = imgWord.src.split("http://s0urce.io/client/img/word/"+difficulty)[1].replace("/","");
        console.log(difficulty,imgNum,words[difficulty][imgNum]);
        typeBox.value = words[difficulty][imgNum];
        let lastLogNum = $("#cdm-text-container").children().length;
        $("#tool-type-word").submit();
        setTimeout(()=>{if(!($("#cdm-text-container").children().length>lastLogNum)){if(lags>=5){console.log("Bot is offine\nReloading...");window.open("http://s0urce.io","_self");clearInterval(loop);}else{port();lags+=1;console.log("Lagging...")}}else{lags=0;}},1000)
    },(GM_getValue("ms")!=undefined)?GM_getValue("ms"):500);
}

function port(){
    porting = true;
    setTimeout(()=>{
        let ports = $("#window-other-attackbutton-wrapper").children();
        let portNum = randomInt(1,3);
        let lastLogNum = $("#cdm-text-container").children().length;
        ports[portNum].click();
        setTimeout(()=>{if($("#cdm-text-container").children().length>lastLogNum){port();}else{porting=false;}},1000);
    },reHackms);
}

function main(){
    window.onbeforeunload = (e)=>{GM_deleteValue("target");GM_deleteValue("msg");GM_deleteValue("ms");console.log("yes");e.returnValue='';};
    const checkPlLoop = setInterval(()=>{//check if player list was loaded
        const pl = document.getElementById("player-list");
        if(pl.children.length!=1){
            clearInterval(checkPlLoop); //Stop Loop
            $("#targetid-input-form").bind("submit",(e)=>getCmd(e));
            $("#targetid-button").bind("click",(e)=>getCmd(e));
        }
    },100);
};

function getCmd(e){
    let cmdBox = $("#targetid-input");
    if(!cmdBox.val().startsWith("bot!")){return;}
    let cmd = cmdBox.val().replace("bot!","");
    if(cmd==""){return;}
    if(cmd=="stop"){GM_deleteValue("target");console.log("Bots Stoped");return;}
    if(cmd.startsWith("botAmount")){
        let amount = parseInt(cmd.split("botAmount ")[1]);
        if(!isNaN(amount)){botAmount=amount;console.log("Changed botAmount to "+botAmount);}else{console.log("Usage: bot!botAmount <Number>");}
        return;
    }
    if(cmd.startsWith("message")){
        let msg = cmd.replace("message ","");
        if(msg!=""){GM_setValue("msg",msg);console.log("Changed Message to '"+msg+"'");}else{console.log("Usage: bot!message <message>");}
        return;
    }
    if(cmd.startsWith("ms")){
        let ms = parseInt(cmd.replace("ms ",""));
        if(!isNaN(ms)){GM_setValue("ms",ms);console.log("Changed ms to '"+ms+"'");}else{console.log("Usage: bot!ms <ms>");}
        return;
    }
    console.log("Target's Id: "+cmd);
    if(GM_getValue("target")===undefined){setTimeout(()=>{startBots()},200);}
    GM_setValue("target",cmd);
}

function waitPlLoad(){
    const checkPlLoop = setInterval(()=>{//check if player list was loaded
        const pl = document.getElementById("player-list");
        if(pl.children.length!=1){
            clearInterval(checkPlLoop); //Stop Loop
            return;
        }
    },100);
}

function selectTarget(id){
    let cmdBox = $("#targetid-input");
    cmdBox.val(id);
    cmdBox.submit();
}

function startBots(){
    for(let i=0;i<botAmount;i++){window.open("http://s0urce.io","_blank");}
    console.log("Created "+botAmount+" Bots");
}

function randomInt(min,max){return Math.floor(Math.random()*(max-min+1)+min)}

if(lastTarget!=undefined){bot();}else{main();}
