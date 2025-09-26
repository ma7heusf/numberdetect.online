let playerVideo, playerAudioIsEnabled = false, modalElement, modelVH, modelVW, animation, formsSections, pathCard, codeExtendObject;

function handleVideo(path, trackPath, audio) {
  audio.load();
  var initialPlay = false;

  let videoOption = {
    controls: false,
    autoplay: false,
    fluid: true,
    preload: 'auto',
    sources: [{
      src: path,
      type: 'audio/mp3'
    }],
    html5: {
      nativeTextTracks: false
    }
  };


  if (!playerVideo) {
    playerVideo = videojs("my-player", videoOption);
  }
  playerVideo.src({ type: 'audio/mp3', src: path });

  playerVideo.ready(function () {
    var oldTracks = playerVideo.remoteTextTracks();
    var i = oldTracks.length;
    while (i--) {
      playerVideo.removeRemoteTextTrack(oldTracks[i]);
    }
    const tracksElements = playerVideo.addRemoteTextTrack({
      kind: 'captions',
      src: trackPath,
      mode: 'showing'
    }, false);
    tracksElements.addEventListener('load', function () {
      console.log("Legendas carregadas com sucesso");
    });


  });
  playerVideo.on('error', function(error) {
    console.error('Erro de reprodução:', error);
  });

  playerVideo.on('loadeddata', function() {
    console.log('O áudio foi carregado e está pronto para reprodução!');
    playerAudioIsEnabled = true
  });

  playerVideo.on("play", () => {
    const tracks = playerVideo.textTracks();
    if (tracks.length > 0) {
      for (var i = 0; i < tracks.tracks_[0].cues_.length; i++) {
        tracks.tracks_[0].cues_[i].text = replaceContent(tracks.tracks_[0].cues_[i].text, true);
      }
    }
    if (!initialPlay) {
      tracks.tracks_[0].addEventListener('cuechange', function () {
        /* console.log(tracks.tracks_[0].activeCues_[0].text);
        const p = document.createElement('p')
        p.innerHTML = tracks.tracks_[0].activeCues_[0].text
        console.log(tracksElement.children);
        tracksElement.innerHTML = undefined
        tracksElement.innerHTML = ''
        tracksElement.appendChild(p)
        console.log(tracksElement, p); */
      });
      initialPlay = true;
    }
  });
  playerVideo.pause()
}

async function getJsonData(path) {
  console.log(path);
  let result;
  await fetch(`/getToken.php?file=${path}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
    .then(response => response.json())
    .then(async (response) => {
      let url = response.url
      await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })
        .then(response => response.json())
        .then((response) => {
          result = response;
        })
    })
  return result;
}

async function getJsonDataLocal(path) {
  const url = window.location.origin;
  console.log("Chamada local servidor");
  console.log(path);
  console.log(url);
  let result;
  await fetch(url +"/"+ path, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
    .then(response => response.json())
    .then((response) => {
      result = response;
    })
  return result;
}




async function getNumberCalc(url, dataValue, valueName) {
  console.log("CALL API");
  const username = 'onecommerce';
  const password = '!onecommerce!';
  const token = btoa(`${username}:${password}`);
  const headers = {
    'Authorization': `Basic ${token}`,
    'Content-Type': 'application/json'
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(dataValue)
  })
  const data = await response.json()
  if (valueName) {
    console.log("result: " + data[valueName]);
    return data[valueName]
  }
  return data
}

function handleFormsSections(forms) {
  formsSections = forms
}

function encriptarBase64(texto) {
  return btoa(texto);
}