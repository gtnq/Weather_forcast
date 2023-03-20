let key = '8596a6884998aa0936f55810263394e2'
let history = []

$('#submit').on('click', locate)

function removechild (){ 
    while(historys.firstChild)
        historys.removeChild(historys.lastChild)
}

function locate() {
    let city = $(this).siblings('#city').val()
    console.log(city)
    cities(city)

}

function cities(name) {
    let url;
    //console.log(name)
    if (name) {
    
        name = encode(name)
        url = new URL('http://api.openweathermap.org/geo/1.0/direct?q='+name+'&limit=50&appid='+ key)
        console.log(url)
        fetch(url,{method :'GET'})
            .then(response => response.json())
            .then(list => display(list,'cities'))
                
            .catch(err => console.error(err));
        if (!history.includes(name)) {
            //console.log(history)
            history.push(name)
            $('#history').append('<button>'+name+'</button>').on('click', function() {cities(name)})
        }
    }
}

function display(list, id) {
    if (id == 'cities') {
        $('#current').empty()
        $('#future').empty()
        let loc;
        let region_names = new Intl.DisplayNames(['en'], { type: 'region' });   //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames
        console.log(list)
        for (let i = 0; i < list.length; i++) {
            loc = list[i].name + ', State of '+ list[i].state + ', In the Country of ' + region_names.of(list[i].country)
            console.log(loc)
            $('#city_names').append('<button>'+loc+'</button>')
            $('#city_names').append('<br>')
        }
        
    } else if (id == 'weather') {
        $('#city_names').empty()
        console.log(list)
    }

}

function weathers(lat, lon) {
    let url = new URL('http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&appid='+key)
    fetch(url,{method :'GET'})
        .then(response => response.json())
        .then(response => display(response.list,'weather'))
                
}   

function encode(item) {
    
    return encodeURIComponent(item.trim())
}
weathers(44.34,10.99)
function convert(f) {
    return ((f-273.15)*1.8)+32
}