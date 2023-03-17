let key = '8596a6884998aa0936f55810263394e2'

$('#submit').on('click', locate)

function locate() {
    let city = $(this).siblings('#city').val()
    console.log(city)
    cities(city)

}

function cities(name) {
    let url;
    
    name = encode(name)
    url = new URL('http://api.openweathermap.org/geo/1.0/direct?q='+name+'&limit=50&appid='+ key)
    console.log(url)
    fetch(url,{method :'GET'})
        .then(response => response.json())
        .then(list => display(list,'cities'))
            
        .catch(err => console.error(err));
    
}

function display(list, id) {
    if (id == 'cities') {
        let loc;
        let region_names = new Intl.DisplayNames(['en'], { type: 'region' });   //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames
        console.log(region_names)
        for (let i = 0; i < list.length; i++) {
            loc = 'City: ' + list[i].name + ', State of '+ list[i].state + ', In the Country of ' + region_names.of(list[i].country)
            console.log(loc)
        }
        
    } 
}

function encode(item) {
    
    return encodeURIComponent(item.trim())
}
