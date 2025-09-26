console.log("Carrega script globalAnimation");

function cardText(text, img = pathCard) {
  const div = document.createElement('div');
  div.classList.add('frame');
  div.style = `opacity: 0;aspect-ratio: 3/4;display: flex;align-items: center;justify-content: center;position: absolute;filter: drop-shadow(0px 1px 3px #9a9a9a);`;
  if (window.innerWidth <= 1400 && window.innerWidth > 768) {
    div.style.width = '130px';
  } else if (window.innerWidth <= 768) {
    div.style.width = '38vw';
  } else {
    div.style.width = '150px';
  }
  const cardImage = new Image();
  cardImage.style = `aspect-ratio: 3/4;width: 100%;position: absolute;z-index: -1;`;
  const content = `<span style='position: absolute;font-size: 1rem;text-transform: uppercase;;width: 100%;left: 0;
    height: 100%;top: 0;display: flex;align-items: center;justify-content: center;text-shadow: 2px 0px 5px black;'>${text}</span>`;
  cardImage.src = img;
  div.appendChild(cardImage);
  div.innerHTML += content;
  return div;
}

function framePhrase(valuePrimary, valueScound) {
  const div = document.createElement('p');
  div.classList.add('frame');
  if (window.innerWidth <= 768) {
    div.style += `traition: 1s;
        position: absolute;
        opacity: 0;
        max-width: 100%;
        width: 100%;
    `;
  } else {
    div.style += `traition: 1s;
        position: absolute;
        opacity: 0;
        max-width: 400px;
    `;
  }
  const content = `<span class='primary'>${valuePrimary}</span>
    ${valueScound ? `<span style="color: ##AF3589;"> ${valueScound}</span>` : ''}`;
  div.innerHTML = content;
  return div;
}

function newCard(value) {
  const cardImage = new Image();
  cardImage.src = pathCard;
  cardImage.style = `aspect-ratio: 3/4;width: 100%;position: absolute;z-index: -1;`;
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('frame');
  cardDiv.classList.add('card');
  cardDiv.style = `opacity: 0;aspect-ratio: 3/4;display: flex;align-items: center;justify-content: center;position: absolute;filter: drop-shadow(0px 1px 3px #9a9a9a);`;

  if (window.innerWidth <= 1400 && window.innerWidth > 768) {
    cardDiv.style.width = '130px';
  } else if (window.innerWidth <= 768) {
    cardDiv.style.width = '30vw';
  } else {
    cardDiv.style.width = '150px';
  }
  cardDiv.appendChild(cardImage);

  if (value.length === 2) {
    const caracter = value.split('');
    cardDiv.innerHTML += `<span class="primary">${caracter[0]}</span><span class="secound">${caracter[1]}</span>`;
  } else if (value.length === 4) {
    const caracter = value.split('');
    cardDiv.style.flexDirection = 'column';
    cardDiv.innerHTML += `<div><span style="font-size:65px;">${caracter[0]}</span><span style="font-size:65px;">${caracter[1]}</span></div><div><span style="font-size:65px;">${caracter[2]}</span><span style="font-size:65px;">${caracter[3]}</span></div>`;
  } else {
    const content = `<span>${value}</span>`;
    cardDiv.innerHTML += content;
  }
  return cardDiv;
}

function newElementText(text) {
  const div = document.createElement('p');
  div.classList.add('frame');
  div.style += `transition: 1s;
      opacity: 0;
      position: absolute;
      margin: 0;
      `;
  const content = `<span>${text}</span>`;
  div.innerHTML = content;
  return div;
}

function newElementTitle(text) {
  const div = document.createElement('p');
  div.classList.add('frame');
  div.style += `traition: 1s;
      color: #fff;
      width: fit-content;
      opacity: 0;
      position: absolute;
      margin: 0;
      `;
  if (window.innerWidth <= 500) {
    div.style.fontSize = '1.25rem';
  }
  const content = `<span>${text}</span>`;
  div.innerHTML = content;
  return div;
}

function listGenerator(itensValue = []) {
  const ul = document.createElement('ul');
  ul.classList.add('frame');
  ul.classList.add('list');
  ul.style += `
    margin: 0px;
    list-style: none;
    height: 0;
    width: 100%;
    padding: 0px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;`;
  const item = itensValue.map((item) => {
    const li = `<li style="margin-bottom: 10px;display: inline-block;">${item}</li>`;
    ul.innerHTML += li;
  });
  return ul;
}

function newImage(path, width, height) {
  const cardImage = new Image();
  cardImage.src = path;
  cardImage.classList.add('frame');
  cardImage.classList.add('image');
  cardImage.style = `position: absolute;max-width: 100%;opacity: 0;`;
  cardImage.style.width = `${width ? width : 'auto'}`;
  cardImage.style.height = `${height ? height : 'auto'}`;
  return cardImage;
}

function animationFrame(item, currentAnimation) {
  animation = currentAnimation;
  animation.pause();
  if (item.type !== 'list_text' && item.type !== 'form' && item.type !== 'data_layer' && item.type !== 'codeExtend') {
    const element = createElement(item.content, item.type, item.style);
    if (item.style) {
      for (const key in item.style) {
        element.style[key] = item.style[key];
      }
    }
    if (item.type === 'image') {
      element.addEventListener('load', () => {
        item.efects.forEach((efect, index) => {
          animationConstructor(efect, element, animation, item, index, item.moving, item.dataLayer, item.glowUp);
        });
      });
    }

    handleAddChild(element, item.display);
    item.efects.forEach((efect, index) => {
      animationConstructor(efect, element, animation, index, item.moving, item.dataLayer, item.glowUp);
    });
  } else if (item.type === 'form') {
    handleDisplayForm(item.content, item.time, animation);
  } else if (item.type === 'data_layer') {
    const span = document.createElement('span');
    modalElement.appendChild(span);
    animation.to(
      span,
      {
        onComplete: () => {
          dataLayer.push(item.dataLayer);
        },
      },
      item.time
    );
  } else if (item.type === 'codeExtend') {
    console.log('CHAMA ANIMAÇÂO EXTERNA');
    const codeExtendValue = codeExtendObject.filter((code) => code.name === item.name);
    if (codeExtendValue) {
      codeExtendValue[0].function(item.time, item.endTime);
    }
  } else {
    const itensName = item.itens.map((li) => {
      return replaceContent(li.nameItem);
    });
    const listElement = createElement(itensName, item.type);
    if (item.style) {
      for (const key in item.style) {
        listElement.style[key] = item.style[key];
      }
    }
    modalElement.appendChild(listElement);
    const itensElements = listElement.childNodes;

    item.itens.forEach((item, index) => {
      item.efects.forEach((efect) => {
        animationConstructor(efect, itensElements[index], animation, index, item.moving, item.dataLayer, item.glowUp);
      });
    });
  }
}

function handleAddChild(element, display) {
  if (display) {
    if (display === 'mobile' && window.innerWidth <= 500) {
      modalElement.appendChild(element);
    } else if (display === 'desktop' && window.innerWidth > 500) {
      modalElement.appendChild(element);
    } else if (display === 'tablet' && window.innerWidth > 768 && window.innerWidth < 1200) {
      modalElement.appendChild(element);
    }
  } else {
    modalElement.appendChild(element);
  }
}

function createElement(content, type) {
  /* const typeAction = {
    text: () =>  newElementText(replaceContent(content)),
    pharse: () =>  framePhrase(replaceContent(content[0]), replaceContent(content[1])),
    list_text: () => listGenerator(replaceContent(content)) ,
    title: () =>  newElementTitle(replaceContent(content)),
    card: () =>  newCard(replaceContent(content)),
    card_text: () => cardText(replaceContent(content)),
    image: () =>  newImage(replaceContent(content)),
  }
  typeAction[type]() ?? console.error(`O type não é uma valor válido! Type: ${type}`) */

  switch (type) {
    case 'text':
      return newElementText(replaceContent(content));
      break;
    case 'pharse':
      return framePhrase(replaceContent(content[0]), replaceContent(content[1]));
      break;
    case 'list_text':
      return listGenerator(replaceContent(content));
      break;
    case 'title':
      return newElementTitle(replaceContent(content));
      break;
    case 'card':
      return newCard(replaceContent(content));
      break;
    case 'card_text':
      return cardText(replaceContent(content));
      break;
    case 'image':
      return newImage(replaceContent(content));
      break;
    default:
      break;
  }
}

function handleDisplayForm(formValue, time, animation) {
  formsSections.forEach((form) => {
    if (formValue === form.name) {
      if (form === '[cta]') {
        animation.to(form.section, { onComplete: handleCta }, time);
        return;
      }
      animation.to(form.section, { onComplete: formIsTrue }, time);
    }
  });
}

function animationConstructor(efect, element, animation, index, moving, datalayerEvent, glowUp) {
  let position_i, position_f, spacing, event;
  let from = efect.from_animation;
  let to = efect.to_animation;
  if (glowUp) {
    element.classList.add('glowUp');
  }
  if (window.innerWidth <= 768) {
    spacing = 10;
  } else {
    spacing = 30;
  }
  const positions = [
    { name: 'top_center', values: { x: modelVW / 2 - element.clientWidth / 2, y: spacing } },
    { name: 'top_left', values: { x: spacing, y: spacing } },
    { name: 'top_left_center', values: { x: modelVW / 3 - element.clientWidth / 3, y: spacing } },
    { name: 'top_right', values: { x: modelVW - element.clientWidth - spacing, y: spacing } },
    { name: 'top_right_center', values: { x: modelVW / 1.5 - element.clientWidth / 1.5 + 10, y: spacing } },

    { name: 'center', values: { x: modelVW / 2 - element.clientWidth / 2, y: modelVH / 2 - element.clientHeight / 2 } },
    { name: 'center_left', values: { x: spacing, y: modelVH / 2 - element.clientHeight / 2 } },
    { name: 'center_left_center', values: { x: modelVW / 3 - element.clientWidth / 3, y: modelVH / 2 - element.clientHeight / 2 } },
    { name: 'center_right', values: { x: modelVW - element.clientWidth - spacing, y: modelVH / 2 - element.clientHeight / 2 } },
    { name: 'center_right_center', values: { x: modelVW / 1.5 - element.clientWidth / 1.5 + 10, y: modelVH / 2 - element.clientHeight / 2 } },

    { name: 'bottom_center', values: { x: modelVW / 2 - element.clientWidth / 2, y: modelVH - element.clientHeight - spacing } },
    { name: 'bottom_right', values: { x: modelVW - element.clientWidth - spacing, y: modelVH - element.clientHeight - spacing } },
    { name: 'bottom_right_center', values: { x: modelVW / 1.5 - element.clientWidth / 1.5 + 10, y: modelVH - element.clientHeight - spacing } },
    { name: 'bottom_left', values: { x: spacing, y: modelVH - element.clientHeight - spacing } },
    { name: 'bottom_left_center', values: { x: modelVW / 3 - element.clientWidth / 3, y: modelVH - element.clientHeight - spacing } },

    { name: 'center_center_top', values: { x: modelVW / 2 - element.clientWidth / 2, y: modelVH / 3 - element.clientHeight / 3 } },
    { name: 'center_center_top_left', values: { x: spacing, y: modelVH / 3 - element.clientHeight / 3 } },
    { name: 'center_center_top_right', values: { x: modelVW - element.clientWidth - spacing, y: modelVH / 3 - element.clientHeight / 3 } },
    { name: 'center_center_bottom', values: { x: modelVW / 2 - element.clientWidth / 2, y: modelVH / 1.3 - element.clientHeight / 1.3 } },
    { name: 'center_center_bottom_left', values: { x: spacing, y: modelVH / 1.3 - element.clientHeight / 1.3 } },
    { name: 'center_center_bottom_right', values: { x: modelVW - element.clientWidth - spacing, y: modelVH / 1.3 - element.clientHeight / 1.3 } },
  ];
  if (efect.position_from) {
    const coordinates = positions.filter((item) => {
      if (item.name === efect.position_from) {
        return item;
      }
    });
    position_i = coordinates[0].values;
    from = { ...from, ...position_i, ...event };
  }
  if (efect.position_to) {
    const coordinates = positions.filter((item) => {
      if (item.name === efect.position_to) {
        return item;
      }
    });
    position_f = coordinates[0].values;
    to = { ...to, ...position_f };
  }
  if (efect.type_animation === 'fromTo') {
    if (datalayerEvent || (moving && index === 0)) {
      animation.fromTo(
        element,
        efect.duration,
        from,
        {
          ...to,
          onComplete:
            moving && datalayerEvent
              ? () => {
                  const tl = new TimelineMax({ repeat: -1 });
                  tl.to(element, 1, { scale: 1.05 });
                  tl.to(element, 1, { scale: 1 });
                  dataLayer.push(datalayerEvent);
                }
              : moving
              ? handleMoving
              : () => {
                  dataLayer.push(datalayerEvent);
                },
        },
        efect.time
      );
    } else {
      animation.fromTo(element, efect.duration, from, to, efect.time);
    }
  } else if (efect.type_animation === 'to') {
    animation.to(element, efect.duration, to, efect.time);
  } else {
    animation.from(element, efect.duration, from, efect.time);
  }
}

function handleMoving() {
  const tl = new TimelineMax({ repeat: -1 });
  const element = this._targets[0];
  tl.to(element, 1, { scale: 1.05 });
  tl.to(element, 1, { scale: 1 });
}

function handleGlowUP(element) {
  const tl = new TimelineMax({ repeat: -1 });
  tl.to(element, 1, { css: { filter: 'drop-shadow(0 0 0.375rem rgb(255, 255, 255, 0.3))' } });
  tl.to(element, 1, { css: { filter: 'drop-shadow(0 0 0 rgb(255, 255, 255, 0.3))' } });
}

function miniCards(valueName, valueNumbers, isVoewl) {
  const div = document.createElement('div');
  const size = window.innerWidth <= 500 ? 'width: 25px;height: 25px;font-size: 0.9375rem;' : 'width: 35px;height: 45px;font-size: 1.25rem;';
  div.style = `
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  font-weight: 500;
  position: absolute;
  opacity: 0;
  `;
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const primaryStyle = `background: rgb(26, 50, 84);color: #fff;${size}border-radius: 5px;box-shadow: rgb(27, 26, 26) 0px 1px 6px;display: flex;align-items: center;justify-content: center;line-height: 0;${
    window.innerWidth <= 500 ? 'margin-top: 40px;' : 'margin-top: 60px;'
  }`;
  const secoundStyle = `background: #ffdb60;color: #fff;${size}border-radius: 5px;box-shadow: rgb(27, 26, 26) 0px 1px 6px;display: flex;align-items: center;justify-content: center;line-height: 0;position: absolute;${
    window.innerWidth <= 500 ? 'top:80px;' : 'top: 120px;'
  }`;
  div.classList.add('frame');
  div.classList.add('miniCard');

  valueName.filter((item, index) => {
    if (isVoewl) {
      if (item !== ' ') {
        const itemUp = item
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase();
        if (vowels.includes(itemUp)) {
          const primarySpan = `<span class="vowelCard" style='${primaryStyle}'>${item}<span>`;
          const secoundSpan = `<span class="numberCard" style='${secoundStyle}'>${valueNumbers[index]}<span>`;
          const divCard = document.createElement('div');
          divCard.innerHTML += primarySpan;
          divCard.innerHTML += secoundSpan;
          div.appendChild(divCard);
        } else {
          const span = `<span class="consonantCard" style='${primaryStyle}'>${item}<span>`;
          div.innerHTML += span;
        }
      } else {
        if (window.innerWidth <= 500) {
          const br = '</br>';
          div.innerHTML += br;
        } else {
          const span = `<span style='width: 8px;'><span>`;
          div.innerHTML += span;
        }
      }
    } else {
      if (item !== ' ') {
        const primarySpan = `<span style='${primaryStyle}'>${item}<span>`;
        const secoundSpan = `<span style='${secoundStyle}'>${valueNumbers[index]}<span>`;
        const divCard = document.createElement('div');
        divCard.innerHTML += primarySpan;
        divCard.innerHTML += secoundSpan;
        div.appendChild(divCard);
      } else {
        if (window.innerWidth <= 500) {
          const br = '</br>';
          div.innerHTML += br;
        } else {
          const span = `<span><span>`;
          div.innerHTML += span;
        }
      }
    }
  });
  return div;
}
