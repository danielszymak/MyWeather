
const endpoint = 'https://raw.githubusercontent.com/cc-team-2019/weather-APP/master/src/miasta.json';
const cities = [];
const kelvin = 273
const key = "82005d27a116c2880c8f0fcb866998a0"
var searchedLat;
var searchedLon;
const notificationElement = document.querySelector('.notification')

fetch(endpoint)
    .then(blob => blob.json()) 
    .then(data => cities.unshift(...data));

function findMatches(wordToMatch, cities) {
    return cities.filter(place => {
        const regex = new RegExp(wordToMatch, 'gi');
        return place.text_simple.match(regex);
    })
}

function displayMatches() {
    suggestions.style.display = 'block';
    const matchArray = findMatches(this.value, cities);
    const html = matchArray.map(place => {
        const regex  = new RegExp(this.value, 'gi');
        const cityName = place.text_simple.replace(regex, `<span class="hl">${this.value}</span>`)
       return `<li id="button"><span class="name">${cityName}, ${place.text_gray}</span></li>`
    })
    suggestions.innerHTML = html.join('')
    let clickedSearchResult = document.querySelectorAll('#button');
    clickedSearchResult.forEach((elem, index) => {
        elem.addEventListener('click', e => {
            searchedLat = matchArray[index].lat;
            searchedLon = matchArray[index].lon;
            suggestions.style.display = 'none';
            getWeather(searchedLat, searchedLon)
            return searchInput.value = e.currentTarget.innerText.toLowerCase()
        })
    })
 
}

//------------------------------
if(typeof(Storage) !== "undefined" && localStorage.getItem("lat")!==null){
    let latitude = localStorage.getItem("lat");
    let longitude = localStorage.getItem("lon");
    getWeather(latitude, longitude);
    console.log("Default: "+localStorage.getItem("lat")+" "+localStorage.getItem("lon"));
}
else{
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(setPosition, showError)        
    } else {
        console.log('geolocation not available')
    }
}
//----------------------

//GEO start
function setPosition(position) {
    let latitude = position.coords.latitude

    let longitude = position.coords.longitude
    searchedLat = latitude;
    searchedLon = longitude;
    getWeather(latitude, longitude)
}

function showError(error) {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>${error.message}</p>`
}
//End of GEO


//Storage---------------------------
document.getElementById("button_set").addEventListener('click', isSetDefault);

function isSetDefault(){
    if(searchedLon == null){
        alert("Wybierz pozycje!");
    }
    if (typeof(Storage) !== "undefined"){
        if(searchedLat != "undefined" && searchedLon != "undefined" && searchedLon != null && searchedLat !=  null){
        localStorage.setItem("lat", searchedLat);
        localStorage.setItem("lon", searchedLon);
        console.log("lat "+localStorage.getItem("lat")+", long "+localStorage.getItem("lon"))
        }else{
            alert("Wybierz pozycje!"); 
        }
    }
}

document.getElementById("button_delete").addEventListener('click', deleteDefault);

function deleteDefault(){
    localStorage.removeItem("lat");
    localStorage.removeItem("lon");
}
//---------------------------------------


const searchInput = document.querySelector('.search>input')
const suggestions = document.querySelector('.suggestions')
const icon = document.querySelector('.weather-icon img')
const tempValue = document.querySelector('.temperature-value')
const description = document.querySelector('.temperature-description')
const locale = document.querySelector('.location')
const background = document.querySelector('.wrapper')
const topHeader = document.querySelector('.topHeader')
const hours = document.querySelectorAll('.hours')
const days = document.querySelectorAll('.days')

searchInput.addEventListener('change', displayMatches)
searchInput.addEventListener('keyup', displayMatches)
 



function directionFinder(deg) {
    if (deg<45 || deg>315) {
        return 'rotateX'
    } else if (deg>=45 && deg<135) {
        return 'rotateY'
    } else if (deg>=135 && deg<225) {
        return 'rotateX'
    } else {
        return 'rotateY'
    }
}

function backgroundFinder(description) {
    if (description == 'clear sky' || description == 'few clouds') {
        return 'url(./src/photo/sun.jpg)'
    } else if (description == 'snow') {
        return 'url(./src/photo/snow.jpg)'
    } else if (description == 'shower rain' || description == 'rain' || description == 'mist') {
        return 'url(./src/photo/rain.jpg)'
    } else if (description == 'thunderstorm') {
        return 'url(./src/photo/lightning.jpg)'
    } else return 'url(./src/photo/darkclouds.jpg)';
}

function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`
    let apiDays = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`

    notificationElement.style.display = 'none';

    fetch(api)
        .then(response => {
            let data = response.json()
            return data
        })
        .then(data => {
            icon.parentElement.style.setProperty('--tran0', `${directionFinder(data.wind.deg)}(0deg)`)
            icon.parentElement.style.setProperty('--tran1', `${directionFinder(data.wind.deg)}(360deg)`)
            icon.parentElement.style.animationDuration = `${15/Math.floor(data.wind.speed)}s`
            icon.setAttribute('src', `./src/icons/${data.weather[0].icon}.svg`)
            tempValue.innerText = `${data.main.temp}° C`
            description.innerText = data.weather[0].description
            locale.innerText = `${data.name}, ${data.sys.country}`
            background.style.background = backgroundFinder(data.weather[0].description)
            topHeader.style.backgroundColor = 'transparent'
        })

    fetch(apiDays)
        .then(response => {
            let data = response.json()
            return data
        })
        .then(data => {
            for (i=0; i<hours.length; i++) {
                hours[i].children[0].style.setProperty('--tran0', `${directionFinder(data.list[i+1].wind.deg)}(0deg)`)
                hours[i].children[0].style.setProperty('--tran1', `${directionFinder(data.list[i+1].wind.deg)}(360deg)`)
                hours[i].children[0].style.animationDuration = `${15/Math.floor(data.list[i+1].wind.speed)}s`
                hours[i].children[0].firstChild.setAttribute('src', `./src/icons/${data.list[i+1].weather[0].icon}.svg`)
                hours[i].children[1].innerText = `${data.list[i+1].main.temp}° C`
                hours[i].children[2].innerText = data.list[i+1].weather[0].description
                hours[i].children[3].innerText = data.list[i+1].dt_txt.slice(11,16)
            }
            for (i=0; i<days.length; i++) {
                days[i].children[0].style.setProperty('--tran0', `${directionFinder(data.list[7+i*8].wind.deg)}(0deg)`)
                days[i].children[0].style.setProperty('--tran1', `${directionFinder(data.list[7+i*8].wind.deg)}(360deg)`)
                days[i].children[0].style.animationDuration = `${15/Math.floor(data.list[7+i*8].wind.speed)}s`
                days[i].children[0].firstChild.setAttribute('src', `./src/icons/${data.list[7+i*8].weather[0].icon}.svg`)
                days[i].children[1].innerText = `${data.list[7+i*8].main.temp}° C`
                days[i].children[2].innerText = data.list[7+i*8].weather[0].description
                days[i].children[3].innerText = data.list[7+i*8].dt_txt.slice(5,10)
            }
        })
}





