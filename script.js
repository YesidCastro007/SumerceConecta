
let utterance;

function readPageContent() {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    return;
  }

  const content = `
    Bienvenidos a SumerceConecta, una red social para conectar campesinos, clientes finales y transportadores.
    En la parte superior, hay una barra de navegación con enlaces a Registro, Información y Conectar.
    En el centro, hay un título grande y una descripción de la plataforma.
    También hay un botón que permite escuchar esta descripción.`;

  utterance = new SpeechSynthesisUtterance(content);
  utterance.lang = 'es-CO';
  utterance.rate = 1;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
}
