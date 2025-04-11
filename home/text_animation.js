/*
    * Text Animation 
*/

/*
if (window.localStorage.getItem("firstTime") == null) {
    window.localStorage.setItem("firstTime", "false");
    OpeningText();
}
    */


function OpeningText() {
    console.log("Text");
    let text1 = $Q(".main-title > h2");
    let text2 = $Q(".main-title > h1");
    let text3 = $Q(".main-title > h3");
    ReplaceTextWithSpans(text1, "inline-block");
    ReplaceTextWithSpans(text2, "inline-block");
    ReplaceTextWithSpans(text3, "inline-block");

    SetSpansScaleZero(text1);
    SetSpansScaleZero(text2);
    SetSpansScaleZero(text3);

    GrowAndShrinkText(text1, 500);
    setTimeout(() => {
        GrowAndShrinkText(text2, 1000);
    }, 750);
    setTimeout(() => {
        GrowAndShrinkText(text3, 500);
    }, 1500);
}



function GrowAndShrinkText(element, duration) {
    let spans = element.querySelectorAll("span");
    let delay = duration / spans.length;
    let largestScale = 1.75;
    //let constant = 0.835; //2
    let constant = 0.812; //1.75
    //let constant = 0.7677; //1.5
    let startTime = null;

    function animate(time) {
        if (!startTime) startTime = time;
        let elapsed = time - startTime;

        spans.forEach((span, index) => {
            let progress = (elapsed - index * delay) / duration;
            let scale = largestScale * Math.sin(clamp(progress, 0, 1) * constant * Math.PI);
            span.style.transform = `scale(${scale})`;
        });

        if (elapsed < duration + delay * spans.length) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function SetSpansScaleZero(element){
    let spans = element.querySelectorAll("span");
    spans.forEach(span => {
        span.style.transform = `scale(0)`;
    });
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {string} className
 */
function ReplaceTextWithSpans(element, className = "") {
    let text = element.innerText;
    element.innerHTML = "";

    for (let i = 0; i < text.length; i++) {
        const chr = text[i];
        let sp = document.createElement("span");
        sp.innerText = chr;
        sp.className = className;
        element.appendChild(sp);
    }
}


//OpeningText();



function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}