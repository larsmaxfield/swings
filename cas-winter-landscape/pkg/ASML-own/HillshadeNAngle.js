class HillshadeNAngle {
    constructor(map) {
        this._map = map;
        this._container = null;
        this._state = 'default'; 
        this._currentAngle = 0; 
        this._mouseMoveHandler = this.handleMouseMove.bind(this);
        this._exaggerationValue = 1; 
    }

    onAdd() {
        this._container = document.createElement('div');            
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

        // Hillshade Exaggeration Toggle Button
        const exaggerationButton = document.createElement('button');
        exaggerationButton.className = 'toggle-button';
        exaggerationButton.innerHTML = '<img id="exaggerationToggle" src="img/circle_halve.svg" title="Disable hillshading">';
        exaggerationButton.onclick = () => this.toggleExaggeration();
        this._container.appendChild(exaggerationButton);

        // Light Angle Toggle Button
        const lightButton = document.createElement('button');
        lightButton.className = 'light-button';
        lightButton.innerHTML = '<img id="toggle-image" src="img/lightbulb-regular.svg" title="Enable Light Angle">';
        lightButton.onclick = () => this.toggleLightAngle();
        this._container.appendChild(lightButton);

        const lightButton2 = document.createElement('pijl');
        lightButton2.className = 'arrow-direction';
        lightButton2.innerHTML = '<img id="pijl" src="img/arrow-right-solid.svg" title="Raking light direction">';
        this._container.appendChild(lightButton2);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

    toggleExaggeration() {
        this._exaggerationValue = this._exaggerationValue === 0 ? 1 : 0;
        const image = document.getElementById('exaggerationToggle');
        image.src = this._exaggerationValue ? 'img/circle_halve.svg' : 'img/circle-regular.svg';
        image.title = this._exaggerationValue ? 'Disable hillshading' : 'Enable hillshading';
        this.setExaggeration(this._exaggerationValue);
    }

    setExaggeration(value) {
        const hillshadeLayer = this._map.getLayer('hills'); 
        if (hillshadeLayer) {
            this._map.setPaintProperty('hills', 'hillshade-exaggeration', value);
        }
    }

    toggleLightAngle() {
        const image = document.getElementById('toggle-image');
        if (this._state === 'default') {
            this._map.setPaintProperty('hills', 'hillshade-illumination-direction', this._currentAngle);
            this._state = 'mouse';

            this._map.on('mousemove', this._mouseMoveHandler);
            image.src = 'img/lightbulb-solid.svg';
            image.title = 'Disable Light Angle';
        } else {
            this._currentAngle = this._map.getPaintProperty('hills', 'hillshade-illumination-direction');

            this._map.off('mousemove', this._mouseMoveHandler);
            this._state = 'default';
            image.src = 'img/lightbulb-regular.svg';
            image.title = 'Enable Light Angle';
        }
    }

    handleMouseMove(e) {
        //
        //   +x
        //    ^     ·
        //    |    /
        //    | θ /
        //    |  /
        //    | /
        //    |/
        //————+———————————> +y
        //    |
        //
        const mouseX = e.point.x / this._map.getCanvas().clientWidth;
        const mouseY = e.point.y / this._map.getCanvas().clientHeight;
        const mapCenterX = 0.5;
        const mapCenterY = 0.5;
        const deltaX = mouseX - mapCenterX;
        const deltaY = mouseY - mapCenterY;
        const angle = Math.atan2(-deltaX, deltaY);  // Considered in a clockwise angle coordinate system where 0 degrees is pointing upwards
        const angleDegrees = angle * (180.0 / Math.PI);
        const lightAngle = Math.floor((angleDegrees + 180) % 360);  // Shift angle into range [0, 360) to match the input range for hillshade direction
        this._map.setPaintProperty('hills', 'hillshade-illumination-direction', lightAngle);
        
        // Calculate the rotation angle for the arrow
        const arrowAngle = (lightAngle + 270) % 360;

        const pijl = document.getElementById('pijl');
        pijl.style.transform = `rotate(${arrowAngle}deg)`;
    }
}    