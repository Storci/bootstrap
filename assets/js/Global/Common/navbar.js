//  definisce l'url di base della pagina attuale (in questo caso della pagina index.html).
//  il risultato è http(s)://xxx.xxx.xxx.xxx:xxxx
//  baseURL verrà utilizzato come base per il cambio pagina.
let baseURL = window.location.protocol + "//" + window.location.host
let pageURL = window.location.href

// Attende che siano stati caricati tutti gli script in defer
$(document).ready(function(){
	// Recupera lo stato dell'utente
	// A seconda che sia loggato o no, visualizza o nasconde alcuni elementi della navbar
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			// Visualizza il tasto di logout
			$("#IDNavItemLogout").show()
			// Nasconde il tasto di login
			$("#IDNavItemLogin").hide()
			// Imposta il nome utente
			$("#IDNavItemUsername").text(user.email)
			// Visualizza l'utente loggato
			$("#IDNavItemUsername").show()
		} else {
			// Nasconde il tasto di logout
			$("#IDNavItemLogout").hide()
			// Visualizza il tasto di login
			$("#IDNavItemLogin").show()
			// Cancella il nome utente
			$("#IDNavItemUsername").text("")
			// Nasconde l'utente loggato
			$("#IDNavItemUsername").hide()
		}
	});
})

// Esege la seguente funzione al click del pulsante di logout
$("#IDNavItemLogout").click(function(){
	// Imposta la localstorage con il percorso della pagina in cui mi trovo
	localStorage.setItem('urlPage', pageURL)
	// Funzione che effettua il logout dell'utente connesso.
	firebase.auth().signOut()
	// Utente disconnesso
	.then(() => {
		// Carica la pagina.
		window.location.href = baseURL + "/index.html"
	})
	// Errore nella disconnessione
	.catch((error) => console.error(error) )
})

$('#storci_logo').click(el =>{ window.location.href = baseURL + "/index.html" })
$('#storci_logo').css('cursor', 'pointer')
