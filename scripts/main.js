const searchFormLandingPage 	= document.getElementById('searchFormLandingPage');
const searchFormHomePage 		= document.getElementById('searchFormHomePage');
const searchInputLandingPage	= document.getElementById('searchInputLandingPage');
const searchInputHomePage		= document.getElementById('searchInputHomePage');
const mapDisplay				= document.getElementById('mapDisplay');

let cityLabel		= document.getElementById('cityLabel');
let weatherCondtion	= document.getElementById('weatherCondition');
let postalCode		= document.getElementById('postalCode');
let temperature		= document.getElementById('temperature');
let humidity		= document.getElementById('humidity');
let windSpeed		= document.getElementById('windSpeed');
let longitude		= document.getElementById('longitude');
let latitude		= document.getElementById('latitude');
let celsius			= document.getElementById('celsius');
let fahrenheit		= document.getElementById('fahrenheit');
let landmarkName 	= document.getElementById('landmarkName');
let temperatureControls = document.getElementById('temperatureControls');



let apiRequest 			= new XMLHttpRequest();
let weatherApiRequest 	= new XMLHttpRequest();

let hereApiBaseUrl	= 'https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=6C8nSRy83mBnAlo_-OdMnZf9BL1nWaw7UZcZhzk0TAc&searchtext=';


searchFormHomePage.addEventListener('submit', ($event) => {
	$event.preventDefault();

	temperatureControls.style.display = 'inline';

	const chosenCity = searchInputHomePage.value;
	const url = hereApiBaseUrl + chosenCity + '&mode=retrieveLandmarks&prox=6.4584,7.5464,1000';
	apiRequest.open('GET', url);
	apiRequest.send();

	weatherApiRequest.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + chosenCity + '&APPID=b34fddd3dae4a2eb0ad363b62f98ba1e&units=metric');
	weatherApiRequest.send();

});


apiRequest.onreadystatechange = () => {
	if(apiRequest.readyState === 4) {
		if(apiRequest.status === 404) {
			return message.textContent = 'City not found!';
		}

		const response = JSON.parse(apiRequest.response);

		let longitudeCoordinate 	= response.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
		let latitudeCoordinate 		= response.Response.View[0].Result[0].Location.DisplayPosition.Latitude;

		cityLabel.innerText 		= response.Response.View[0].Result[0].Location.Address.Label;
		let postCode				= response.Response.View[0].Result[0].Location.Address.PostalCode;


		if(postCode != undefined){
			postalCode.textContent	= 'Postal code: ' + postCode;
		} else {
			postalCode.textContent	= 'Not Available.'
		}
		longitude.innerText			= 'Longitude: ' + longitudeCoordinate;
		latitude.innerText			= 'Latitude: ' + latitudeCoordinate + ' | ';

		map.remove();

		buildMap(latitudeCoordinate, longitudeCoordinate);

		landmarkRetrieve(latitudeCoordinate, longitudeCoordinate);

	};
};

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
}

// function for temperature conversion between celsius and fahrenheit
function convertToF(celsius) {
	let fahrenheit;
   	fahrenheit = celsius * 9/5 + 32;
	return fahrenheit.toFixed(2);
}

weatherApiRequest.onreadystatechange = () => {
	if(weatherApiRequest.readyState === 4) {
		if(weatherApiRequest.status === 404) {
			return message.textContent = 'City not found!';
		}
		const response = JSON.parse(weatherApiRequest.response);

                            
		weatherCondtion.innerHTML	= '<span><i class="fa fa-cloud fa-3x" aria-hidden="true"></i> ' + response.weather[0].description  + '</span>';
		temperature.innerHTML		= '<span>' + response.main.temp +  '</span>';
		humidity.textContent		= 'Humidity: ' + response.main.humidity + '%';
		windSpeed.textContent		= 'Wind: ' + response.wind.speed + 'm/s';

		fahrenheit.addEventListener('click', ($event) => {
			$event.preventDefault();
			temperature.textContent = convertToF(response.main.temp);
		})

		celsius.addEventListener('click', ($event) => {
			$event.preventDefault();
			temperature.textContent = response.main.temp;
		})
	};
}

function landmarkRetrieve(lat, long){
	let landmarkRequest		= new XMLHttpRequest();
	landmarkRequest.open('GET', 'https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=6C8nSRy83mBnAlo_-OdMnZf9BL1nWaw7UZcZhzk0TAc&mode=retrieveLandmarks&prox=' + lat + ',' + long + ',1000');

	landmarkRequest.onreadystatechange = () => {
		if(landmarkRequest.readyState === 4) {
			if(landmarkRequest.status === 404) {
				return message.textContent = 'City not found!';
			}
			const response = JSON.parse(landmarkRequest.response);

			checkUndefined(response.Response.View[0].Result[0], landmark1Name);
			checkUndefined(response.Response.View[0].Result[1], landmark2Name);
			checkUndefined(response.Response.View[0].Result[2], landmark3Name);
			checkUndefined(response.Response.View[0].Result[3], landmark4Name);

		};
	}
	landmarkRequest.send();
}

// function for displaying landmarks
function checkUndefined(landmark, landmarkDisplay){
	if(landmark == undefined){
		landmarkDisplay.innerText = 'undefined';
	} else {
		landmarkDisplay.innerText = landmark.Location.Name;
	}
}

