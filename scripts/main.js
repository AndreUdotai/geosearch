const searchFormLandingPage 	= document.getElementById('searchFormLandingPage');
const searchFormHomePage 		= document.getElementById('searchFormHomePage');
const searchInputLandingPage	= document.getElementById('searchInputLandingPage');
const searchInputHomePage		= document.getElementById('searchInputHomePage');
const mapDisplay				= document.getElementById('mapDisplay');
const clearButton				= document.getElementById('clearButton');
const landmarks 				= document.getElementById('landmarks');
const mapContainer				= document.getElementById('mapContainer');
const alert						= document.getElementById('alert');

searchFormHomePage.addEventListener('submit', ($event) => {
	$event.preventDefault();
	//Calling the requestHereAPIInfo function
	requestHereAPIInfo()
	//Calling the requestWeatherAPIInfo function
	requestWeatherAPIInfo()
});
searchFormHomePage.addEventListener('input', () => {
	clearButton.innerText = '×';
})
clearButton.addEventListener('click', () => {
	searchFormHomePage.reset();
	clearButton.innerText = ' ';
});

function alertError(alertMessage){
	let alert = document.createElement('div');
	alert.innerHTML = `<div class="alert alert-warning alert-dismissible fade show mb-1 mt-1" role="alert">
	${alertMessage}
	<button type="button" class="close" data-dismiss="alert" aria-label="Close">
	  <span aria-hidden="true">&times;</span>
	</button>
  </div>`
	mapContainer.prepend(alert);
}

// // This function queries the Here API to extract location details for the searched city
function requestHereAPIInfo(){
	const chosenCity	= searchInputHomePage.value;
	const url 			= 'https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=6C8nSRy83mBnAlo_-OdMnZf9BL1nWaw7UZcZhzk0TAc&searchtext=' + chosenCity + '&mode=retrieveLandmarks&prox=6.4584,7.5464,1000';

	fetch(url)
		.then(response => {
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response 
	  	})
		.then(response => response.json())
		.then(data => {
			let outcome = data;
			let longitudeCoordinate 	= outcome.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
			let latitudeCoordinate 		= outcome.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
			let postCode				= outcome.Response.View[0].Result[0].Location.Address.PostalCode;
			let cityName				= outcome.Response.View[0].Result[0].Location.Address.Label;

			document.getElementById('cityInfo2').innerHTML 	= 	`<div class="card border-white">
			<div class="card-body" id="cityInfo"><span class="h4">${cityName}</span> <br>
				Latitude: ${latitudeCoordinate} | Longitude: ${longitudeCoordinate} <br>
				${postCode != undefined ? 'Postal code: ' + postCode : 'Postal Code is not available for this city.'}</div></div>`;

			// This method clears a previously searched map for onward display of another map from a new query
			map.remove();
			// Calling the builMap function and passing in the extracted coordinates from the searched city as arguments.
			buildMap(latitudeCoordinate, longitudeCoordinate);
			// Calling the landmarkRetrieve function and passing in the extracted coordinates as arguments
			landmarkRetrieve(latitudeCoordinate, longitudeCoordinate);
		})
}

// function for building the mapquest web SDK
function buildMap(latitude, longitude){
	mapDisplay.innerHTML = "<div id='map' style='width: 100%; height: 500px;'></div>";
	L.mapquest.key = '8Dki0pvPAIdaPvLx8D7svwxs72IUthCN';
	
	let map = new L.mapquest.map('map', {
		center: 	[latitude, longitude],
		layers: 	L.mapquest.tileLayer('map'),
		zoom: 		12,
		type: 		'dark',
	});
	map.addControl(L.mapquest.control());

	L.marker([latitude, longitude],{
		icon: L.mapquest.icons.marker(),
		draggable: false
	}).bindPopup('Denver, CO').addTo(map);
}

// function for temperature conversion between celsius and fahrenheit
function convertToF(celsius) {
	let fahrenheit;
   	fahrenheit = celsius * 9/5 + 32;
	return fahrenheit.toFixed(2);
}

// //This function queries the Open Weather Map API to extract weather info for the searched location
function requestWeatherAPIInfo(){
	const chosenCity = searchInputHomePage.value;
	fetch('https://api.openweathermap.org/data/2.5/weather?q=' + chosenCity + '&APPID=b34fddd3dae4a2eb0ad363b62f98ba1e&units=metric')
		.then(response => {
			if (!response.ok) { 
				if(response.statusText == 'Bad Request'){
					alertError('Ensure to make an input in the search bar. You can search for Street Addresses. Eg "Lagos St, Enugu"')
				} else if(response.statusText == 'Not Found'){
					alertError('City not found. Please confirm your spelling and ensure to insert spaces where appropriate. E.g. "Port Harcourt, Rivers"')
				}
				throw Error(response.statusText)
			}
			return response
	  	})
		.then(response => response.json())
		.then(data => {
			let response = data;

			document.getElementById('weatherInfo2').innerHTML 	= `<div class="card border-white">
			<div class="card-body" id="weatherInfo"><i class="fa fa-cloud fa-3x" aria-hidden="true"></i> ${response.weather[0].description} <br>
										<span class="h1" id='temperature'>${response.main.temp}</span> <sup><span class="h6"><a href="#" id="celsius">°C</a> | <a href="#" id="fahrenheit">°F</a></span></sup> <br>
										Humidity: ${response.main.humidity}% <br>
										Wind: ${response.wind.speed}m/s</div></div>`
			
			// Remove the landing page
			document.getElementById('landingPage').remove();
			// set
			alertError('Not the location you searched for? Add other parameters like "State" or "Country" names.')
			
			document.getElementById('fahrenheit').addEventListener('click', ($event) => {
				$event.preventDefault();
				document.getElementById('temperature').textContent = convertToF(response.main.temp);
			})
			document.getElementById('celsius').addEventListener('click', ($event) => {
				$event.preventDefault();
				document.getElementById('temperature').textContent = response.main.temp;
			})
	})
}

// This function retrieves the landmarks within 1000m around any coordinates
function landmarkRetrieve(lat, long){
	fetch('https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=6C8nSRy83mBnAlo_-OdMnZf9BL1nWaw7UZcZhzk0TAc&mode=retrieveLandmarks&prox=' + lat + ',' + long + ',1000')
		.then(response => {
			if (!response.ok) { throw Error(response.statusText) }
			return response
	  	})
		.then(response 	=> response.json())
		.then(data 		=> {
			let response = data
	
			if(response.Response.View[0] == undefined){
				landmarks.style.display = 'none';
			} else {
				landmarks.style.display = 'flex';
				while (landmarks.firstChild) {
					landmarks.removeChild(landmarks.firstChild);
				}
				for(let i = 0; i < 4; i++){
					if(response.Response.View[0].Result[i] != undefined){
						let column 		= document.createElement('div');
						let card		= document.createElement('div');
						let cardBody	= document.createElement('div');
						let cardText	= document.createElement('p');
						let cardImage	= document.createElement('img');

						column.classList.add('col-12', 'col-md-6', 'col-lg-3');
						card.classList.add('card', 'my-2');
						cardBody.classList.add('card-body');
						cardText.classList.add('card-text');
						cardImage.setAttribute('src', 'images/landmark1.jpeg');
						cardImage.classList.add('card-img-top');
						cardImage.setAttribute('height', '200');

						column.appendChild(card);
						card.appendChild(cardImage);
						card.appendChild(cardBody);
						cardBody.appendChild(cardText);

						cardText.innerText = response.Response.View[0].Result[i].Location.Name;
						landmarks.appendChild(column);
					}
				}
			}
	})
}