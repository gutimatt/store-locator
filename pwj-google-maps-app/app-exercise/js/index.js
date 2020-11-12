let map;
var infoWindow;
var markers = [];

console.log('90036')
console.log('90048')


function initMap() {
    let location = {
        lat: 34.063380,
        lng: -118.358080
    }
    map = new google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 11,
    });
    infoWindow = new google.maps.InfoWindow
}

const onEnter = (e) => {
    if (e.key == 'Enter'){
        getStores()
    }
}


const getStores = () => {
    const zipCode = document.getElementById('zip-code').value;
    if (!zipCode) {
        return
    }
    const API_URL = `http://localhost:3000/api/stores`
    const FULL_URL = `${API_URL}?zip_code=${zipCode}`
    fetch(FULL_URL)
        .then((response) => {
            return response.json();
        }).then((data) => {
            if (data.length > 0){
                clearLocations();
                searchLocationsNear(data);
                setStoresList(data);
                setOnClickListener()
            }else{
                clearLocations();
                noStoresFound();
            }

        });
}

const noStoresFound = () => {
    const html = `
        <div class="no-stores-found">
            No stores found
        </div>
    `

    document.querySelector('.stores-list-container').innerHTML = html
}

const setOnClickListener = () => {
    let storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach((elem, index) => {
        elem.addEventListener('click', () => {
            google.maps.event.trigger(markers[index], 'click');
        })
    })
}

const clearLocations = () => {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

const searchLocationsNear = (stores) => {
    let bounds = new google.maps.LatLngBounds();

    stores.forEach((store, index) => {
        let latlng = new google.maps.LatLng(
            store.location.coordinates[1],
            store.location.coordinates[0]);
        let name = store.name;
        let addressLines1 = store.addressLines[0]
        let openStatusText = store.openStatusText
        let phone = store.phoneNumber
        bounds.extend(latlng);
        createMarker(latlng, name, addressLines1, openStatusText, phone, index + 1);
    });
    map.fitBounds(bounds);

}

const setStoresList = (stores) => {
    let storesHTML = '';
    stores.forEach((store, index) => {
        storesHTML += `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-name">
                            ${store.name}
                        </div>
                        <div class="store-address-container"> 
                            <span>
                                ${store.addressLines[0]}
                            </span>
                            <span>
                                ${store.addressLines[1]} 
                            </span>
                        </div>
                        <div class="store-phone-number">
                            <a href="tel:${store.phoneNumber}"> ${store.phoneNumber} </a>
                        </div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index + 1 }
                        </div>
                    </div>
                </div>
            </div> 
        `
    })

    document.querySelector('.stores-list-container').innerHTML = storesHTML;
}



const createMarker = (latlng, name, addressLines1, openStatusText, phone, storeNumber) => {
    let html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-open-status">
                ${openStatusText}
            </div>
            <div class="store-info-address">
                <div class="icon">
                    <i class="fas fa-location-arrow"></i>
                </div>
                <span>
                    ${addressLines1}
                </span>
            </div>
            <div class="store-info-phone">
                <div class="icon">
                    <i class="fas fa-phone-alt"></i>
                </div>
                <span>
                    <a href="tel:${phone}">${phone}</a>
                </span>
            </div>

        </div>
    `
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        label: `${storeNumber}`
    });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker)
}