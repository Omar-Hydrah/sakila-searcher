(function(){

// Currently selected page is causing an unclear bug, in which sometimes a returned request will not be showen.

var offset = 0; // Defined in the global scope because of its usages across several functions
var pagesCount = 1; // Count of all available pages. Initially set to one page.
var currentPage   = 1; // Currently selected page.
var pageButtons; // Defined in the global scope because of its usages across several functions
var actorName; // The searched keyword to find the actor 


// Sends the search request to be processed inside the php file.
// The offset is generated dynamically inside this Javascript file in the variable "offset".
function sendSearchRequest(passedActorName){
	$.ajax({
		type: "GET",
		// url : "/find-actor/",
		// Changed structure, to be handled in express route.
		url: "/find-actor/" + passedActorName + "/" + offset,
		// data : {actorName : passedActorName, offset: offset},
		// data : JSON.stringify({actorName : passedActorName, offset: offset}),
		beforeRequest: function(request){
			// To change request headers.
			request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		},
		success : function(data){
			// var actors = JSON.parse(data);
			// console.log(data);
			var actors = data;

			// The count of all availabe actors by the searched word, 
			// is stored as the last index inside the array.
			var actorsCount = actors.pop();
			// Changed actorsCount, because of change in server.
			// pagesCount = Math.ceil(actorsCount.count / 5);
			pagesCount = Math.ceil(actorsCount / 5);
			console.log(pagesCount);
			// console.log(currentPage);
			displayActors(actors);
			createButtons(pagesCount);
		}
	});
}

/* ------------ */
// Removes all of the child nodes of an element.
// This helps in removing both the current actors, and current pagination button.
// Which allows for dynamic page manipulation. 
/* ------------ */

function removeContainerContent(targetElement){
	var targetContainer = document.getElementById(targetElement);
	while(targetContainer.firstChild){
		targetContainer.removeChild(targetContainer.firstChild);
	}
}

function displayActors(actorsArray){

	// Removing all of the contents actors division, 
	// to make space for new request responses
	removeContainerContent("actors");

	// Appending the list of found actors to the actors division.
	for(var i = 0; i < actorsArray.length; i++){
		var container = document.createElement("div"); // the container div
		var image     = document.createElement("img");
		var details   = document.createElement("div"); // the inner div that contains details
		var name      = document.createElement("h2");
		var movies    = document.createElement("p");

		container.className = "actor";
		image.src = "actor_photo.png";
		details.className = "actor-details";
		// name.innerHTML    = actorsArray[i]["first_name"] + " " + actorsArray[i]["last_name"];
		// Updated, because of changes in the back-end. Back-end returns an actor object{firstName, lastName}
		name.innerHTML    = actorsArray[i].firstName + " " + actorsArray[i].lastName;
		movies.innerHTML  = "This actor has no movies yet.";

		details.appendChild(name);
		details.appendChild(movies);
		container.appendChild(details);
		container.appendChild(image);

		document.getElementById("actors").appendChild(container);
	}
}

// Storing the input inside of a div.
var searchBar = document.getElementById("search-bar").children[0];
// var fileName  = window.location.pathname.substring(window.location.pathname.lastIndexOf("/"));

searchBar.onkeyup = function(){
	actorName = this.value;

	// Sending the request only when a letter or more is supplied
	if(actorName.length > 0){
		sendSearchRequest(actorName);
	}else{
		removeContainerContent("actors");
		removeContainerContent("pagination-ul");
		// Resetting the currentPage is to avoid having a new search come in, with the third page selected. 
		currentPage = 1; 
	}
}

// ------------------
// Pagination buttons.
// ------------------

// Creating all of the buttons.
function createButtons(numberOfButtons){
	// Removing any previous buttons before creating the new ones.
	removeContainerContent("pagination-ul");

	var paginationList = document.getElementById("pagination-ul"); // pagination container

	// Previous and next page buttons.
	var previousPageParent = document.createElement("li");
	var nextPageParent     = document.createElement("li");
	var previousPage       = document.createElement("a");
	var nextPage           = document.createElement("a");

	// Ading the html entities for left and right directional arrows.
	previousPage.appendChild(document.createTextNode("«") );
	nextPage.appendChild(document.createTextNode("»") ); 

	previousPage.setAttribute("href", "#");
	nextPage.setAttribute("href", "#");

	previousPage.setAttribute("id", "previous-page");
	nextPage.setAttribute("id", "next-page");

	previousPage.onclick = function(event){navigationArrow("left", currentPage);  event.preventDefault();}
	nextPage.onclick     = function(event){navigationArrow("right", currentPage); event.preventDefault();}

	// Appending buttons to li elements.
	previousPageParent.appendChild(previousPage);
	nextPageParent.appendChild(nextPage);

	paginationList.appendChild(previousPageParent);

	for(var i = 1; i < numberOfButtons + 1; i++){
		var listItem =   document.createElement("li"); // list-item parent.
		var listButton = document.createElement("a"); // The button.
		var listNumber = document.createTextNode(i); // Page number.
		listButton.setAttribute("class", "page"); 
		listButton.setAttribute("href", "#");

		listButton.appendChild(listNumber);
		listItem.appendChild(listButton);

		// Registering the functionality to enable cycling through pages.
		listButton.onclick = function(event){
			event.preventDefault();
			selectPage(this.innerHTML);
		}

		paginationList.appendChild(listItem);
	}

	paginationList.appendChild(nextPageParent);

	pageButtons   = document.getElementsByClassName("page");

	// Initialization of the pagination buttons:
	// Adds the "selected" class to the currently selected page button- 
	// the first one by default.
	pageButtons[currentPage - 1].classList.add("selected");

}


// This function adds the "selected" page to only the selected button, 
// and prevents having two buttons with the same class on them. 
function selectPage(selectedPage){
	// This variable is used to transfer the number to a zero based number.
	var index = parseInt(selectedPage) - 1;

	// Offset is calculated by multiplying index(selectedPage - 1) by 5 - number of items per page.
	// Example: If the selected page is 2; then (2 - 1) * 5 would result an offset of 5.
	offset = index * 5;
	sendSearchRequest(actorName);

	// Removing the "selected" class from all of the buttons.
	for(var i = 0; i < pageButtons.length; i++){
		pageButtons[i].classList.remove("selected");
	}

	// Adding the "selected" class to the selected button.
	pageButtons[index].classList.add("selected");
	currentPage = selectedPage;
}

// Going right or left based on the selected button
function navigationArrow(direction, selectedPage){
	if(direction == "left"){
		// Resetting the selected page to the first page.
		// Or moving one page backwards.
		currentPage = (selectedPage <= 1) ? 1 : parseInt(currentPage) - 1;
		
	}else if(direction == "right"){
		// Resetting the selected page to the last page - pagesCount.
		// Or moving one page forward
		currentPage = (selectedPage >= pagesCount) ? pagesCount : parseInt(currentPage) + 1;
		
	}
	// Adding the "select" class to the current page.
	selectPage(currentPage);
}

})();