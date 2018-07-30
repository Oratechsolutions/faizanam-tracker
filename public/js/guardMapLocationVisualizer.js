(function (f) {
    if (typeof module != 'undefined' && typeof exports != 'undefined')
        throw new Error('Cannot run in Node environment, dom dependent')
    f()
})(function () {

    async function rerenderMap() {
        return await fetch('/data/retrieveGuardDataFromFirebase').then(res => res.json()).then(data => {
            let filteredCoords = Array.from(data).map(coordinates => ({
                lat: coordinates.lat,
                lng: coordinates.lng
            }))
            return filteredCoords
        })
    }

    rerenderMap().then(async data => {

        let map = new google.maps.Map(document.getElementById('guardMapLocationVisualizer'), {
            zoom: 15,
            center: {
                lat: data[0].lat,
                lng: data[0].lng
            }
        })

        for await (const coordinate of data) {
            new google.maps.Marker({
                position: {
                    lat: coordinate.lat,
                    lng: coordinate.lng
                },
                map: map
            })
        }
    })

    var ws;

    if (typeof WebSocket !== 'undefined') {
        ws = WebSocket;
    } else if (typeof MozWebSocket !== 'undefined') {
        ws = MozWebSocket;
    } else {
        ws = window.WebSocket || window.MozWebSocket;
    }

    let socket = new WebSocket('ws://127.0.0.1:5000')
    socket.addEventListener('open', function (event) {
        console.log(event.target)
    })
    socket.onmessage=function(message){
    
    }
})