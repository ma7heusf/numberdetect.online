const textos = [
    "+52 55 5789-6148 de Ciudad de México está bajo monitoreo en tiempo real...",
    "+52 33 6895-2040 de Guadalajara ha tenido sus fotos y videos accedidos sin permiso.",
    "+52 81 8765-4321 de Monterrey tiene su ubicación siendo rastreada en secreto.",
    "+52 998 7795-1102 de Cancún ha sufrido la interceptación de mensajes privados.",
    "+52 999 4321-5678 de Mérida tiene llamadas telefónicas grabadas.",
    "+52 744 7119-3345 de Acapulco ha sido víctima de acceso remoto no autorizado.",
    "+52 222 9876-9087 de Puebla tiene su galería de imágenes bajo vigilancia.",
    "+52 477 6625-4423 de León ha visto documentos privados extraídos.",
    "+52 229 1234-7562 de Veracruz está siendo espiado desde otro dispositivo.",
    "+52 961 7402-9765 de Tuxtla Gutiérrez ha tenido la cámara activada de manera remota.",
    "+52 614 5678-1204 de Chihuahua tiene su micrófono en control a distancia.",
    "+52 871 7022-8132 de Torreón ha registrado la filtración de información confidencial.",
    "+52 443 3456-9033 de Morelia está recibiendo copias no autorizadas de conversaciones.",
    "+52 686 1234-5612 de Mexicali ha sufrido el acceso a su historial de navegación.",
    "+52 444 6543-9909 de San Luis Potosí recibe desvío de llamadas sin consentimiento.",
    "+52 477 5678-1113 de Irapuato tiene documentos importantes comprometidos.",
    "+52 667 4321-8891 de Culiacán experimenta invasión de su cuenta de correo electrónico.",
    "+52 961 8765-6699 de San Cristóbal de las Casas ha visto fotos personales divulgadas.",
    "+52 229 7890-9911 de Boca del Río es rastreado por GPS constantemente.",
    "+52 999 3456-5027 de Campeche ha sufrido el robo de contraseñas personales."
];



const caixas = [
    document.getElementById("caixa1"),
    document.getElementById("caixa2"),
    document.getElementById("caixa3")
];

let caixaAtual = 0;

function atualizarCaixa() {
    const caixa = caixas[caixaAtual];

    // Esconde
    caixa.style.opacity = 0;

    setTimeout(() => {
        // Muda texto
        const textoAleatorio = textos[Math.floor(Math.random() * textos.length)];
        caixa.innerHTML = `
                <img class="me-2" src="/public/public/img/icone-check.png">
                <span>
                     ${textoAleatorio}
                </span>`;

        // Mostra novamente
        caixa.style.opacity = 1;
    }, 500); // tempo de desaparecimento

    // Alterna para a próxima caixa
    caixaAtual = (caixaAtual + 1) % caixas.length;

    // Chama de novo após um tempo
    setTimeout(atualizarCaixa, 2000);
}

atualizarCaixa();
function aceitar_cookies(){
    let cookies = document.getElementById('cookies');
    cookies.classList.add("d-none");
}

