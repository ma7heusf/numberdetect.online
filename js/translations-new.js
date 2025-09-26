let langContent, translateIsFinish = false;

console.log("Carregamento tradução");

window.addEventListener("load", () => {
    setTimeout(() => {
        console.log("Script started");
        getLang()
    }, 1000)
})

async function getLang() {
    while (true) {
        console.log("Start search lang.........");
        const lang = currentLang;
        if (currentLang) {
            try {
            langContent = await getLangJson(lang)
            if (langContent) {
                console.log("Success return json");
                console.log(langContent);
                await updateContent()
                break;
            }
                
            } catch (error) {
                console.log(error);
                break;
            }
        }
    }
}

async function getLangJson(lang) {
    console.log("Search json.......");
    const url = window.location.href;
    const pathSegments = url.split('/');
    const urlAtual = window.location.href;
    console.log(webSite);
        if (!lang) {
            console.log("Loading lang default");
            return await getJsonTranslations(`${pathSegments[0]}/assets/translations/${webSite}/pt.json`);
        }
        if (lang) {
            try {
                if (langContent) console.log("loading lang: "+ lang);
                return await getJsonTranslations(`${pathSegments[0]}/assets/translations/${webSite}/${lang}.json`);
            } catch (error) {
                return await getJsonTranslations(`${pathSegments[0]}/assets/translations/${webSite}/pt.json`);
            }
    }
}

function updateContent() {
    console.log("Start translations");
    for (let i = 0; i < langContent?.texts?.length; i++) {
        
        if (langContent?.texts?.length - 1 === i) {
            translateIsFinish = true
            return
        }
        if (document.getElementById(langContent.texts[i].id)) {
            if (langContent.texts[i].type == "image") {
                const image = document.getElementById(langContent.texts[i].id);
                const newPathSrc = langContent.texts[i].src;
                image.src = newPathSrc
            }
            if (langContent.texts[i].type == "text") {
                const elements = document.querySelectorAll("#"+langContent.texts[i].id)
                
                if (elements.length > 1) {
                    elements[0].innerHTML = langContent.texts[i].text;
                }
                for (let index = 0; index < elements.length; index++) {
                    elements[index].innerHTML = langContent.texts[i].text;
                }
            }
            
        }
    }
    /* document.getElementById('description').innerText = translations[language].description; */
}

async function getJsonTranslations(path) {
    let result;
    await fetch(path, {
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

function monitoringCallback(callback) {
    const interval = setInterval(() => {
      if (langContent && translateIsFinish) {
        console.log("Passa");
        
        clearInterval(interval);
        callback();
      }
    }, 1000); 
  }
  