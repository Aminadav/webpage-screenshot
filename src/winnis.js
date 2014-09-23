var i=0;
var b=0;
var ii=0;
var lastMouseX = 0;
var lastMouseY = 0;


function findAndShowDirs(currentPath)
{
	//Aminadav
	if (navigator.appVersion.indexOf("Win")!=-1) this.windows=true;
	if (navigator.appVersion.indexOf("Mac")!=-1) this.mac=true;
	if (navigator.appVersion.indexOf("X11")!=-1) this.x11=true;
	if (navigator.appVersion.indexOf("Linux")!=-1) this.linux=true;
	if (this.windows) {this.rootDir=''; this.dirSep='\\'} else {this.dirSep='/';this.rootDir='/';}

	this.newDir="";
	this.ranDir="";
	this.strSlc;
	this.dirArr=new Array;
	this.currentPath="";
	this.chosenDir="";
	this.newDir="";
	this.firstTime=true;
	this.pathSerNum=0;
	this.pathArr= new Array();
	this.content="";
    this.whereTo="body";  	  
	theObject=this;
	this.minListWidth=544;
	this.minListHeight=120;

	this.load=load;
	this.enterDir=enterDir;
	this.makingList=makingList;
	this.returnDir=returnDir;
	this.backDir=backDir;
	this.forwardDir=forwardDir;
	this.storePath=storePath;
	this.chooseDir=chooseDir;
	this.cancelButton=cancelButton;
	this.openWin=openWin;
	this.saveStart=saveStrat;
	this.resize=resize;
	this.resizing=resizing;

	this.appendTo=appendTo;

	//Aminadav
	//Defaults
	this.content='<div id="outerDiv">\
	  <div id="upperSide">\
  	  <div id="sourceDiv"></div>\
  	  <img src="dirout.gif" class="myWindowButton" onClick="saveNow.returnDir()" title="up">\
  	  <img src="arrowleft.gif" class="myWindowButton" onClick="saveNow.backDir()" title="backward">\
  	  <img src="arrowright.gif" class="myWindowButton" onClick="saveNow.forwardDir()"title="forward">\
  	  </div>\
  	  	<div id="listDiv"></div>\
  	  	    	  <input type="button" id="openDir" value="open directory" onClick="saveNow.enterDir();saveNow.load();saveNow.makingList();"/>\
  	  	    	  <input type="button" value="choose" onClick="saveNow.chooseDir();"/>\
  	  	    	  <input type="button" value="cancel" onClick="cancelButton();"/>\
  	  </div>'//that is all the content of the saving window. I dont recommanding to make any changes, but it is your coise.
	this.whereTo=".window-content";//choose the parent of the saving place, by #id or .class; defuolt is "body".


	//Aminadav: Need to be run just on windows
	this.getDriveLetters=function ()
			{
			return JSON.parse(this.plugin.runCommand('cmd /c for %i in (a b c d e f g h i j k l m n o p q r s t u v w x y z) do @%i: 2>nul && set/pz=%i <nul',true)).bytes.replace(/([a-z])/gi,'$1:').split(' ').slice(0,-1);
			}

}	

function load()
{
	folderName=this.currentPath;
	myFolderList=plugin.getFileList(folderName);
if (this.currentPath!='')
	{
	myFolderList=myFolderList.slice(myFolderList.lastIndexOf(":[")+2,myFolderList.lastIndexOf('"')-1);
	myFolderList=myFolderList.replace(/"/g, '');
	this.dirArr=myFolderList.split(',');
	this.dirArr=this.dirArr.sort();
	}
else
	{
	//ShowFolders:
	this.dirArr=this.getDriveLetters();
	}
	console.log(this.dirArr)
$("#sourceDiv").empty();
$("#sourceDiv").append("<span>"+this.currentPath+"</span>");
i=0;
}



function enterDir()//function that set the new path whenever the user open a dirctory (through "open dirctory" or by doubleclick
{
	if(this.newDir!="")
	{
	this.currentPath=this.currentPath+this.newDir+this.dirSep;
	this.storePath();}
	
	else{
		alert("no directory had chosen!");
		$("#sourceDiv").empty();$("#sourceDiv").append("<div>"+this.currentPath+"</div>");}
	this.firstTime=false;
	
}



function makingList()//  showing the input dirs in the window
{
	$("#listDiv").empty();
	listI=0;
	while (listI<this.dirArr.length)
	{
		//Aminadav
		if (this.dirArr[listI]!='.' && this.dirArr[listI]!='..' )
			{
			dirNum="dir"+listI;
			$("#listDiv").append('<sapn class="divDirList"><img src="directory.gif" style={width:8px,height:8px}>'+this.dirArr[listI]+'</span><br/>')
			}
		listI++;
		
		
		}

	
	$(".divDirList").click(function(){
		$(".divDirList").css({"border":"none","background-color":"white"});
		$(this).css({"border":"black dotted 1px","background-color":"lightblue"});
		theObject.newDir=$(this).text();
	});
	
	$(".divDirList").dblclick(function(){//making that the dirs will open by doubleclick
		theObject.newDir=$(this).text();
		theObject.enterDir();
		theObject.load();
		theObject.makingList();
				});
	
this.newDir=""
}



function returnDir()//function making "up"- going to the dirctory that contain the current dir
{
	if(this.currentPath.toLowerCase()!=this.rootDir.toLowerCase())
	{
	this.currentPath=this.currentPath.slice(0,this.currentPath.lastIndexOf(this.dirSep));
	this.currentPath=this.currentPath.slice(0,(this.currentPath.lastIndexOf(this.dirSep)+1));
	this.storePath();
	this.load();
	this.makingList();
	}
}



function backDir()//"backward"- going to the last path, if there is one
{
	if(this.pathSerNum>0)
	{
		this.pathSerNum-=1
		this.currentPath=this.pathArr[this.pathSerNum];
		this.load();
		this.makingList();
	}
	}



function forwardDir()//"forward"- going to the next path, if there is one
{
	if(this.pathArr[this.pathSerNum+1]!=undefined)
	{
		this.pathSerNum+=1
		this.currentPath=this.pathArr[this.pathSerNum];
		this.load();
		this.makingList();
	}
	}

function storePath()//storing the current path into array (for the backward&forward func)
{
	this.pathSerNum+=1;
	this.pathArr[this.pathSerNum]=this.currentPath;
}

function chooseDir()//sending the path that the user chose us output
{
if(this.newDir!="")
		{this.currentPath+= this.newDir+this.dirSep};
this.chosenDir=this.currentPath;
//alert("the directory you had chosen is " + );

//Aminadav;
localStorage['lastPath']=this.chosenDir;
this.onChoose(this.chosenDir);
this.cancelButton();
}


function cancelButton()//closing window
{
	//Aminadav
	if (this.onClose) this.onClose();
	$(".window-closeButton").trigger('click')
};

function appendTo(a)//append the saving block to a parent
{
	$(a).append(this.content);
}

function openWin(){//opening window
	$("#cover").show().css({"width": $(window).width()+17, "height": $(window).height()+17})
	saveNow.pathArr[0]=saveNow.currentPath;
$.newWindow({
	  id: "bam",
      title: "Choose a directory",
      width: 580,
      height: 220,
      posx: 100,
      posy: 100,
      content: "" ,
      onDragBegin : null,
      onDragEnd : null,
      onResizeBegin : null,
      onResizeEnd : null,
      onAjaxContentLoaded : null,
      statusBar: true,
      minimizeButton: false,
      maximizeButton: false,
      closeButton: true,
      draggable: true,
      resizeable: true
 }
 	 );
	$(".window-closeButton").click(function(){
		$("#cover").hide()
	});
	
	

}

function saveStrat()
{

	//Aminadav
	//Try to setPath to the last directory that we used.
	// If it is doesn't work go to the temp directory.
	plugin=this.plugin;
	js=JSON.parse(plugin.getTempFolder())
	this.currentPath=localStorage['lastPath'] || js.tempfolder;
	if (!this.windows)
		{
		if (this.currentPath.slice(-1)!='/') this.currentPath+='/';
		}
	js1=JSON.parse(plugin.setPath(this.currentPath));
	if (js1.errorcode!=0) plugin.setPath(js.tempfolder)

	openWin();
	this.appendTo(this.whereTo);
	this.load();
	this.makingList();

	$(".myWindowButton").mousedown(function()
			{
		$(this).css("border","inset rgb(192,192,252)")
			});
	$(".myWindowButton").mouseup(function()
			{
		$(this).css("border","outset rgb(192,192,252)")
			});

	
	$windowResizeIcon.bind('mousedown', function(e) {
	    $lobj = $("#listDiv");
	    
	        lastMouseX = e.clientX;
	        lastMouseY = e.clientY;
	    
	    $(document).bind('mousemove', function(e) {
            theObject.resizing(e, $lobj);
        });
	});

	        
	
}

$(document).ready(function()
		{
			$(".myButton").mousedown(function()
					{
				$(this).css("border","inset")
					});
			$(".myButton").mouseup(function()
					{
				$(this).css("border","outset")
					});
			
		});


$(function()
		{
	$(".myButton").mousedown(function()
			{
		$(this).css("border","inset")
			});
	$(".myButton").mouseup(function()
			{
		$(this).css({"border":"outset rgb(192,192,192)"})
			});
		});


function resize($lobj, width, height) {
	width = parseInt(width);
    if (width<this.minListWidth){width=this.minListWidth};
    height = parseInt(height);
    if (height<this.minListHeight){height=this.minListHeight;};
    $lobj.data("lastWidth", width).data("lastHeight", height);            
    $lobj.css("width", width + "px").css("height", height + "px");
    }


function resizing (e, $lobj) {
    e = e ? e : window.event;
    var w = parseInt($lobj.css("width"));
    var h = parseInt($lobj.css("height"));
	w = w < 50 ? 50  : w;
    h = h < 20 ? 20 : h;
    $("#a").text(w+ " " +h);
    var neww = w + (e.clientX - lastMouseX);
    var newh = h + (e.clientY - lastMouseY);
    $("#a").text(w+ " " +h);
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    this.resize($lobj, neww, newh);
};



