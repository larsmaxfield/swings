function slideOne() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderOne.value = parseInt(sliderTwo.value) - minGap;
    }
    displayValOne.textContent = sliderOne.value;
    fillColor();
    updateMapBreakpoints();
}

function slideTwo() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderTwo.value = parseInt(sliderOne.value) + minGap;
    }
    displayValTwo.textContent = sliderTwo.value;
    fillColor();
    updateMapBreakpoints();
}

function fillColor() {
    let percent1 = (sliderOne.value / sliderMaxValue) * 100;
    let percent2 = (sliderTwo.value / sliderMaxValue) * 100;
    sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #000000 ${percent1}% , #000000 ${percent2}%, #dadae5 ${percent2}%)`;
}

function updateMapBreakpoints() {
    const low = parseFloat(sliderOne.value);
    const high = parseFloat(sliderTwo.value);

    height.setPaintProperty('elevs', 'elevation-colormap-breakpoint-low', low);
    height.setPaintProperty('elevs', 'elevation-colormap-breakpoint-high', high);
}

fillColor();