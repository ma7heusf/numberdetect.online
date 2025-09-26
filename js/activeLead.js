// src/components/activeLead.js
// Função reutilizável para ativar lead em campanhas GetResponse

const tagLang = {
  'jp': 'y',
  'en': '2',
  'ru': 'p',
  'it': 'Y',
  'de': '8',
  'fr': '7',
  'es': 'I',
  'pt': 'f'
};

const funnelTypes = new Map([
  [
    'destiny',
    {
      value: 'p',
      listTags: {
        'mdv_pt_teste_cadastrou': 'B',
        'mdv_ru_teste_cadastrou': 'j',
        'mdv_it_teste_cadastrou': 'z',
        'mdv_fr_teste_cadastrou': 't',
        'mdv_es_teste_cadastrou': 'c',
        'mdv_de_teste_cadastrou': 'L',
        'mdv_en_teste_cadastrou': 'x'
      }
    }
  ],
  [
    'name',
    {
      value: 'p',
      listTags: {
        'mdn_pt_teste_cadastrou': 'G5',
        'mdn_ru_teste_cadastrou': 'Gr',
        'mdn_it_teste_cadastrou': 'G4',
        'mdn_fr_teste_cadastrou': 'Gv',
        'mdn_es_teste_cadastrou': 'Gp',
        'mdn_de_teste_cadastrou': 'Gs',
        'mdn_en_teste_cadastrou': 'Go'
      }
    }
  ],
  [
    'astrologia',
    {
      value: 'M',
      listTags: {
        'mac_pt_teste_cadastrou': 'GU',
        'mac_ru_teste_cadastrou': '5J',
        'mac_it_teste_cadastrou': '5E',
        'mac_fr_teste_cadastrou': '5l',
        'mac_es_teste_cadastrou': 'GD',
        'mac_de_teste_cadastrou': '5M',
        'mac_en_teste_cadastrou': '5Q'
      }
    }
  ],
  [
    'signo',
    {
      value: 'M',
      listTags: {
        'mh_pt_teste_cadastrou': '5H',
        'mh_ru_teste_cadastrou': 'lw',
        'mh_it_teste_cadastrou': 'lf',
        'mh_fr_teste_cadastrou': '5S',
        'mh_es_teste_cadastrou': '5R',
        'mh_de_teste_cadastrou': '5P',
        'mh_en_teste_cadastrou': 'l2'
      }
    }
  ],
  [
    'chakras',
    {
      value: 'fP',
      listTags: {
        'ppf_pt_teste_cadastrou': 'le',
        'ppf_ru_teste_cadastrou': 'fI',
        'ppf_it_teste_cadastrou': 'lm',
        'ppf_fr_teste_cadastrou': 'l0',
        'ppf_es_teste_cadastrou': 'lq',
        'ppf_de_teste_cadastrou': 'lg',
        'ppf_en_teste_cadastrou': 'lV'
      }
    }
  ]
]);

/**
 * Ativa um lead na campanha GetResponse.
 * @param {Object} params - Parâmetros necessários para o envio do lead.
 * @param {string} params.tagName - Nome da tag para identificar o evento.
 * @param {string} params.userEmail - Email do usuário.
 * @param {string} params.allNameValue - Nome completo do usuário.
 * @param {Object} params.paramsUrl - Parâmetros da URL (utm_source, utm_medium, etc).
 * @param {string} params.genderValue - Gênero do usuário.
 * @param {string} params.dateEua - Data de nascimento (YYYY-MM-DD).
 * @param {string|number} params.dayValue - Dia de nascimento.
 * @param {Object} params.monthObject - Objeto do mês (deve conter .name).
 * @param {string|number} params.yearValue - Ano de nascimento.
 * @param {string|number} params.numberDestiny - Número do destino.
 * @param {string|number} params.expreValue - Número de expressão.
 * @param {string|number} params.numberSoul - Número da alma.
 * @param {string} params.signValue - Signo.
 * @param {string} params.stateValue - Estado civil.
 * @param {string} params.currentLang - Código do idioma atual.
 * @returns {Promise<void>}
 */
window.activeLead = async function ({
  tagName,
  userEmail,
  allNameValue,
  paramsUrl,
  genderValue,
  dateEua,
  dayValue,
  monthObject,
  yearValue,
  numberDestiny,
  expreValue,
  numberSoul,
  signValue,
  stateValue,
  currentLang,
  type
}) {
  const data = {
    email: userEmail,
    name: decodeURIComponent(allNameValue),
    customFieldValues: {
      GI: paramsUrl.utm_source,
      G7: paramsUrl.utm_medium,
      G8: paramsUrl.utm_campaign,
      GY: paramsUrl.utm_content,
      y: genderValue,
      GE: dateEua,
      Gw: dayValue,
      Gu: monthObject?.name,
      Gn: yearValue,
      G2: numberDestiny,
      Gy: expreValue,
      Gh: numberSoul,
      GB: signValue,
      GC: stateValue,
    }
  };

  const payload = {
    campaign: {
      campaignId: currentLang ? tagLang[currentLang] : 'f',
    },
    tags: [
      { tagId: funnelTypes.get(type)?.value },
      { tagId: funnelTypes.get(type)?.listTags[tagName] }
    ],
    ...data
  };
  debugger
  try {
    await fetch('https://astranumerica.net/gr/getresponse.php', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error in request for Active campaign:', error);
  }
}; 