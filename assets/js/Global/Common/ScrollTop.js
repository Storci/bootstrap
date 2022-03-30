// Qunado l'utente fa un scroll piu di 50 pixel appare l'icona
window.onscroll = function() { scrollFunction() };

// Definisce la variabile come globale
let toTop

// Attende che siano stati caricati tutti gli script in defer
$(document).ready(function(){
  toTop = anime({
    targets: ['html', 'body'],
    scrollTop:0,
    easing: 'easeInOutBack',
    duration: 75,
    autoplay: false,
  });
})

// La funzione visualizza l'icona per riportare in cima la pagina
function scrollFunction() {
    // Se la pagina viene scrollata verso il basso di più di 50px viene visualizzata l'icona
    // Altrimenti viene nascosta
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        $("#gotoTop").css("display", "flex");
    } else {
      $("#gotoTop").css("display", "none");
    }
}

// La funzione riporta la pagina in cima tramite animazione
// quando viene premuto il div
function topFunction() { toTop.play() }
