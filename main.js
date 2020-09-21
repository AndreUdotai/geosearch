const longitudeCoordinates 		= document.getElementById('longitudeCoordinates');
const latitudeCoordinates 		= document.getElementById('latitudeCoordinates');
const searchForm 				= document.getElementById('searchText');
const mapDisplay				= document.getElementById('map');

let apiRequest = new XMLHttpRequest();
// let mapRequest = new XMLHttpRequest();
let baseUrl	= 'https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=6C8nSRy83mBnAlo_-OdMnZf9BL1nWaw7UZcZhzk0TAc&searchtext=';

// let mapUrl = 'https://www.mapquestapi.com/staticmap/v5/map?key=8Dki0pvPAIdaPvLx8D7svwxs72IUthCN&center='

// let mapUrl = 'https://www.mapquestapi.com/staticmap/v5/map?key=8Dki0pvPAIdaPvLx8D7svwxs72IUthCN&center=5.02092,7.93444&size=@2x'

searchForm.addEventListener('submit', ($event) => {
	$event.preventDefault();
	
	const city = document.getElementById('searchTextInput').value;
	const url = baseUrl + city
	apiRequest.open('GET', url);
	apiRequest.send();
});

// searchForm.addEventListener('submit', ($event) => {
// 	$event.preventDefault();
	
// 	const city = document.getElementById('searchTextInput').value;
// 	const url = mapUrl + city
// 	apiRequest.open('GET', url);
// 	apiRequest.send();
// });


apiRequest.onreadystatechange = () => {
	if(apiRequest.readyState === 4) {
		if(apiRequest.status === 404) {
			return message.textContent = 'City not found!';
		}
		const response = JSON.parse(apiRequest.response);

		let longitudeCoordinate = response.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
		let latitudeCoordinate 	= response.Response.View[0].Result[0].Location.DisplayPosition.Latitude;

		longitudeCoordinates.textContent 	= longitudeCoordinate;
		latitudeCoordinates.textContent 	= latitudeCoordinate;

	L.mapquest.key = '8Dki0pvPAIdaPvLx8D7svwxs72IUthCN';

    var map = L.mapquest.map('map', {
       center: 	[latitudeCoordinate, longitudeCoordinate],
       layers: 	L.mapquest.tileLayer('map'),
       zoom: 	12,
       type: 'dark',
    });

    map.addControl(L.mapquest.control());
	};
};

// apiRequest.onreadystatechange = () => {
// 	if(apiRequest.readyState === 4) {
// 		if(apiRequest.status === 404) {
// 			return message.textContent = 'City not found!';
// 		}
// 		const response = apiRequest.response;
// 		console.log(response);
		// mapDisplay.textContent = response;
 		// reportSection.textContent = 'The weather in ' + response.name + ' is ' + response.weather[0].main + '.';


		// let longitudeCoordinate = response.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
		// let latitudeCoordinate 	= response.Response.View[0].Result[0].Location.DisplayPosition.Latitude;

		// longitudeCoordinates.textContent 	= longitudeCoordinate;
		// latitudeCoordinates.textContent 	= latitudeCoordinate;



		// convert to Base64
		// let b64Response = btoa(response);
		// let b64Response = btoa(unescape(encodeURIComponent(response)))
		// // create an image
		// let outputImg = document.createElement('img');
		// outputImg.src = 'data:image/png;base64,'+b64Response;

		// // append it to your page
		// mapDisplay.appendChild(outputImg);


		// var rawResponse = 'PNG'; // This is your response object
		// var encodedResponse = btoa(response);

		// var img = new Image();
		// var container = document.getElementById('newImg');

		// img.src = 'data:image/gif;base64,' + encodedResponse;

		// img.onload = function() {
		// container.appendChild( img );
		// };

// 	};
// }






