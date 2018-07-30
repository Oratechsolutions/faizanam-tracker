(function (f) {
    if (typeof module != 'undefined' && typeof exports != 'undefined')
        throw new Error('Cannot run in Node environment, dom dependent')
    f()
})(function () {

    async function mapRenderer() {
        return await fetch('/data/retrieveGuardDataFromFirebase').then(res => res.json()).then(data => {
            let filteredCoords = Array.from(data).map(coordinates => ({
                lat: coordinates.lat,
                lng: coordinates.lng
            }))
            return filteredCoords
        })
        return [{
            lat: 1.2921,
            lng: 36.8219,
            title: 'Guard 001-GRD'
        }, {
            lat: 1.1921,
            lng: 36.7800,
            title: 'Guard 001-GRD'
        }, {
            lat: 1.1951,
            lng: 36.8219,
            title: 'Guard 001-GRD'
        }]
    }

    mapRenderer().then(async data => {

        var map = new google.maps.Map(document.getElementById('guardMapLocationVisualizer'), {
            zoom: 11,
            center: {
                lat: data[0].lat,
                lng: data[0].lng
            }
        })

        window.drawInfoWindow = content => {
            if (typeof content == 'undefined')
                return new google.maps.InfoWindow()
            return new google.maps.InfoWindow({
                content: content
            })
        }
        for await (const coordinate of data) {
            var marker = new google.maps.Marker({
                position: {
                    lat: coordinate.lat,
                    lng: coordinate.lng
                },
                map: map,
                draggable: true,
                animation: google.maps.Animation.BOUNCE,
                icon: {
                    url: 'https://cdn3.iconfinder.com/data/icons/softwaredemo/PNG/32x32/DrawingPin1_Blue.png'
                },
                title: coordinate.title
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
                window.drawInfoWindow('Guard 001').open(this.get('map'), this)
            })
            marker.addListener('mouseout', function () {
                widnow.drawInfoWindow().close()
            })
        }
    })

    let socket = new WebSocket('ws://127.0.0.1:5000')
    socket.addEventListener('open', function (event) {
        socket.send('Heeey')
        console.log(event)
    })
    socket.addEventListener('message', function (event) {
        console.log(event.data)
    })
})