const intToPx = (val) => val.toString() + 'px';

// https://stackoverflow.com/a/53601942/20921535
function domReady(fn) {
    // If we're early to the party
    document.addEventListener("DOMContentLoaded", fn);
    // If late; I mean on time.
    if (document.readyState === "interactive" || document.readyState === "complete" ) {
        fn();
    }
}
// domReady(() => console.log("DOM is ready, come and get it!"));

document.addEventListener('mousemove', e=> {
    const root = document.querySelector(':root');
    const pageX = parseInt(e.pageX)
    const pageY = parseInt(e.pageY)

    // Set lens radius
    const lensRadius = parseInt(getComputedStyle(root).getPropertyValue('--lens-radius'));
    
    const mainContent = document.getElementById('before').getBoundingClientRect();
    // Replace with this if lens placed outside content element: const mainContentParentRect = document.getElementById('before').parentElement.getBoundingClientRect();

    const contentTop = mainContent.top
    const contentLeft = mainContent.left

    const lensTop = pageY - lensRadius - contentTop;
    const lensLeft = pageX - lensRadius - contentLeft;

    const lensTopPx = intToPx(lensTop);
    const lensLeftPx = intToPx(lensLeft);
    root.style.setProperty('--lens-top', lensTopPx);
    root.style.setProperty('--lens-left', lensLeftPx);

    const pageYPx = intToPx(pageY)
    const pageXPx = intToPx(pageX)
    root.style.setProperty('--mouse-page-y', pageYPx)
    root.style.setProperty('--mouse-page-x', pageXPx)
});


domReady(() => {
    const mainContent = document.getElementById('before');
    const lensContent = document.getElementById('after');
    const positionInfo = mainContent.getBoundingClientRect();
    const top = positionInfo.top;
    const left = positionInfo.left;
    const height = positionInfo.height;
    const width = positionInfo.width;
    lensContent.style.top = intToPx(top);
    lensContent.style.left = intToPx(left);
    lensContent.style.height = intToPx(height);
    lensContent.style.width = intToPx(width);

    lensContentResizer.observe(mainContent);  // Resizing is listened to...
    // lensContentRepositioner // But repositioning is not listened to
})

// https://web.dev/articles/resize-observer
var lensContentResizer = new ResizeObserver(entries => {
    updateLensContent();
});

const updateLensContent = () => {
    const mainContentElement = document.getElementById('before');
    const lensContentElement = document.getElementById('after');
    const mainRect = mainContentElement.getBoundingClientRect();
    const top = mainRect.top;
    const left = mainRect.left;
    const height = mainRect.height;
    const width = mainRect.width;
    lensContentElement.style.top = intToPx(top);
    lensContentElement.style.left = intToPx(left);
    lensContentElement.style.height = intToPx(height);
    lensContentElement.style.width = intToPx(width);
};
