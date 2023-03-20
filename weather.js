let key = '8596a6884998aa0936f55810263394e2'
let history = []
let timeNow = new Date().getHours()
let fetch_result = false
console.log(timeNow, 'hour')

$('#submit').on('click', locate)
$('#resetHistory').on('click', function () { //only clear the history
    $('#history').empty()
})

$('#reset').on('click',  function () {  //clear the page, not including history
    $('#current').empty()
    $('#future').empty()
    $('#city_names').empty()
})

function noCityFound(situation) {
    if (situation)
        alert("Please use a valid city name")
    else 
        alert("Please input a city")
}

function locate() {
    let city = $(this).siblings('#city').val()
    console.log(city)
    cities(city)

}

function cities(name) {
    let url, encoded;
    //console.log(name)
    if (name) {
    
        encoded = encode(name)
        url = new URL('http://api.openweathermap.org/geo/1.0/direct?q='+encoded+'&limit=50&appid='+ key)
        //console.log(url)
        fetch(url,{method :'GET'})
            .then(response =>response.json())
            .then(list =>display(list,'cities', ''))
            .catch(err =>noCityFound(true)); 
            
        
    } else {
        noCityFound(false)
    }
}

function display(list, id, city) {
    if (id == 'cities') {
        $('#current').empty()
        $('#future').empty()
        $('#city_names').empty()
        let loc;
        let region_names = new Intl.DisplayNames(['en'], { type: 'region' });   //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames
        console.log(list)
        console.log(list[0].name)
        fetch_result = true
        if (!history.includes(list[0].name) && fetch_result) {
            
            history.push(list[0].name)
            $('#history').append("<button class = '"+list[0].name+"'>" +list[0].name+"</button>")
            $('.'+list[0].name).on('click', function() {cities(list[0].name)})
            //console.log(history, 'history')
        }
        for (let i = 0; i < list.length; i++) {
            loc = list[i].name + ', State of '+ list[i].state + ', In the Country of ' + region_names.of(list[i].country)
            console.log(loc)
            $('#city_names').append("<button class = 'item"+i+"'>"+loc+'</button>')
            $('#city_names').append('<br>')
            $(".item"+i).one('click', function() {weathers(list[i].lat, list[i].lon, list[i].name + ', ' + list[i].state)})
        }
        fetch_result = false
        
    } else if (id == 'weather') {

        $('#city_names').empty()
        
        
        //console.log(list, 'test')
        let city_name = city.split(',')[0]
        console.log(city_name, 'test split')
        $('#current').append("<h3>Today's weather at "+city+
            "  <button id = 'return'> Back to Search Result</button></h3>")
        $('#return').on('click', function() {cities(city_name)})
        
        if (timeNow % 3 == 0) {
            current = timeNow / 3 + 1
            
        } else {
            current = timeNow % 3
            
        }
        showWeather(list[Math.floor(timeNow / 3) + 1 ], '#current', true)
        
        $('#current').append("<hr>")
        for (let i = 8; i < list.length; i +=8) {
            showWeather(list[i], '#future', false)
            $('#future').append("<br>")
        }
    }

}

function weathers(lat, lon, city) {
    let url = new URL('http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&appid='+key)
    fetch(url,{method :'GET'})
        .then(response => response.json())
        .then(response => display(response.list,'weather', city))
                
}   

function encode(item) {
    
    return encodeURIComponent(item.trim())
}

function showWeather(obj, id, hour) {
    
    if (hour) {
        $(id).append("<div>"+obj.dt_txt+"</div>")
    } else {
        $(id).append("<div>"+obj.dt_txt.substr(0,10)+"</div>")
    }
    $(id).append("<div>Temperature: " + convert(obj.main.temp) + ' F</div>')
    $(id).append("<div>Feels like " + convert(obj.main.feels_like) + ' F</div>')
    $(id).append("<div>Highest at " + convert(obj.main.temp_max) + ' F</div>')
    $(id).append("<div>Lowest at " + convert(obj.main.temp_min) + ' F</div>')
    $(id).append("<div>Humidity: " + obj.main.humidity + '%</div>')
}
//weathers(44.34,10.99)
function convert(f) {
    return Math.floor((((f-273.15)*1.8)+32) *10) / 10
}