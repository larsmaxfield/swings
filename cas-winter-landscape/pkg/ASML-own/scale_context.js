const max_zoomlvl = 7;
const pixels_per_zoomlvl = 512;
const max_pixels = pixels_per_zoomlvl*(2**max_zoomlvl)
const capture_size = 24; //24mm per individiual capture
const pixels_per_capture = 3072; 
const captured_area_size = max_pixels * (capture_size/pixels_per_capture) //size of painting in mm (for mockup 1: 256 mm = 25.6 cm)

function addXYDisplay(map) {
    map.on('mousemove', function (e) {
        const lngLat = e.lngLat;
        const mercatorCoord = mapboxgl.MercatorCoordinate.fromLngLat(lngLat);
        const true_size_x = mercatorCoord.x * captured_area_size;
        const true_size_y = mercatorCoord.y * captured_area_size;
        
        const xyDisplayElement = document.getElementById('xyDisplay');
        xyDisplayElement.innerHTML = `X: ${true_size_x.toFixed(2)}mm, Y: ${true_size_y.toFixed(2)}mm`;
        xyDisplayElement.style.fontSize = '12px'; // Set font size
    });
}


function toggleMinimap() {
    const minimapElement = document.getElementById('minimap-control');
    if (minimapElement) {
        if (minimapElement.style.display === 'none') {
            minimapElement.style.display = 'block';
        } else {
            minimapElement.style.display = 'none';
        }
    }
}