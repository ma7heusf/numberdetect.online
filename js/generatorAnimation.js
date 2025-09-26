console.log("Carrega script Gerador de animações");

async function GeneratorAnimation(jsonAnimation){
    animationTimeLine = gsap.timeline().pause()
    animationTimeLine.pause()
    modelVH = modalElement.clientHeight;
    modelVW = modalElement.clientWidth;
    console.log(modalElement);
    console.log(modelVH, modelVW);
    
    jsonAnimation.forEach(item =>{
        animationFrame(item, animationTimeLine)
    })
    
}