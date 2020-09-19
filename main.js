const coordinates 		= document.getElementById('coordinates');
const searchForm 		= document.getElementById('searchText');

let apiRequest = new XMLHttpRequest();
let baseUrl = 'https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=6C8nSRy83mBnAlo_-OdMnZf9BL1nWaw7UZcZhzk0TAc&searchtext='; 

searchForm.addEventListener('submit', ($event) => {
	$event.preventDefault();
	
	const city = document.getElementById('searchTextInput').value;
	
	const url = baseUrl + city
	apiRequest.open('GET', url);
	apiRequest.send();
});

apiRequest.onreadystatechange = () => {
	if(apiRequest.readyState === 4) {
		if(apiRequest.status === 404) {
			return coordinates.textContent = 'City not found!';
		} 
		const response = JSON.parse(apiRequest.response);
		console.log(response);
		coordinates.textContent = response.Response.View[0].Result[0].Location.DisplayPosition.Latitude;

		let lat = corr
	};
};