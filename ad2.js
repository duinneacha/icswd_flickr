// Aidan Dennehy R00145278 ICSWD Assignment 2 - Flickr Search using API
// Search Terms are stored in this array - please feel free to modify

var theSearchItems = ["Pampalona", "Agra, India", "Achill Island"];


var flickrAPIKey="1c11fea9daeb19c3968ef64a47bf828c";
var perPageCount = 100;

function init() {
  
  // Event Listeners 

  // Close the Modal
  var cp = document.getElementById("closePic");
  cp.addEventListener("click", function(){
    document.getElementById("bigPictureModal").style.display = "none";
  });

  

  // Load the first search from local storage
  var firstSearch = localStorage.getItem('searchString');
  if(firstSearch!==null) {
    var searchTerm = firstSearch.replace(" ", "+"); //  
    send_Flickr_Request(searchTerm);
  }
  

  createSearchElements(theSearchItems);
}


function createSearchElements(theSearchItems) {
  //alert("AD2");
  //console.log(theSearchItems);


  // Loop through the Search Items and build a span list
  for(i=0; i<theSearchItems.length; i++) {
    
    // Create Span Element
    var sp = document.createElement('span');

    // Assign the class name searchButtons
    sp.className = 'searchButtons';

    // Assign the array element as the text of the span item
    sp.innerText = theSearchItems[i];

    // Add an event listener to the span item - processSearch
    sp.addEventListener('click', processSearch);

    // Add the element to the DOM
    document.querySelector('div.searchButtons').appendChild(sp);
    
    
  }

}

function processSearch(eventObject) {

  // Clear previous Picture Display
  document.getElementById('photoContainer').innerHTML = "";  

  // Set the eventObject to a variable to get the search term
  adval = eventObject;

  

  // Get the Search Term from the eventObject
  var searchedString = adval.target.firstChild.data;
  //console.log(searchedString);


  localStorage.setItem('searchString',searchedString);

  // Replace any space in the search term with a plus(+)
  var searchTerm = searchedString.replace(" ", "+"); //  

  // Send the request to be built
  send_Flickr_Request(searchTerm);

}

function send_Flickr_Request(searchFor) {

  // Build Flickr API Request
  var request = "https://www.flickr.com/services/rest/?";
  request += "method=flickr.photos.search";
  request += "&per_page="+perPageCount;
  request += "&api_key=1c11fea9daeb19c3968ef64a47bf828c";
  request += "&tags=";
  request += searchFor;
  request += "&tag_mode=all";
  request += "&format=json";
  request += "&callback=processData";
 
  document.getElementById('displayLoading').style.display = 'block';
  executeSearch(request);
}

// Function to Execute Flickr API Request - request is passed
function executeSearch(request) {
  newScript = document.createElement('script');
	newScript.setAttribute('src',request);
	document.getElementsByTagName('head')[0].appendChild(newScript);
}


function jsonFlickrApi (response) {
  document.getElementById('displayLoading').style.display = 'none';
  var photoList = response.photos.photo;
  displayPhotos(photoList);  
}

function displayPhotos(photos) {
  console.log(photos);
  var newStr = "";
  //var tempPhotoArray = new Array();
  for(i=0; i<photos.length; i++) {
    url = "http://farm" + photos[i].farm ;
    url += ".static.flickr.com/" ;
    url += photos[i].server + "/";
    url += photos[i].id + "_";
    url += photos[i].secret;
    
    var zurl = url + "_z.jpg";
    //console.log(zurl);
    url += "_s.jpg";
    var imgID = photos[i].id;
    

    var imgt = document.createElement('img');
    imgt.id = imgID;
    imgt.className = "imageClass";
    //imgt.dataset.title = photos[i].title;
    imgt.dataset.loadingimg = "img/loader.gif";
    console.log(imgt.dataset.title);
    imgt.src = imgt.dataset.loadingimg;
    imgt.onload =  function() {
       //console.log("Loop OnLoad");
       //console.log(url);
       imgt.src = "img/loader.gif";
         
     } (imgt.src = url);
    imgt.title = photos[i].title;
    imgt.src = url;
    
    var imgAttrib = "dispImg('" + imgID + "')";
    imgt.setAttribute('onclick', imgAttrib);

    imgtParent = document.getElementById("photoContainer");
    imgtParent.appendChild(imgt);
    //tempPhotoArray[i] = imgt;
    
  }
  
  //var photoArray = document.getElementsByClassName("imageClass");
}

function dispImg(imageID) {

  var imageToDisplay = new Image();
  imageToDisplay = document.getElementById(imageID);
  var imgTitle = document.getElementById(imageID).title;
  var smallImageFile = imageToDisplay.src;
  var largeImageFile = smallImageFile.replace("_s.jpg","_z.jpg");

  
  // Check if there is a previous sibling - turn off go left if there is none
  if(document.getElementById(imageID).previousSibling!==null){
    document.getElementById('goLeft').style.display = 'block';
  } else {
    document.getElementById('goLeft').style.display = 'none';
  }
  
 // Check if there is a next sibling - turn off go right if there is none
 if(document.getElementById(imageID).nextSibling!==null){
  document.getElementById('goRight').style.display = 'block';
} else {
  document.getElementById('goRight').style.display = 'none';
}



  document.getElementById("bigPictureModal").style.display = "block";
  
  imageToDisplay.onload = function() {
    console.log("On Load");
    alert("AD");
    document.getElementById("bigPictureModalImg").src = "img/loader.gif";  
  };

  
  document.getElementById("bigPictureModalImg").src = largeImageFile;
  document.getElementById("bigPictureModalImg").title = imgTitle;


   // Right or left arrow pressed listener
   window.addEventListener("keyup", keyboard);

   function keyboard(e) {
    if (e.which == 37) {   // Left
      
      // Chenge the style on pressing the left arrow
      setTimeout(function() {document.getElementById("goLeft").style.backgroundColor = "white";},200)
      document.getElementById("goLeft").style.backgroundColor = "red";
      
      goLeftFunction(imageID);
    } else if (e.which == 39) { // Right

      // Chenge the style momentarily on pressing right arrow
      setTimeout(function() {document.getElementById("goRight").style.backgroundColor = "white";},200)
      document.getElementById("goRight").style.backgroundColor = "red";

      goRightFunction(imageID);
    }
  }
  

  // Go Left Listener
  var gl = document.getElementById("goLeft");
  gl.onclick=function() {
    goLeftFunction(imageID);
  };

  // Go Right Listener
  var gr = document.getElementById("goRight");
  
  gr.onclick=function() {
    goRightFunction(imageID);
  };
  
}


// Go Right Function
function goRightFunction(imageID) {
  dispImg(document.getElementById(imageID).nextSibling.id)
}


// Go Left Function
function goLeftFunction(imageID) {
  console.log(imageID);
  dispImg(document.getElementById(imageID).previousSibling.id);
}

// Function to implement onload - as per spec requirement
function loadNextImage(imageID) {
  alert(imageID);
  if (imageID) {
    
  }
}


window.onload = init();
