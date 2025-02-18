function setupMap(drawMap, targetMap) {
    drawMap.on('draw.create', function(event) {
        var feature = event.features[0];
        var type = feature.geometry.type;
        var source = targetMap.getSource('drawn-features');
        var features = source._data.features;
        if (type === 'Polygon' || type === 'LineString' || type === 'Point') {
            features.push(feature);
        }
        source.setData({
            type: 'FeatureCollection',
            features: features
        });
    });

    drawMap.on('draw.update', function(event) {
        var feature = event.features[0];
        var source = targetMap.getSource('drawn-features');
        var features = source._data.features.map(function(f) {
            return f.id === feature.id ? feature : f;
        });
        source.setData({
            type: 'FeatureCollection',
            features: features
        });
    });

    drawMap.on('draw.delete', function(event) {
        var feature = event.features[0];
        var source = targetMap.getSource('drawn-features');
        var features = source._data.features.filter(function(f) {
            return f.id !== feature.id;
        });
        source.setData({
            type: 'FeatureCollection',
            features: features
        });
    });

    targetMap.on('load', function() {
        targetMap.addSource('drawn-features', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [] 
            }
        });

        targetMap.addLayer({
            id: 'drawn-features-polygons',
            type: 'fill',
            source: 'drawn-features',
            paint: {
                'fill-color': '#FF0000',
                'fill-opacity': 0.5,
                'fill-outline-color': 'rgba(255,0,0,1)'
            },
            filter: ['==', '$type', 'Polygon']
        });

        targetMap.addLayer({
            id: 'drawn-features-polylines',
            type: 'line',
            source: 'drawn-features',
            paint: {
                'line-color': '#FF0000',
                'line-width': 2
            },
            filter: ['==', '$type', 'LineString']
        });

        targetMap.addLayer({
            id: 'drawn-features-markers',
            type: 'circle',
            source: 'drawn-features',
            paint: {
                'circle-radius': 6,
                'circle-color': '#FF0000'
            },
            filter: ['==', '$type', 'Point']
        });
    });
}