class LightAngleToggleControl {
    constructor(map) {
        this._map = map;
        this._container = null;
        this._state = 'default'; 
        this._currentAngle = 0; 
        this._mouseMoveHandler = this.handleMouseMove.bind(this);
        this._arrow = null;
    }

    onAdd() {
        this._container = document.createElement('div');            
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        this._container.innerHTML = 
            '<button class="light-button"><img id="toggle-image-only" src="img/lightbulb-regular.svg" title="Enable Light Angle"></button>';
        this._container.onclick = () => this.toggleLightAngle();

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

    toggleLightAngle() {
        const image = document.getElementById('toggle-image-only');
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
        const mouseX = e.point.x / this._map.getCanvas().clientWidth;
        const mouseY = e.point.y / this._map.getCanvas().clientHeight;
        const mapCenterX = 0.5;
        const mapCenterY = 0.5;
        const deltaX = mouseX - mapCenterX;
        const deltaY = mouseY - mapCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        const angleDegrees = angle * (180 / Math.PI);
        const lightAngle = (angleDegrees + 90) % 360;
        this._map.setPaintProperty('hills', 'hillshade-illumination-direction', lightAngle);
    }
}