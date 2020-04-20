var mapa;
var tipo;


function cargar_mapa() {
    mapa = new L.Map('mapa', { zoomControl: true });
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var layer_osm = new L.TileLayer(osmUrl, { maxZoom: 18, attribution: osmAttribution });
    mapa.setView(new L.LatLng(40.4165, -3.70256), 13).addLayer(layer_osm);
}


function elegirDireccion(lat, lng, tipo_osm) {

    var point = L.latLng(lat, lng);
    
    /*
    500 representa metros, pueden cambiarlo a discrecion, incluso colocar
    un popup para que el usuario pueda conltar a 500/800/1000
    */

    var bounds = point.toBounds(500); 

    var l1 = bounds['_southWest'];
    var l2 = bounds['_northEast'];

    var lat1 = l1.lat;
    var lat2 = l2.lat;
    var lng1 = l1.lng;
    var lng2 = l2.lng;
        
    
    if (tipo) {
        mapa.removeLayer(tipo);
    }
    if (tipo_osm == "node") {
        tipo = L.circle(loc1, 25, { color: 'green', fill: false }).addTo(mapa);
        mapa.fitBounds(bounds);
        mapa.setZoom(18);
    } 
    else {
        var loc3 = new L.LatLng(lat1, lng2);
        var loc4 = new L.LatLng(lat2, lng1);
        tipo = L.polyline([l1, loc4, l2, loc3, l1], { color: 'grey' }).addTo(mapa);
        mapa.fitBounds(bounds);
    }
    
    valor(l1,l2);
}



function direccion_buscador() {
    var entrada = document.getElementById("direccion");

    //$.getJSON('http://nominatim.OpenStreetMap.org/search?format=json&limit=5&q=' + entrada.value, function(data) {
    $.getJSON('http://nominatim.OpenStreetMap.org/search?format=json&countrycodes=es&limit=5&q=' + entrada.value, function(data) {    
        var direcciones = [];

        $.each(data, function(key, val) {
            bb = val.boundingbox;
            console.log("### Buscar direccions", val.lat, val.lon);
            //direcciones.push("<li><a href='#' onclick='elegirDireccion(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3] + ", \"" + val.tipo_osm + "\");return false;'>" + val.display_name + '</a></li>');
            direcciones.push("<li><a href='#' onclick='elegirDireccion(" + val.lat + ", " + val.lon  + ", \"" + val.tipo_osm + "\");return false;'>" + val.display_name + '</a></li>');
        });

        $('#resultado').empty();
        if (direcciones.length != 0) {
            $('<p>', { html: "Resultados de la b&uacute;queda:" }).appendTo('#resultado');
            $('<ul/>', {
                'class': 'my-new-list',
                html: direcciones.join('')
            }).appendTo('#resultado');
        } else {
            $('<p>', { html: "Ningun resultado encontrado." }).appendTo('#resultado');
        }

    });
}


function valor(loc1, loc2) {
    $.ajax({
        data: { 'lat1': loc1.lat, 'lon1': loc1.lng, 'lat2': loc2.lat, 'lon2': loc2.lng,},
        url: '/BusquedaAjax/',
        type: 'get',
        success: function(data) {
            console.log("consulta hecha")

            var parkIcon = L.icon({
                iconUrl: '/static/img/car.png',
                // shadowUrl: '/static/img/marker-shadow.png',
                iconSize: [35, 35],
                // shadowSize:[30, 44],
            });


            for(var i = 0; i < data.length; i++){
            L.marker([data[i].fields.lat, data[i].fields.lon], {icon: parkIcon}).bindPopup("Nombre:" +" "+ data[i].fields.name +"<br>"+ "Dirección:" +" "+ data[i].fields.address).addTo(mapa);
            }
        }
        
    });
}

window.onload = cargar_mapa;