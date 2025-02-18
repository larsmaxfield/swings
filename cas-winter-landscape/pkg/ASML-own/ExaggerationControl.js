let exaggerationValue = 1; 
const toggleButtonHTML = '<button class="toggle-button"><img id="exaggerationToggle" src="img/circle_halve.svg" title="Disable hillshading"></button>';

class ExaggerationControl {
    constructor(map) {
        this._map = map;
    }

    onAdd() {
        this._container = document.createElement('div');
        this._container.innerHTML = toggleButtonHTML;
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        this._container.onclick = () => this.toggleExaggeration();
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

    toggleExaggeration() {
        exaggerationValue = exaggerationValue === 0 ? 1 : 0;
        const image = document.getElementById('exaggerationToggle');
        image.src = exaggerationValue ? 'img/circle_halve.svg' : 'img/circle-regular.svg';
        image.title = exaggerationValue ? 'Disable hillshading': 'Enable hillshading';
        this.setExaggeration(exaggerationValue);
    }

    setExaggeration(value) {
        const hillshadeLayer = this._map.getLayer('hills'); 
        if (hillshadeLayer) {
            this._map.setPaintProperty('hills', 'hillshade-exaggeration', value);
        }
    }
}