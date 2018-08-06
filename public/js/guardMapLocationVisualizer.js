(function (f) {
    if (typeof module != 'undefined' && typeof exports != 'undefined')
        throw new Error('Cannot run in Node environment, dom dependent')
    f()
})(function () {

    (async function () {
        return await fetch('/data/retrieveGuardDataFromFirebase').then(res => res.json()).then(guardCoordinatesData => {
            let guardDetails = []
            for (const guard in guardCoordinatesData) {
                guardDetails.push({
                    guardId: guard,
                    coordinates: guardCoordinatesData[guard][guardCoordinatesData[guard].length - 1]
                })
            }
            reDrawMapMarkers(guardDetails)
        })
    })()

    var map = new google.maps.Map(document.getElementById('guardMapLocationVisualizer'), {
        zoom: 11,
        center: {
            lat: -1.389324,
            lng: 37.7636423 // just this bit, center of the map should be one of the cordinates from incoming data
        }
    })

    window.drawInfoWindow = content => {
        if (typeof content == 'undefined')
            return new google.maps.InfoWindow()
        return new google.maps.InfoWindow({
            content: content
        })
    }

    var markers = []

    async function reDrawMapMarkers(data) {
        for await (const guard of data) {
            var marker = new google.maps.Marker({
                position: {
                    lat: guard['coordinates'].lat,
                    lng: guard['coordinates'].lng
                },
                map: map,
                draggable: true,
                animation: google.maps.Animation.BOUNCE,
                icon: {
                    url: 'https://cdn3.iconfinder.com/data/icons/softwaredemo/PNG/32x32/DrawingPin1_Blue.png'
                },
                title: guard['coordinates'].time
            })

            marker.addListener('click', function () {
                if (this.getAnimation() !== null) {
                    this.setAnimation(null)
                } else {
                    this.setAnimation(google.maps.Animation.BOUNCE)
                }
            })
            marker.addListener('mouseover', function () {
                map.setCenter(this.getPosition())
                window.drawInfoWindow(data['guardId']).open(this.get('map'), this)
            })
            marker.addListener('mouseout', function () {
                window.drawInfoWindow().close()
            })
            markers.push(marker)
        }
    }

    let socket = new WebSocket('ws://127.0.0.1:5000')
    socket.addEventListener('open', function (event) {
        // socket open,
        // send data to server when appropriate
    })
    socket.addEventListener('message', async function (event) {
        let guardDetails = [],
            data = JSON.parse(event.data)
        try {
            for (const guard in data) {
                guardDetails.push({
                    guardId: guard,
                    coordinates: data[guard][data[guard].length - 1]
                })
            }
        } catch (e) {}

        for await (const marker of markers) {
            marker.setMap(null)
            markers = []
        }

        reDrawMapMarkers(guardDetails)
    })
})