const terrainExaggeration = 8; // Good with 0.005 interval // 0 to inf
        const hillshadeExaggeration = 0.6; // Good with 0.005 interval //0 to 1
        const terrainTiles = ["../data-NOBACKUP/mockup-1/20230818_181639_stitched_height_terrain-rgb/{z}/{y}/{x}.png"];
        
        const terrainTileSize = 256;

        const terrainEncoding = "custom";
        const interval = 10;
        const baseShift = 0.0; // Will be subtracted from
        const redFactor = 256*256*interval;
        const greenFactor = 256*interval;
        const blueFactor = 1.0*interval;

        const webgl = new maplibregl.Map({
            container: 'webgl',
            hash: true,
            renderWorldCopies: false,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: ["../../data-NOBACKUP/mockup-1/20230818_181639_stitched_rgb_terrain-rgb/{z}/{y}/{x}.png"],
                        tileSize: 256,
                        attribution: 'Keyence Color & Height',
                    },
                    // Use a different source for terrain and hillshade layers, to improve render quality
                    terrainSource: {
                        type: 'raster-dem',
                        tiles: terrainTiles,
                        tileSize: terrainTileSize,
                        encoding: terrainEncoding,
                        redFactor: redFactor,
                        greenFactor: greenFactor,
                        blueFactor: blueFactor,
                        baseShift: baseShift,
                    },
                    hillshadeSource: {
                        type: 'raster-dem',
                        tiles: terrainTiles,
                        tileSize: terrainTileSize,
                        encoding: terrainEncoding,
                        redFactor: redFactor,
                        greenFactor: greenFactor,
                        blueFactor: blueFactor,
                        baseShift: baseShift,
                    }
                },
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm'
                    },
                    {
                        id: 'hills',
                        type: 'hillshade',
                        source: 'hillshadeSource',
                        layout: {visibility: 'visible'},
                        paint: { // https://maplibre.org/maplibre-style-spec/layers/#hillshade
                            'hillshade-illumination-anchor': "map", // default "viewport"
                            'hillshade-illumination-direction': 300, // default 335
                            'hillshade-highlight-color': '#ffffff', // default "#FFFFFF"
                            'hillshade-accent-color': '#000000', // default "#000000"
                            'hillshade-shadow-color': '#000000', // default "#000000"
                            'hillshade-exaggeration': hillshadeExaggeration // default 0.5
                        }
                    }
                ],
                terrain: {
                    source: 'terrainSource',
                    exaggeration: terrainExaggeration,
                }
            },
            maxZoom: 18,
            maxPitch: 85
        });

        webgl.addControl(
            new maplibregl.NavigationControl({
                visualizePitch: true,
                showZoom: true,
                showCompass: true
            })
        );

        webgl.addControl(
            new maplibregl.TerrainControl({
                source: 'terrainSource',
                exaggeration: terrainExaggeration,
            })
        );

        // Need to solve "Style not finished loading"; perhaps with 'map on load'?
        const delay = ms => new Promise(res => setTimeout(res, ms));
        const rakingLoop = async () => {
                for (let i = 270; i < 360; i++) {
                    map.setPaintProperty(
                        'hills',
                        'hillshade-illumination-direction',
                        i
                    )
                    if(i === 270) {
                        i=-1; continue;
                    }
                    await delay(20);
                };
            }

        setTimeout(function(){
            rakingLoop();
        }, 2000);

        // Slider for transparency of hillshade intensity

        setTimeout(function(){
            map.setPaintProperty(
                'hills',
                'hillshade-illumination-direction',
                0
            )
        }, 20);