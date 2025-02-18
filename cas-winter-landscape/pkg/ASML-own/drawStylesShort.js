const drawStylesShort = [
    {
        'id': 'red-points',
        'type': 'circle',
        'paint': {
            'circle-radius': 5,
            'circle-color': '#ff0000'
        },
        'filter': ['all', ['==', '$type', 'Point'], ['!=', 'mode', 'static']]
    },
    {
        'id': 'red-lines',
        'type': 'line',
        'paint': {
            'line-color': '#ff0000',
            'line-width': 2
        },
        'filter': ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']]
    },
    {
        'id': 'red-polygons',
        'type': 'fill',
        'paint': {
            'fill-color': '#ff0000', 
            'fill-outline-color': '#ff0000', 
            'fill-opacity': 0.1
        },
        'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']]
    }
]