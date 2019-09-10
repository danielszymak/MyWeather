const endpoint = 'https://raw.githubusercontent.com/cc-team-2019/weather-APP/master/src/miasta.json';
const cities = [];
let searchedLat;
let searchedLon;

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
            return searchInput.value = e.currentTarget.innerText
        })
    })
 
}

const searchInput = document.querySelector('.search>input')
const suggestions = document.querySelector('.suggestions')

searchInput.addEventListener('change', displayMatches)
searchInput.addEventListener('keyup', displayMatches)
 
