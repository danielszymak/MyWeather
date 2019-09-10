import "./js/search.js"
import "./js/script.js"
import "./css/style.css"

var button1 = document.getElementById("showWeather").addEventListener('click', buttonClick);

function buttonClick(){
    document.querySelector('.title').style.display= 'none';
    document.querySelector('.content').style.display= 'block';
    //document.getElementById('otherCity').style.display='block';
    //document.getElementById('settings').style.display='grid';
    //if (document.querySelector('.precipitation').textContent == '0.0 mm/h ') {
        //document.querySelector('.weatherPresentation').style.backgroundImage = 'url(./src/photos/slonecznapogoda2.jpg)';
        //document.querySelector('.weatherPresentation').style.color = 'black';
    //} else if (document.querySelector('.precipitation').textContent != '0.0 mm/h ') {
        //document.querySelector('.weatherPresentation').style.backgroundImage = 'url(./src/photos/deszcz1.jpg)';
        //document.querySelector('.weatherPresentation').style.color = 'white';
    //}
}





