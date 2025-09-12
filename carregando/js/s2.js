(function() {

    // Initialize global atomicPlayer object if it doesn't exist
    if (typeof window.atomicPlayer === 'undefined') {
        window.atomicPlayer = {
            instances: [],
            
            // Find specific player by ID
            findById: function(videoId) {
                return this.instances.find(instance => instance.id === videoId);
            },
            
            // Pause all players
            pauseAll: function() {
                this.instances.forEach(instance => {
                    try {
                        if (!instance.paused()) {
                            instance.pause();
                        }
                    } catch(e) {
                        console.log('Error pausing atomic player:', e);
                    }
                });
            },
            
            // Clean up specific player
            dispose: function(videoId) {
                const index = this.instances.findIndex(instance => instance.id === videoId);
                if (index !== -1) {
                    const instance = this.instances[index];
                    try {
                        if (instance.player && typeof instance.player.dispose === 'function') {
                            instance.player.dispose(); // Clean up video.js instance
                        }
                    } catch(e) {
                        console.log('Error disposing atomic player:', e);
                    }
                    this.instances.splice(index, 1); // Remove from array
                }
            }
        };
    }

    // Get the Player Settings
    const currentScript = document.currentScript;
    const queryString = currentScript.src.replace(/^[^\?]+\??/, '');
    const curUrlParams = new URLSearchParams(queryString);

    // Video.js resources loading
    if (!document.querySelector('link[href*="video-js.min.css"]')) {
        const cssLink = document.createElement('link');
        cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/video.js/8.5.2/video-js.min.css';
        cssLink.rel = 'stylesheet';
        document.head.appendChild(cssLink);
    }

    if (!document.querySelector('script[src*="video.min.js"]')) {
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/video.js/8.5.2/video.min.js';
        scriptTag.async = true;
        document.head.appendChild(scriptTag);
    }

    const vid = curUrlParams.get('id')
    const videoInterval = setInterval(() => {
        if(videojs(vid)){
            clearInterval(videoInterval);
            const streamPlayer = document.getElementById(vid).querySelector('video')
            const atomicatPlayer = document.getElementById(vid)
            // const vParams = {}
            // if(atomicatPlayer.getAttribute('muted')){
            //     vParams.muted = true
            // }
            // if(atomicatPlayer.getAttribute('autoplay')){
            //     vParams.autoplay = true
            // }
            const player = videojs(vid)
            streamPlayer.setAttribute("playsinline", "")
            const playerWidth = player.width() == 0 ? '100' : player.width()
            const playerHeight = player.height() == 0 ? '100' : player.height()
            
            // Register this player instance in global atomicPlayer object
            const playerInstance = {
                id: vid.replace("_", ""),
                player: player,
                element: atomicatPlayer,
                paused: () => player.paused(),
                pause: () => player.pause(),
                play: () => player.play().catch(() => {
                    player.muted(true);
                    player.play();
                }),
                currentTime: (time) => time !== undefined ? player.currentTime(time) : player.currentTime(),
                dispose: () => {
                    try {
                        player.dispose();
                    } catch(e) {
                        console.log('Error disposing player:', e);
                    }
                },
                muted: (muted) => muted !== undefined ? player.muted(muted) : player.muted(),
                volume: (vol) => vol !== undefined ? player.volume(vol) : player.volume()
            };
            
            // Add to global instances array
            window.atomicPlayer.instances.push(playerInstance);
            
            // Clean up instance when player is disposed
            player.on('dispose', () => {
                const index = window.atomicPlayer.instances.findIndex(instance => instance.id === vid.replace("_", ""));
                if (index !== -1) {
                    window.atomicPlayer.instances.splice(index, 1);
                }
            });
            
            const MEDIA_HOST = "https://media.atomicatpages.net/" // https://img.imageboss.me/
            const BASE_IMGURL = MEDIA_HOST.includes("img.imageboss.me") ? `${MEDIA_HOST}atm/cdn/` : `${MEDIA_HOST}`;
            const BASE_U_IMGURL = MEDIA_HOST.includes("img.imageboss.me") ? `${MEDIA_HOST}atm/cdn/u/` : `${MEDIA_HOST}u/`;
            const AWS_MEDIA_HOST = "https://media.atmct.com/"
            const AWS_BASE_IMGURL = `${AWS_MEDIA_HOST}`;
            const AWS_BASE_U_IMGURL = `${AWS_MEDIA_HOST}u/`;

            const videoId = vid.replace("_", "")
            // const urlParams = new URLSearchParams(streamPlayer?.getAttribute("src"));
            const smartProgress = streamPlayer.getAttribute('sP') || streamPlayer.getAttribute('sp')
            const loop = streamPlayer.getAttribute('loop')
            const exitThumbnail = streamPlayer.getAttribute('eT') || streamPlayer.getAttribute('et')
            const smartAutoplay = streamPlayer.getAttribute('sA') || streamPlayer.getAttribute('sa')
            const smartAutoplayStart = streamPlayer.getAttribute('saStart') || streamPlayer.getAttribute('sastart')
            const smartAutoplayEnd = streamPlayer.getAttribute('saEnd') || streamPlayer.getAttribute('saend')
            const miniHook = streamPlayer.getAttribute('mh')
            const miniHookStart = streamPlayer.getAttribute('mhstart')
            const miniHookEnd = streamPlayer.getAttribute('mhend')
            const primaryColor = streamPlayer.getAttribute('primaryColor') || streamPlayer.getAttribute('primarycolor')
            const autoplay = streamPlayer.getAttribute('autoplay')
            const path = streamPlayer.getAttribute('p')
            const pauseAllowed = streamPlayer.getAttribute('pA') || streamPlayer.getAttribute('pa')
            const poster = streamPlayer.getAttribute('poster')
            const controls = streamPlayer.getAttribute('controls') || streamPlayer.getAttribute('data-controls')
            const orien = streamPlayer.getAttribute('o')
            const lg = streamPlayer.getAttribute('lg')
            const rp = streamPlayer.getAttribute('rp')
            const fv = streamPlayer.getAttribute('fv')
            const fluid = streamPlayer.getAttribute('fluid')
            const dlyTime = getVideoDelaySettings({type: "dlyTime"})
            const dlyClass = getVideoDelaySettings({type: "dlyClass"})
            const playbackRate = streamPlayer.getAttribute('playbackRate') || streamPlayer.getAttribute('playbackrate')
            const scrollIntoView = streamPlayer.getAttribute('scrollIntoView') || streamPlayer.getAttribute('scrollintoview')
            var alreadyDisplayedKey = `atomic_atomicplayer_${videoId?.split("-")?.[0]}_${timeToSeconds(dlyTime ?? '0')}`;
            var alreadyElsDisplayed = localStorage.getItem(alreadyDisplayedKey);
            let ranDelayedFuncs = false

            // console.log(`smartProgress => ${smartProgress}`);
            // console.log(`loop => ${loop}`);
            // console.log(`exitThumbnail => ${exitThumbnail}`);
            // console.log(`smartAutoplay => ${smartAutoplay}`);
            // console.log(`smartAutoplayStart => ${smartAutoplayStart}`);

            // console.log(`miniHook => ${miniHook}`);
            // console.log(`miniHookStart => ${miniHookStart}`);
            // console.log(`miniHookEnd => ${miniHookEnd}`);
            // console.log(`width => ${playerWidth}`);
            // console.log(`height => ${playerHeight}`);
            // console.log(`video width => ${player.videoWidth()}`);
            // console.log(`video height => ${player.videoHeight()}`);
            // console.log(`primaryColor => ${primaryColor}`);
            // console.log(`autoplay => ${autoplay}`);
            // console.log(`path => ${path}`);
            // console.log(`pauseAllowed => ${pauseAllowed}`);
            // console.log(`poster => ${poster}`);
            // console.log(`controls => ${controls}`);
            // console.log(`orien => ${orien}`);
            // console.log(`lg => ${lg}`);
            // console.log(`rp => ${rp}`);
            // console.log(`fv => ${fv}`);
            // console.log(`dlyTime => ${dlyTime}`);
            // console.log(`dlyClass => ${dlyClass}`);
            // console.log(`playbackRate => ${playbackRate}`);
            // console.log(player);

            if(smartAutoplay && smartAutoplayStart){
                player.currentTime(parseInt(smartAutoplayStart))
            }

            if(playbackRate){
                player.playbackRate(Number(playbackRate));
            }

            let hasManualPlay = false
            let isAuth = false
            let atomicatProgress
            // Add Css
            let allCss = `#${vid} .atomi-playpause {width: ${getWidth("atomiPlaypause")};height: ${getHeight("atomiPlaypause")};border-radius: 75px;padding-left: ${getPadding("atomiPlaypause")};border: none;background-color: rgba(0,0,0,0);outline: none;cursor: pointer;box-sizing: border-box;bottom: 0;opacity: .9;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);z-index: 10;background: ${hexToRgbA(primaryColor, 'pp')}} @media(max-width: 550px){#${vid} .atomi-playpause {width: ${getWidth("atomiPlaypause", "", "550")};height: ${getWidth("atomiPlaypause", "", "550")};padding-left: 8px;padding-right: 6px;}} #${vid} .atomi-play{gap: 1rem;}
            #${vid} .resumeplay-wrap{gap: ${orien ? '2rem' : '3rem'};}#${vid} .resumeplay-headline{font-size: ${getWidth("atomiResume", "heading")};}#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 1.3rem;}#${vid} .resumeplay-continue-img{width:24%;}#${vid} .resumeplay-begin-img{width:15%;}@media(max-width:1380px){#${vid} .resumeplay-headline{font-size:2.2rem}#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 1rem;}#${vid} .resumeplay-continue-img{width:18%;}#${vid} .resumeplay-begin-img{width:11%;}}@media(max-width:900px){#${vid} .resumeplay-headline{font-size:1.8rem}#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 0.8rem;}}@media(max-width:700px){#${vid} .resumeplay-headline{font-size:${orien ? '1rem' : '1.5rem'}}#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 0.8rem;}}@media(max-width:420px){#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 0.7rem;}#${vid} .resumeplay-headline{font-size:1rem}#${vid} .resumeplay-wrap{gap: 1rem;}#${vid} .atomi-play{gap: 0.2rem;}}
            #${vid} .cta-text{display:block;width:100%;padding:.5em 0;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:${getWidth("atomiSmartPlay", "heading")};font-weight:700;text-align:center;white-space:normal;line-height:1.1em;color:#fff}@media(max-width:1000px){#${vid} .cta-text{font-size:${getWidth("atomiSmartPlay", "heading", "1000")};}#${vid} .ply-b{width:75%}}@media(max-width:300px){#${vid} .cta-text{font-size:10px}#${vid} .ply-b{width:70%}}`;

            var css = allCss,
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
            head.appendChild(style);
            style.type = 'text/css';
            if (style.styleSheet){
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            let cssInterval = 0
            const videoCssInterval = setInterval(() => {
                cssInterval++
                if(player && player?.videoHeight()){
                    // console.log(`duration => ${player.duration()} | videoHeight => ${player.videoHeight()} | videoWidth => ${player.videoWidth()} | ${vid}`);
                    clearInterval(videoCssInterval);
                    allCss = `#${vid} .atomi-playpause {width: ${getWidth("atomiPlaypause")};height: ${getHeight("atomiPlaypause")};border-radius: 75px;padding-left: ${getPadding("atomiPlaypause")};border: none;background-color: rgba(0,0,0,0);outline: none;cursor: pointer;box-sizing: border-box;bottom: 0;opacity: .9;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);z-index: 10;background: ${hexToRgbA(primaryColor, 'pp')}} @media(max-width: 550px){#${vid} .atomi-playpause {width: ${getWidth("atomiPlaypause", "", "550")};height: ${getWidth("atomiPlaypause", "", "550")};padding-left: 8px;padding-right: 6px;}} #${vid} .atomi-play{gap: 1rem;}
                    #${vid} .resumeplay-wrap{gap: ${orien ? '2rem' : '3rem'};}#${vid} .resumeplay-headline{font-size: ${getWidth("atomiResume", "heading")};}#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 1.3rem;}#${vid} .resumeplay-continue-img{width:24%;}#${vid} .resumeplay-begin-img{width:15%;}@media(max-width:1380px){#${vid} .resumeplay-headline{font-size:2.2rem}#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 1rem;}#${vid} .resumeplay-continue-img{width:18%;}#${vid} .resumeplay-begin-img{width:11%;}}@media(max-width:900px){#${vid} .resumeplay-headline{font-size:1.8rem}#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 0.8rem;}}@media(max-width:700px){#${vid} .resumeplay-headline{font-size:${orien ? '1rem' : '1.5rem'}}#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 0.8rem;}}@media(max-width:420px){#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 0.7rem;}#${vid} .resumeplay-headline{font-size:1rem}#${vid} .resumeplay-wrap{gap: 1rem;}#${vid} .atomi-play{gap: 0.2rem;}}
                    #${vid} .cta-text{display:block;width:100%;padding:.5em 0;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:${getWidth("atomiSmartPlay", "heading")};font-weight:700;text-align:center;white-space:normal;line-height:1.1em;color:#fff}@media(max-width:1000px){#${vid} .cta-text{font-size:${getWidth("atomiSmartPlay", "heading", "1000")};}#${vid} .ply-b{width:75%}}@media(max-width:300px){#${vid} .cta-text{font-size:10px}#${vid} .ply-b{width:70%}}`;
        
                    var css = allCss,
                        head = document.head || document.getElementsByTagName('head')[0],
                        style = document.createElement('style');
                    head.appendChild(style);
                    style.type = 'text/css';
                    if (style.styleSheet){
                        // This is required for IE8 and below.
                        style.styleSheet.cssText = css;
                    } else {
                        style.appendChild(document.createTextNode(css));
                    }
                }else if(player?.isDisposed_ || player?.error_?.code === 4){
                    clearInterval(videoCssInterval);
                }
            }, 10);
            // Add Css End

            // Validate Video Allowed
            setTimeout(() => {
                if(player.duration() > 0 || player.videoHeight() > 0 || player.videoWidth() > 0){
                    isAuth = true
                    send({ action: 'viewed', duration: getcurrentTime() })
                }
            }, 3000);
            // Validate Video Allowed End

            // Event Listeners
            player.on('pause', () => {
                if(exitThumbnail && !isSmartAutoplayOngoing() && parseInt(getcurrentTime()) != parseInt(player.duration())){
                    atomicatPlayer.querySelector(".atomicat-exit-thumb").style.display = "block"
                }
            
                if(atomicatPlayer.querySelector(".atomi-playpause") && !exitThumbnail && pauseAllowed && atomicatPlayer.querySelector('.atomi-resumeplay')?.style?.display != 'block'){
                    atomicatPlayer.querySelector(".atomi-playpause").style.display = "flex"
                }
                if(!atomicatPlayer.querySelector(".atomi-playpause") && !exitThumbnail && pauseAllowed){
                    atomicatPlayer?.prepend(genPlayPause());
                    atomicatPlayer.querySelector(".atomi-playpause").innerHTML = getSvg('playpause')
                    atomicatPlayer.querySelector(".atomi-playpause").style.display = "flex"
                    atomicatPlayer.querySelector(".atomi-playpause").addEventListener("click", () => {
                        atomicatPlayer.setAttribute("data-played", "true")
                        hasManualPlay = true
                        player.muted(false);
                        player.play().catch(() => {
                            player.muted(true);
                            player.play();
                        });
                        atomicatPlayer.querySelector(".atomi-playpause").style.display = "none"
                    });
                }
            });

            player.on('timeupdate', () => {
                if(!isSmartAutoplayOngoing() && hasUserPlayed() && smartProgress){
                    set(player.currentTime(), player.duration())
                }
                if (hasUserPlayed() && parseInt(getcurrentTime()) == parseInt(player.duration())) {
                    send({ action: 'completed', duration: getcurrentTime() })
                }
                if(isSmartAutoplayOngoing() && smartAutoplayEnd && player.currentTime() >= parseInt(smartAutoplayEnd)){
                    player.currentTime(parseInt(smartAutoplayStart || 0))
                }
                if(!isSmartAutoplayOngoing() && hasUserPlayed() && miniHook && player.currentTime() >= parseInt(miniHookStart)){
                    if(player.currentTime() >= parseInt(miniHookStart) && player.currentTime() <= parseInt(miniHookEnd)){
                        atomicatPlayer.querySelector(".atomicat-minihook-img").style.display = "block"
                    }else{
                        atomicatPlayer.querySelector(".atomicat-minihook-img").style.display = "none"
                    }
                }
                if(dlyTime && dlyClass && alreadyElsDisplayed !== "true"){
                    if (hasUserPlayed()) {
                        const delay = timeToSeconds(dlyTime)
                        if(player.currentTime() > delay && !ranDelayedFuncs){
                            runDelayedFunctions({dlyClass, setDisplayed: alreadyDisplayedKey})
                            ranDelayedFuncs = true
                            if(scrollIntoView){
                                scrollIntoViewFunc()
                            }
                        }
                    }
                }
            });
            if(dlyTime && dlyClass && alreadyElsDisplayed === "true"){
                runDelayedFunctions({dlyClass})
                ranDelayedFuncs = true
            }

            player.on('play', () => {
                isAuth = true
                if(atomicatPlayer.querySelector(".atomicat-exit-thumb")){
                    atomicatPlayer.querySelector(".atomicat-exit-thumb").style.display = "none"
                }
                if(atomicatPlayer.querySelector(".atomi-playpause")){
                    atomicatPlayer.querySelector(".atomi-playpause").style.display = "none"
                }
                if(!autoplay && !smartAutoplay){
                    atomicatPlayer.setAttribute("data-played", "true")
                    hasManualPlay = true
                }
                if(player.controls() && hasUserPlayed()){
                    send({ action: 'play', duration: getcurrentTime() })
                }
            });

            player.on('ended', () => {
                if(!isSmartAutoplayOngoing() && !loop && controls === null && pauseAllowed && atomicatPlayer.querySelector('.atomi-resumeplay')?.style?.display != 'block'){
                    atomicatPlayer.querySelector(".atomi-playpause").style.display = "flex"
                }
                if (hasUserPlayed()) {
                    send({ action: 'completed', duration: getcurrentTime() })
                }
            });

            player.on('loadedmetadata', () => {
                isAuth = true
            });

            player.on('seeked', () => {
                isAuth = true
            });

            player.on('seeking', () => {
                isAuth = true
            });

            player.on('volumechange', () => {
                if (player.muted() || player.volume() === 0) {
                } else {
                    atomicatPlayer.setAttribute("data-played", "true")
                    hasManualPlay = true
                }
            });
            // Event Listeners End

            // Custom Features

            // For miniHook
            if(miniHook){
                atomicatPlayer.prepend(miniHookHtml());
            }

            // If autoplay check for manual play
            if((player.autoplay() || controls === null) && !smartAutoplay && !poster){
                player.muted(true);
                atomicatPlayer?.prepend(creatHtml('div', {
                    style: `position:absolute;width:100%;height:100%;top:0;z-index:1;cursor: pointer;`,
                    class: "atomicat-overlay"
                }, [genPlayPause()]));
                atomicatPlayer.querySelector(".atomi-playpause").innerHTML = getSvg('playpause')
                if(!player.autoplay() && pauseAllowed){
                    atomicatPlayer.querySelector(".atomi-playpause").style.display = "flex"
                }
                atomicatPlayer.querySelector(".atomicat-overlay").addEventListener("click", () => {
                    if(player.controls()){
                        atomicatPlayer.querySelector(".atomicat-overlay").style.display = "none"
                    }
                    if(player.paused() || hasManualPlay == false){
                        player.muted(false);
                        if(hasManualPlay == false){
                            player.currentTime(0)
                            player.muted(false);
                        }
                        player.play()
                        .catch(() => {
                            player.muted(true);
                            player.play();
                        });
                        if(!exitThumbnail && pauseAllowed){
                            atomicatPlayer.querySelector(".atomi-playpause").style.display = "none"
                        }
                        send({ action: 'play', duration: getcurrentTime() })
                    }else if(pauseAllowed){
                        player.pause()
                        if(!exitThumbnail && pauseAllowed){
                            atomicatPlayer.querySelector(".atomi-playpause").style.display = "flex"
                        }
                    }
                    atomicatPlayer.setAttribute("data-played", "true")
                    hasManualPlay = true
                });
            }
            // If autoplay check for manual play End

            // For smartAutoplay
            if(smartAutoplay && !isResumePlay()){

                player.muted(true);
                player.play().catch((e) => {
                    player.muted(true);
                    player.play();
                });
                if(!loop){
                    player.loop(true);
                }
                if(smartAutoplay.split('/')?.pop()?.includes('atomiSA')){
                    atomicatPlayer.prepend(genTempAutoplay('template'));
                    atomicatPlayer.querySelector(".autoplay-svg").innerHTML = getSvg('autoPlay')
                }else{
                    atomicatPlayer.prepend(genTempAutoplay());
                }
                atomicatPlayer.querySelector('.atomicat-smartAutoplay').addEventListener("click", (e) => {
                    atomicatPlayer.setAttribute("data-played", "true")
                    hasManualPlay = true
                    e.currentTarget.style.display = "none"
                    player.currentTime(0)
                    player.muted(false)
                    if(!loop){
                        player.loop(false);
                    }
                    if(player.paused()){
                        player.play().catch(() => {
                            player.muted(true);
                            player.play();
                        });
                    }
                    send({ action: 'play', duration: getcurrentTime() })
                });
                // player.on('loadeddata', () => {
                    // player.controls(true)
                // });

            }
            // For smartAutoplay End

            // For exitThumbnail
            if(exitThumbnail){
                atomicatPlayer.prepend(creatHtml('img', {
                    style: `position:absolute;top:0;width:${playerWidth}${fluid?'%':'px'};height:${playerHeight}${fluid?'%':'px'};z-index:1;display:none;cursor:pointer;margin: 0;cursor: pointer;`,
                    class: "atomicat-exit-thumb",
                    src: `${getImageUrl('exitThumbnail', exitThumbnail)}`
                }));
                const atomicatExitThumb = atomicatPlayer.querySelector(".atomicat-exit-thumb");

                atomicatExitThumb.addEventListener("click", () => {
                    atomicatExitThumb.style.display = "none"
                    const currentTime = player.currentTime()
                    player.play()
                    .then(() => {
                        if(parseInt(currentTime) == parseInt(player.duration())){
                            player.currentTime(0)
                        }else{
                            player.currentTime(currentTime)
                        }
                        send({ action: 'play', duration: getcurrentTime() })
                    })
                    .catch(() => {
                        player.muted(true);
                        player.play();
                    });
                });
            }
            // For exitThumbnail End

            // For smartProgress
            if(smartProgress){
                atomicatPlayer.prepend(creatHtml('div', {
                    style: `position:absolute;top:${parseInt(playerHeight)}${fluid?'%':'px'};width:0%;height:12px;margin: 0 0 0 0;margin-top:-12px;background-color:#ffffff;background-color:${primaryColor+' !important' ?? '#ffffff'};z-index:1;`,
                    class: "atomicat-progress"
                }));
                atomicatProgress = atomicatPlayer.querySelector(".atomicat-progress");
            }
            // For smartProgress End

            // For resumePlay
            if(isResumePlay()){
                atomicatPlayer.prepend(resumePlay());

                atomicatPlayer.querySelector('.atomi-play').addEventListener("click", () => {
                    atomicatPlayer.querySelector('.atomi-resumeplay').style.display = "none"
                    player.play()
                    .then(() => {
                        player.currentTime(0)
                        player.muted(false);
                        send({ action: 'play', duration: getcurrentTime() })
                    })
                    .catch(() => {
                        player.muted(true);
                        player.play();
                    });
                    atomicatPlayer.setAttribute("data-played", "true")
                    hasManualPlay = true
                });

                atomicatPlayer.querySelector('.atomi-resume').addEventListener("click", () => {
                    atomicatPlayer.querySelector('.atomi-resumeplay').style.display = "none"
                    const watchedUntil = getWatchedUntil()
                    player.play()
                    .then(() => {
                        player.currentTime(watchedUntil)
                        player.muted(false);
                        send({ action: 'play', duration: getcurrentTime() })
                    })
                    .catch(() => {
                        player.muted(true);
                        player.play()
                        .then(() => {
                            player.currentTime(watchedUntil)
                        })
                    });
                    atomicatPlayer.setAttribute("data-played", "true")
                    hasManualPlay = true
                });
            }
            // For resumePlay End

            // Controls False
            if(controls === null && !atomicatPlayer.querySelector(".atomicat-overlay")){
                atomicatPlayer?.prepend(creatHtml('div', {
                    style: `position:absolute;width:100%;height:100%;top:0;z-index:1;cursor: pointer;`,
                    class: "atomicat-overlay"
                }, [genPlayPause()]));
                atomicatPlayer.querySelector(".atomi-playpause").innerHTML = getSvg('playpause')
                // if(isResumePlay() || smartAutoplay || player.autoplay()){
                //     atomicatPlayer.querySelector(".atomi-playpause").style.display = "none"
                // }
                atomicatPlayer.querySelector(".atomicat-overlay").addEventListener("click", () => {
                    if(player.paused() || (player.autoplay() && player.muted())){
                        if(hasManualPlay == false){
                            player.currentTime(0)
                            player.muted(false);
                        }
                        player.play().catch((e) => {
                            player.muted(true);
                            player.play();
                        });
                        if(!exitThumbnail && pauseAllowed){
                            atomicatPlayer.querySelector(".atomi-playpause").style.display = "none"
                        }
                        send({ action: 'play', duration: getcurrentTime() })
                    }else if(pauseAllowed){
                        player.pause()
                        if(!exitThumbnail && pauseAllowed){
                            atomicatPlayer.querySelector(".atomi-playpause").style.display = "flex"
                        }
                    }
                    atomicatPlayer.setAttribute("data-played", "true")
                    hasManualPlay = true
                });
            }
            // Controls False End

            // Fake Viewers
            if(fv){
                atomicatPlayer.prepend(fakeViewers());
                atomicatPlayer.querySelector(".fv-countIcon").innerHTML = getSvg('fv')
                
                let initial = rdn(parseInt(fv),parseInt(fv)+300);
                
                setInterval(() => {
                    atomicatPlayer.querySelector('.viewer').innerText = initial;
                    initial += rdn(-1, 2);   
                }, 1000);
            }
            // Fake Viewers End

            // Custom Features End

            // Static Functons
            function set(currentTime, duration){
                var r = currentTime / duration;
                if(atomicatProgress){
                    atomicatProgress.style.width = "".concat(calcWidth(r), `${fluid?'%':'px'}`)
                }
            }

            function calcWidth(t){
                return parseInt(playerWidth) * Math.pow(1 - (t -= 1) * t, 1 / 2)
            }

            function creatHtml(tag, attr, inner) {
                let parentTag = document.createElement(tag);
                for (const key in attr) {
                    parentTag.setAttribute(key, attr[key])
                }
                if(inner){
                    if(typeof inner == "string"){
                        parentTag.textContent = inner
                    }else if(Array.isArray(inner)){
                        for (let i = 0; i < inner.length; i++) {
                            const element = inner[i];
                            parentTag.prepend(element)
                        }
                    }
                }
                return parentTag
            }

            function isSmartAutoplayOngoing() {
                return smartAutoplay && atomicatPlayer.querySelector('.atomicat-smartAutoplay')?.style.display == "block"
            }

            function genTempAutoplay(type) {
            
                let templateEle
                if(type == 'template'){
                    // const styleEle = creatHtml('style', {}, `#${vid} .cta-text{display:block;width:100%;padding:.5em 0;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:${getFontSize()};font-weight:700;text-align:center;white-space:normal;line-height:1.1em;color:#fff}@media(max-width:1000px){#${vid} .cta-text{font-size:13px}#${vid} .ply-b{width:75%}}@media(max-width:300px){#${vid} .cta-text{font-size:10px}#${vid} .ply-b{width:70%}}`);
            
                    const buttonEle = creatHtml('button', {
                        style: `background:transparent;border:none;position:absolute;top: 50%;left: 50%;-webkit-transform: translateX(-50%) translateY(-50%);transform: translateX(-50%) translateY(-50%);cursor:pointer;`,
                    }, [creatHtml('span', {
                        class: `cta-text`,
                    }, getText('sa-text')), creatHtml('div', {
                        class: `autoplay-svg`,
                    }), creatHtml('span', {
                        class: `cta-text`,
                    }, getText('sa-text'))]);
            
                    templateEle = creatHtml('div', {
                        style: `position:absolute;top:0;left:0;width:${playerWidth}${fluid?'%':'px'};height:${playerHeight}${fluid?'%':'px'};background: rgba(0,0,0,.5);display:block;z-index:2;cursor: pointer;`,
                        class: `atomicat-smartAutoplay`,
                    }, [buttonEle]);
                    // }, [styleEle, buttonEle]);
            
                }else{
                    const id = smartAutoplay.split('/')?.pop()?.replace(/[^0-9]/g, '')
                    const imgEle = creatHtml('img', {
                        style: `position:absolute;left:${orien ? '25%' : '30%'};top:${orien ? '35%' : '30%'};width:${orien ? '52%' : '40%'};height:${orien ? '20%' : '40%'};`,
                        id: `smart_autoplay_img_${id}`,
                        src: `${getImageUrl('smartAutoplay', smartAutoplay)}`,
                        alt: getText('sa-text'),
                    });
                    templateEle = creatHtml('div', {
                        style: `position:absolute;top:0;left:0;width:${playerWidth}${fluid?'%':'px'};height:${playerHeight}${fluid?'%':'px'};z-index:2;display:block;cursor: pointer;`,
                        class: `atomicat-smartAutoplay`,
                    }, [imgEle]);
                }
                return templateEle
            }

            function getText(key) {
                if(lg == 'en'){
                    if(key == 'sa-text'){
                        return 'Click here to listen'
                    }else if(key == 'rp-headline'){
                        return 'You have already started watching this video'
                    }else if(key == 'rp-begin'){
                        return 'Watch from the start'
                    }else if(key == 'rp-continue'){
                        return 'Keep watching?'
                    }else if(key == 'fv-headline'){
                        return 'Live'
                    }
                }else if(lg == 'es') {
                    if(key == 'sa-text'){
                        return 'Haga clic para escuchar'
                    }else if(key == 'rp-headline'){
                        return 'Ya has empezado a mirar este vídeo'
                    }else if(key == 'rp-begin'){
                        return 'Mirar desde el princípio?'
                    }else if(key == 'rp-continue'){
                        return 'Seguir mirando?'
                    }else if(key == 'fv-headline'){
                        return 'En vivo'
                    }
                }else{
                    if(key == 'sa-text'){
                        return 'Toque na tela para ouvir'
                    }else if(key == 'rp-headline'){
                        return 'Você já começou a assistir esse vídeo'
                    }else if(key == 'rp-begin'){
                        return 'Assistir do início'
                    }else if(key == 'rp-continue'){
                        return 'Continuar assistindo?'
                    }else if(key == 'fv-headline'){
                        return 'Ao vivo'
                    }
                }
                return ''
            }

            function getSvg(type) {
                let svg = ''
                if(type == 'autoPlay'){
                    svg = '<svg class="ply-b" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="7.999 9.062 46.75 32.563" enable-background="new 7.999 9.062 46.75 32.563" xml:space="preserve"> <style>@keyframes BLINK{0%{opacity: 0;}33%{opacity: 1;}66%{opacity: 1;}100%{opacity: 0;}}.blink_1{animation: BLINK 2s infinite; opacity: 0;}.blink_2{animation: BLINK 2s infinite .3s; opacity: 0;}.blink_3{animation: BLINK 2s infinite .6s; opacity: 0;}</style> <g style="fill: rgb(255,255,255);"> <path d="M53.249,39.616c-0.186,0-0.371-0.051-0.537-0.157l-43.5-27.75c-0.466-0.297-0.603-0.916-0.306-1.381c0.298-0.466,0.917-0.601,1.381-0.306l43.5,27.75c0.467,0.297,0.604,0.916,0.307,1.381C53.901,39.453,53.579,39.616,53.249,39.616z"></path> <path class="blink_3" d="M48.896,33.467l1.699,1.085c3.497-7.791,2.073-17.271-4.313-23.659c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414C50.581,18.019,51.913,26.463,48.896,33.467z"></path> <path class="blink_3" d="M46.926,36.956c-0.612,0.863-1.286,1.695-2.059,2.469c-0.392,0.391-0.392,1.023,0,1.414c0.194,0.195,0.45,0.293,0.707,0.293c0.256,0,0.512-0.098,0.706-0.293c0.878-0.878,1.642-1.824,2.333-2.807L46.926,36.956z"></path> <path class="blink_2" d="M42.543,29.415l1.777,1.135c1.545-5.315,0.229-11.293-3.953-15.476c-0.392-0.391-1.023-0.391-1.414,0c-0.392,0.391-0.392,1.023,0,1.414C42.454,19.987,43.639,24.925,42.543,29.415z"></path> <path class="blink_2" d="M41,33.174c-0.563,0.94-1.235,1.837-2.047,2.646c-0.391,0.392-0.391,1.023,0,1.414c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293c0.916-0.914,1.676-1.924,2.317-2.984L41,33.174z"></path> <path class="blink_1" d="M35.771,25.094l2.003,1.277c0.012-0.203,0.029-0.404,0.029-0.609c0-3.079-1.2-5.974-3.381-8.153c-0.391-0.391-1.022-0.391-1.414,0c-0.391,0.391-0.391,1.023,0,1.414C34.652,20.666,35.613,22.802,35.771,25.094z"></path> <path class="blink_1" d="M35.084,29.401c-0.474,1.145-1.172,2.197-2.076,3.1c-0.391,0.391-0.391,1.023,0,1.414c0.195,0.195,0.451,0.293,0.707,0.293c0.257,0,0.513-0.098,0.707-0.293c1.008-1.006,1.795-2.17,2.361-3.43L35.084,29.401z"></path> <polygon points="28.124,20.215 28.124,14.991 24.635,17.99 "></polygon> <path d="M20.921,20.366h-6.423c-0.553,0-1,0.508-1,1.135v8.229c0,0.627,0.447,1.135,1,1.135h7.375l6.25,5.875V24.96L20.921,20.366z"></path> </g></svg>'
                }else if(type == 'fv'){
                    svg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707zm2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708zm5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708zm2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>'
                }else if(type == 'playpause'){
                    svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 32" style="width: 100%;height: 100%;fill: #fff;padding-left: ${orien ? '5px' : '10px'};"><path d="M15.552 15.168q0.448 0.32 0.448 0.832 0 0.448-0.448 0.768l-13.696 8.512q-0.768 0.512-1.312 0.192t-0.544-1.28v-16.448q0-0.96 0.544-1.28t1.312 0.192z"></path></svg>`
                }
                return svg
            }

            function rdn(e, t) {
                return Math.floor(Math.random() * (t - e + 1) + e)
            }

            function fakeViewers() {
            
                const liveText = creatHtml('span', {
                    style: `margin-bottom:-1px;font-size:13px;font-weight: 500;`,
                }, getText('fv-headline'));
            
                const liveIcon = creatHtml('span', {
                    class: `live-icon`,
                });
            
                const toolbar = creatHtml('div', {
                    class: `toolbar`,
                }, [liveText, liveIcon]);
            
                const viewer = creatHtml('span', {
                    class: `viewer`,
                });
            
                const countIcon = creatHtml('span', {
                    class: `fv-countIcon`,
                    style: `margin-top:1px;`,
                });
            
                const count = creatHtml('div', {
                    class: `count`,
                }, [viewer, countIcon]);
            
                const styleEle = creatHtml('style', {}, `@keyframes live {0% {transform: scale(1, 1);}100% {transform: scale(3.5, 3.5);background-color: rgba(255, 0, 0, 0);}}@-webkit-keyframes live {0% {transform: scale(1, 1);}100% {transform: scale(3, 3);background-color: rgba(255, 0, 0, 0);}}#${vid} .broad{display: flex;align-items: center;gap: 8px;justify-content: center;position: absolute;top: 16px;z-index: 1;color: #ffffff;border-radius: 16px;background-color: rgba(0,0,0,0.75);left: 16px;padding-right: 8px;}#${vid} .count{margin-top: 1px;display: flex;align-items: center;gap: 6px;}#${vid} .viewer{font-size: 12px;}#${vid} .toolbar{padding: 8px 0px 8px 9px;display: flex;align-items: center;gap: 6px;justify-content: center;}#${vid} span.live-icon {display: inline-block;position: relative;top: calc(50% - 5px);background-color: red;width: 8px;height: 8px;border: 1px solid rgba(0, 0, 0, 0.1);border-radius: 50%;z-index: 1;}#${vid} span.live-icon:before {content: "";display: block;position: absolute;background-color: rgba(255, 0, 0, 0.6);width: 100%;height: 100%;border-radius: 50%;-webkit-animation: live 1.75s ease-in-out infinite;animation: live 1.75s ease-in-out infinite;z-index: -1;}`);
            
                const outer = creatHtml('div', {
                    class: `broad`,
                }, [count, toolbar, styleEle]);
            
                return outer
            }

            function resumePlay() {
                const beginningImg = creatHtml('img', {
                    src: `${BASE_IMGURL}p/rpreplay.png`,
                    style: `width:19%;height:60%;`,
                    class: `resumeplay-begin-img`,
                });
                const beginningText = creatHtml('span', {
                    // style: `font-size: 1.3rem;`,
                    class: `resumeplay-begin-text`,
                }, getText('rp-begin'));
                const beginning = creatHtml('div', {
                    style: `display:flex;align-items: center;text-align: center;cursor: pointer;gap: 0.8rem;`,
                    class: `atomi-play`,
                }, [beginningText, beginningImg]);
            
                const keepWatchingImg = creatHtml('img', {
                    src: `${BASE_IMGURL}p/rpplay.png`,
                    style: `width:24%;height:60%;`,
                    class: `resumeplay-continue-img`,
                });
                const keepWatchingText = creatHtml('span', {
                    // style: `font-size: 1.3rem;`,
                    class: `resumeplay-continue-text`,
                }, getText('rp-continue'));
                const keepWatching = creatHtml('div', {
                    style: `display:flex;justify-content: end;align-items: center;text-align: center;cursor: pointer;`,
                    class: `atomi-resume`,
                }, [keepWatchingText, keepWatchingImg]);
            
                const buttonsWrap = creatHtml('div', {
                    style: `display:grid;align-items: center;justify-content: center;margin-top: 2rem;grid-template-columns: repeat(2, 1fr);`,
                    class: `resumeplay-wrap`,
                }, [beginning, keepWatching]);
            
                const headline = creatHtml('span', {
                    style: `display: block;text-align: center;`,
                    class: `resumeplay-headline`,
                }, getText('rp-headline'));
            
                const innerEle = creatHtml('div', {
                    style: `position:absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%);color: #fff;width: 95%;`,
                }, [buttonsWrap, headline]);
            
                const styleEle = creatHtml('style', {}, `#${vid} .atomi-play{gap: 1rem;}#${vid} .resumeplay-wrap{gap: ${orien ? '2rem' : '3rem'};}#${vid} .resumeplay-headline{font-size: ${getWidth("atomiResume", "heading")};}#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 1.3rem;}#${vid} .resumeplay-continue-img{width:24%;}#${vid} .resumeplay-begin-img{width:15%;}@media(max-width:1380px){#${vid} .resumeplay-headline{font-size:2.2rem}#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 1rem;}#${vid} .resumeplay-continue-img{width:18%;}#${vid} .resumeplay-begin-img{width:11%;}}@media(max-width:900px){#${vid} .resumeplay-headline{font-size:1.8rem}#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 0.8rem;}}@media(max-width:700px){#${vid} .resumeplay-headline{font-size:${orien ? '1rem' : '1.5rem'}}#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 0.8rem;}}@media(max-width:420px){#${vid} .resumeplay-begin-text,#${vid} .resumeplay-continue-text{font-size: 0.7rem;}#${vid} .resumeplay-headline{font-size:1rem}#${vid} .resumeplay-wrap{gap: 1rem;}#${vid} .atomi-play{gap: 0.2rem;}}`);
            
                const outerEle = creatHtml('div', {
                    style: `position:absolute;top:0;left:0;width:${playerWidth}${fluid?'%':'px'};height:${playerHeight}${fluid?'%':'px'};background: ${primaryColor ? hexToRgbA(primaryColor, 'rp') : 'rgb(0 126 255 / 0.9)'};display:block;z-index: 3;`,
                    class: `atomi-resumeplay`,
                }, [innerEle]);
                // }, [innerEle, styleEle]);
            
                return outerEle
            }

            function isResumePlay() {
                return rp && getWatchedUntil()
            }

            function hasUserPlayed() {
                return hasManualPlay || atomicatPlayer.getAttribute("data-played") === "true"
            }

            function getcurrentTime() {
                let ct
                if(!autoplay && !smartAutoplay){
                    ct = player.currentTime()
                }else if(hasUserPlayed()){
                    ct = player.currentTime()
                }else{
                    ct = 0
                }
                return ct
            }

            function getVisitorsId() {
                var id;
                try {
                    var stored = localStorage.getItem("atomicat.player")
                    id = JSON.parse(stored).uuid;
                } catch (e) {
                    id = generateVisitorsId()
                    localStorage.setItem("atomicat.player", JSON.stringify({
                        uuid: id,
                    }))
                }
                return id
            }

            function getWatchedUntil() {
                var time;
                try {
                    var stored = localStorage.getItem(`atomicat.player.${videoId}`)
                    time = JSON.parse(stored).watched;
                } catch (e) {
                    time = false
                }
                return time
            }

            function setWatchedUntil() {
                localStorage.setItem(`atomicat.player.${videoId}`, JSON.stringify({
                    watched: getcurrentTime(),
                }))
            }

            function generateVisitorsId() {
                var now = new Date().getTime();
                var random = (now * Math.random() * 100000).toString(36)+'-'+now+'-'+(now * Math.random() * 100000).toString(36);
                return random;
            }

            function getImageUrl(type, img) {
                const isGif = img.split('.')[1] == 'gif'
                const baseUrl = img.includes('?host=aws') ? AWS_BASE_U_IMGURL : BASE_U_IMGURL
                const image = img.replace('?host=aws', '')
                if(type == 'smartAutoplay'){
                    if(image.includes('atomiSA')){
                        return `${BASE_IMGURL}p/${image}`
                    }else{
                        return `${baseUrl}${getPath()}/${image.includes("/") ? "" : "t/"}${image}?height=200`
                    }
                }else if(type == 'exitThumbnail'){
                    return `${baseUrl}${getPath()}/${image.includes("/") ? "" : "t/"}${image}`
                }else if(type == 'poster'){
                    return `${baseUrl}${getPath()}/${image.includes("/") ? "" : "t/"}${image}`
                }else if(type == 'miniHook'){
                    return `${baseUrl}${getPath()}/${image.includes("/") ? "" : "t/"}${image}`
                }
                return false
            }

            function getPath() {
                if(path){
                    return path
                }else if(poster){
                    return poster?.split('/')[(poster?.split('/').length)-3]
                }
                return false
            }

            function getFontSize() {
                const stream = parseInt(playerWidth)
                if(stream < 20){
                    return '6px'
                }else if(stream < 40){
                    return '12px'
                }else if(stream < 60){
                    return '15px'
                }
                return '22px'
            }

            function genPlayPause() {
                // const innerEle = creatHtml('img', {
                //     src: `${BASE_IMGURL}p/play3.png`,
                //     style: `margin-left:15px;width:50%;height:60%;`,
                // });
                const outerEle = creatHtml('button', {
                    style: `display:none;`,
                    class: `atomi-playpause`,
                });
                // }, [innerEle]);
            
                return outerEle
            }

            function hexToRgbA(hex, type){
                var c;
                const opacity = type == 'pp' ? 0.75 : type == 'rp' ? 0.9 : 0.75
                if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
                    c= hex.substring(1).split('');
                    if(c.length== 3){
                        c= [c[0], c[0], c[1], c[1], c[2], c[2]];
                    }
                    c= '0x'+c.join('');
                    // return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+', 0.75)';
                    return `rgba(${[(c>>16)&255, (c>>8)&255, c&255].join(',')}, ${opacity})`;
                }
                return 'rgba(0, 0, 0, 0.75)'
            }

            function getWidth(type, subType, mq) {
                if(type == "atomiPlaypause"){
                    if(mq == "550"){
                        if(player.videoWidth() < 400 && player.videoWidth() != 0){
                            return '50px'
                        }else{
                            return '70px'
                        }
                    }else {
                        if(player.videoWidth() < 300 && player.videoWidth() != 0){
                            return '90px'
                        }else{
                            return '150px'
                        }
                    }
                } else if(type == "atomiResume"){
                    if(subType == "heading"){
                        if(player.videoWidth() < 500 && player.videoWidth() != 0){
                            return '1.8rem'
                        }else{
                            return '2.8rem'
                        }
                    } else if(subType == "subHeading"){
                        if(player.videoWidth() < 500 && player.videoWidth() != 0){
                            return '1.0rem'
                        }else{
                            return '1.3rem'
                        }
                    }
                } else if(type == "atomiSmartPlay"){
                    if(subType == "heading"){
                        if(mq == "1000"){
                            if(player.videoWidth() < 450 && player.videoWidth() != 0){
                                return '9px'
                            }else{
                                return '13px'
                            }
                        }else{
                            if(player.videoWidth() < 450 && player.videoWidth() != 0){
                                if(getFontSize() == '22px' && orien != 'v'){
                                    return '8px'
                                }else{
                                    return '22px'
                                }
                            }else{
                                return '22px'
                            }
                        }
                    }
                }
                return '150px'
            }

            function getHeight(type) {
                if(type == "atomiPlaypause"){
                    if(player.videoWidth() < 300 && player.videoWidth() != 0){
                        return '90px'
                    }else{
                        return '150px'
                    }
                }
                return '150px'
            }

            function getPadding(type) {
                if(type == "atomiPlaypause"){
                    if(player.videoWidth() < 300 && player.videoWidth() != 0){
                        return '15px'
                    }else{
                        return '20px'
                    }
                }
                return '20px'
            }

            function runDelayedFunctions(data) {
                document.querySelectorAll(`.${data?.dlyClass}`).forEach(el => el.classList.remove(`${data?.dlyClass}`));
                if(data?.setDisplayed){
                  localStorage.setItem(data?.setDisplayed, true);
                }
            }

            function scrollIntoViewFunc() {
                var scrollElement = document.getElementById(scrollIntoView);
                if (scrollElement) {
                  scrollElement.scrollIntoView({ behavior: 'smooth' });
                }
            }

            function getVideoDelaySettings({type}) {
                try {
                    let videoSettings = document.querySelector('.atomicat-video[data-twr-player="atomic"], .a-video[data-twr-player="atomic"]');
                    if(type == "dlyTime") {
                        let dlyTime = streamPlayer.getAttribute('dlyTime') || streamPlayer.getAttribute('dlytime');
                        if(!dlyTime && videoSettings) {
                            let v = JSON.parse(videoSettings.getAttribute('data-video-settings'));
                            dlyTime = v?.dlyTime;
                        }
                        return dlyTime;
                    }else if(type == "dlyClass") {
                        let dlyClass = streamPlayer.getAttribute('dlyClass') || streamPlayer.getAttribute('dlyclass');
                        if(!dlyClass && videoSettings) {
                            let v = JSON.parse(videoSettings.getAttribute('data-video-settings'));
                            dlyClass = v?.dlyClass;
                        }
                        return dlyClass;
                    }
                } catch(e) {
                    console.log(e);
                    return null;
                }
            }

            function timeToSeconds(timeString) {
                // Ensure that timeString is treated as a string
                timeString = String(timeString);
                // Split the time string into its components and reverse it to make it easier to manage
                const timeComponents = timeString.split(':').reverse().map(Number);
            
                // Initialize hours, minutes, and seconds
                let hours = 0, minutes = 0, seconds = 0;
            
                // Based on the number of components, assign values to hours, minutes, and seconds
                if (timeComponents.length > 3) {
                    throw new Error('Invalid time format. Please use HH:MM:SS, MM:SS, or SS.');
                }
            
                if (timeComponents.length >= 1) {
                    seconds = timeComponents[0];
                    if (isNaN(seconds) || seconds < 0) {
                        throw new Error('Invalid seconds format.');
                    }
                }
            
                if (timeComponents.length >= 2) {
                    minutes = timeComponents[1];
                    if (isNaN(minutes) || minutes < 0) {
                        throw new Error('Invalid minutes format.');
                    }
                }
            
                if (timeComponents.length === 3) {
                    hours = timeComponents[2];
                    if (isNaN(hours) || hours < 0) {
                        throw new Error('Invalid hours format.');
                    }
                }

                // Normalize the time components
                minutes += Math.floor(seconds / 60);
                seconds = seconds % 60;
                
                hours += Math.floor(minutes / 60);
                minutes = minutes % 60;
            
                // Calculate the total seconds
                const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                return totalSeconds;
            }
            // Static Functons End

            // MiniHook
            function miniHookHtml() {
                const imgEle = creatHtml('img', {
                    style: `position:absolute;left:0;top:0;z-index:1;width:100%;display:none;`,
                    class: `atomicat-minihook-img`,
                    src: `${getImageUrl('miniHook', miniHook)}`,
                    alt: `miniHook`,
                });
                return imgEle
            }

            // For sending visitor data
            function send(data) {
                if(isAuth){
                    const url = 'https://apidopro.atomicat-api.com/analytics/saveanalytics'
                    data['visitorId'] = getVisitorsId()
                    data['videoId'] = videoId
                    if(hasUserPlayed() && parseInt(player.duration()) == parseInt(data.duration)) {data['action'] = 'completed'}
                    if (navigator && navigator.sendBeacon) {
                        navigator.sendBeacon(url, JSON.stringify(data));
                    }else{
                        fetch(url, {
                            keepalive: true,
                            method: 'POST',
                            mode: 'no-cors',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        });
                    }
                }
            }

            document.addEventListener('visibilitychange', function logData() {
                if (document.visibilityState === 'hidden' && hasUserPlayed()) {
                    if(hasUserPlayed() && parseInt(player.duration()) != parseInt(getcurrentTime())) {
                        setWatchedUntil()
                    }
                    send({ action: 'left', duration: getcurrentTime() })
                }
            });

            document.addEventListener('mouseout', function (e) {
                // Check if the mouse is near the top of the viewport
                if (!e.relatedTarget && e.clientY <= 0 && hasUserPlayed()) {
                    if(hasUserPlayed() && parseInt(player.duration()) != parseInt(getcurrentTime())) {
                        setWatchedUntil()
                    }
                    send({ action: 'left', duration: getcurrentTime() })
                }
            });
            // For sending visitor data end
        }
    }, 100);

})();