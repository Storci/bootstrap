// Carica le funzioni globali
import * as tw from "../Global/Thingworx/thingworx_api_module.js"
import * as fb from "../Global/Firebase/firebase_auth_module.js"
import * as lang from "../Global/Common/Translation.js"

// definisce l'url di base della pagina attuale (in questo caso della pagina index.html).
// il risultato è http(s)://xxx.xxx.xxx.xxx:xxxx
// baseURL verrà utilizzato come base per il cambio pagina.
let baseURL = window.location.protocol + "//" + window.location.host;
let pageURL = window.location.href
// Recupera il nome dell'utente da firebase, controlla che sia loggato.
// Nel caso non fosse loggato richiama la pagina di login
fb.onAuthStateChanged_2(baseURL, pageURL)
// Recupera dei dati dalle local storage
let selectedCustomer = localStorage.getItem("global_selected_customer")
let selectedLine 		 = localStorage.getItem("global_selected_line")
let entityName			 = localStorage.getItem('global_selected_line_entityName')
// Recupera la lingua utilizzata dall'utente e sostituisce tutti i testi
// ATTENZIONE - Questa istruzione traduce solamente i testi statici e non
// i testi caricati dalle funzioni.
lang.getLanguage()

// Dichiara la varibile come JSON
let customerList = {}
// Prova a recuperare l'elenco dei clienti dalla localstorage
// La local storage potrebbe essere vuota
try{ customerList = JSON.parse(localStorage.getItem('customerList')) }catch(e){ console.warn(e) }
// Genera la lista dei clienti presenti
// Viene generata una card per ciascun cliente.
// Se cliccata, la card, porta nella pagina del cliente
// Controlla se la lista era salvata in locale, altrimenti bisogna richiederla da tw
if(customerList == null){
	// Recupera la lista dei clienti presenti da tw
	tw.getCustomersList()
	.then(customerList => {
		// Genera html della card del cliente
		createCard(customerList)
		// Esegue la funzione dopo la creazione delle card.
		// La funzione recupera i valori da TW da visualizzare nelle card
		getCustomerInfo(customerList)
		// Esegue la funzione ogni 10 sec
		setInterval(getCustomerInfo, 10000, customerList)

		localStorage.setItem('customerList', JSON.stringify(customerList))
	})
	.catch(e => console.error(e))
}else{
	// Genera html della card del cliente
	createCard(customerList)
	// Esegue la funzione dopo la creazione delle card.
	// La funzione recupera i valori da TW da visualizzare nelle card
	getCustomerInfo(customerList);
	// Esegue la funzione ogni 10 sec
	setInterval(getCustomerInfo, 30000, customerList);
}
//setInterval(getConnectionStatus, 10000, customerList)


// ******************** FUNCTION ********************
// La funzione crea il codice html per aggiungere una card alla row.
// Viene anche aggiunta la funzione di click su ogni card.
function createCard(customerList){
	// Effettua un ciclo per ogni cliente trovato
	customerList.rows.forEach((el, i) => {
		// Genera un id per la singola card
		let id = "IDCard" + i
		// Recupera dall'entityName il nome del customerInfo
		// Toglie le prime due stringhe 'Storci' e 'Thing'.
		// es. EntityName: Storci.Thing.Antiche_Tradizioni_Di_Gragnano
		let customerName = el.name.split('.')[2]
		// Recupera l'immagine del cliente
		let image = baseURL + "/assets/img/Loghi/" + customerName + "." + "svg"
		// Carica un'immagine base nel caso l'immagine del cliente non venga trovata
		let onerror = "javascript:this.src='/assets/img/image_black_48dp.svg'"
		// Genera l'html della card
		let card =	'	<div id="' + id + 'Column" class="col col-customer">'
		card  +=	'	  <div id="' + id + '" class="card card-hover ripple h-100 card-border">'
		card 	+=	'		<div class="card-body">'
		card 	+=	'			<div class="row">'
		card 	+=	'				<div class="col text-center"><img id="' + id + 'Image" src="' + image + '" alt="logo" onerror="' + onerror + '" style="opacity: 0.75;height: 75px;width: 200px;" /></div>'
		card 	+=	'				<div class="w-100" style="padding: 12px;"></div>'
		// RIGA NOME CLIENTE
		card 	+=	'				<div class="col">'
		card 	+=	'					<h5 id="' + id + 'CustomerName" class="card-title-' + i + '" style="color: var(--bs-heading-high-emphasis);">' + customerName.replace(/_/g, " ") + '</h5>'
		card 	+=	'				</div>'
		card 	+=	'				<div class="w-100" style="padding: 6px;"></div>'
		card 	+=	'				<div class="col-7 align-self-center">'
		// RIGA STATO CONNESSIONE
		card 	+=	'					<h6 class="card-subtitle card-label-' + i + '" style="margin: 0px;color: var(--bs-heading-medium-emphasis);font-size: 14px;min-height: 20px;">Stato Connessione</h6>'
		card 	+=	'				</div>'
		card 	+=	'				<div class="col-5 align-self-center">'
		card 	+=	'					<h6 id="' + id + 'ConnectionState" class="card-value-' + i + '" style="margin: 0px;font-size: 14px;min-height: 20px;color: var(--bs-heading-high-emphasis);">Non Connesso</h6>'
		card 	+=	'				</div>'
		card 	+=	'				<div class="w-100" style="padding: 6px;"></div>'
		// RIGA LINEA
		card 	+=	'				<div class="col-7 align-self-center line_' + id + '">'
		card 	+=	'					<h6 class="card-subtitle card-label-' + i + '" style="margin: 0px;color: var(--bs-heading-medium-emphasis);font-size: 14px;min-height: 20px;">Linea</h6>'
		card 	+=	'				</div>'
		card 	+=	'				<div class="col-5 align-self-center line_' + id + '"">'
		card 	+=	'					<h6 id="' + id + 'StatusLine" class="card-value-' + i + '" style="margin: 0px;font-size: 14px;min-height: 20px;color: var(--bs-heading-high-emphasis);">undefined</h6>'
		card 	+=	'				</div>'
		card 	+=	'				<div class="w-100 line_' + id + '" style="padding: 6px;"></div>'
		// RIGA CELLA
		card 	+=	'				<div class="col-7 align-self-center dryer_' + id + '">'
		card 	+=	'					<h6 class="card-subtitle card-label-' + i + '" style="margin: 0px;color: var(--bs-heading-medium-emphasis);font-size: 14px;min-height: 20px;">Celle</h6>'
		card 	+=	'				</div>'
		card 	+=	'				<div class="col-5 align-self-center dryer_' + id + '">'
		card 	+=	'					<h6 id="' + id + 'StatusCella" class="card-value-' + i + '" style="margin: 0px;font-size: 14px;min-height: 20px;color: var(--bs-heading-high-emphasis);">undefined<br /></h6>'
		card 	+=	'				</div>'
		card 	+=	'				<div class="w-100 dryer_' + id + '" style="padding: 6px;"></div>'
		// RIGA ALLARMI
		card 	+=	'				<div class="col-7 align-self-center">'
		card 	+=	'					<h6 class="card-subtitle card-label-' + i + '" style="margin: 0px;color: var(--bs-heading-medium-emphasis);font-size: 14px;min-height: 20px;">Allarmi</h6>'
		card 	+=	'				</div>'
		card 	+=	'				<div class="col-5 align-self-center">'
		card 	+=	'					<h6 id="' + id + 'Allarmi" class="card-value-' + i + '" style="margin: 0px;font-size: 14px;min-height: 20px;color: var(--bs-heading-high-emphasis);">undefined<br /></h6>'
		card 	+=	'				</div>'
		card 	+=	'				<div class="w-100" style="padding: 6px;"></div>'
		card 	+=	'			</div>'
		card 	+=	'		</div>'
		card 	+=	'	</div>'
		card 	+=	'</div>'

		if(el.isConnected){
			// Aggiunge la card alla lista
			$("#IDRowConnected").append(card)
		}else{
			// Aggiunge la card alla lista
			$("#IDRowDisconnected").append(card)
		}

		// Abilita onclick sulla card
		document.getElementById(id).onclick = function(){
			// salvo i dati nella local storage
			localStorage.setItem('global_selected_customer', customerName)
			localStorage.setItem('global_selected_line_entityName', el.name)
			// Carica la pagina.
			window.location.href = baseURL + "/Customers/CustomerInfo/Info.html"
		}
	})
}

// La funzione recupera i dati di ogni cliente da thingworx.
function getCustomerInfo(customerList){
	// Esegue il ciclo per ogni cliente presente
	customerList.rows.forEach((el, i) => {
		//
		let classCardTitle = '.card-title-' + i
		let classCardLabel = '.card-label-' + i
		let classCardValue = '.card-value-' + i

		// Genera l'id che identifica i campi della singola card da valorizzare
		let IDCard             = "#IDCard" + i
		let IDImage						 = "#IDCard" + i + "Image"
		let IDconnectionStatus = "#IDCard" + i + "ConnectionState"
		let IDlineaStatus      = "#IDCard" + i + "StatusLine"
		let IDcellaStatus      = "#IDCard" + i + "StatusCella"
		let IDallarmiStatus    = "#IDCard" + i + "Allarmi"
		// Genera il nome delle classi
		let ClassLine  = ".line_IDCard" + i
		let ClassDryer = ".dryer_IDCard" + i
		// Recupera il nome dell'entity
		let entityName =  el.name
		// Recupera i dati usando il nome della thing del cliente
		tw.getCustomersInfo(entityName)
			.then(customerInfo => {
				// Sostituisce i campi sottostanti con il valore recuperato da thingworx
				$(IDconnectionStatus).text(customerInfo.Connection_Status)
				$(IDallarmiStatus).text(customerInfo.Alarms_Status)
				// Controlla se sia presente la linea,
				// Se la variabile di Line_1_Status è uguale a 'Nessun Valore'
				// allora la linea non è presente e vengono nascosti i campi relativi
				// In caso contrario viene assegnato al campo il valore corretto dello stato linea
				if(customerInfo.Line_1_Status == 'Nessun Valore'){
					$(ClassLine).hide()
				}else{
					$(IDlineaStatus).text(customerInfo.Line_1_Status)
				}
				// Controlla se siano presenti le celle,
				// Se la variabile di Celle_1_Status è uguale a 'Nessun Valore'
				// allora le celle non sono presenti e vengono nascosti i campi relativi
				// In caso contrario viene assegnato al campo il valore corretto dello stato celle
				if(customerInfo.Celle_1_Status == 'Nessun Valore'){
					$(ClassDryer).hide()
				}else{
					$(IDcellaStatus).text(customerInfo.Celle_1_Status)
				}

				//Bianco
				$(IDCard).css("background-color","var(--bs-card-background-default)")
				$(classCardTitle).css("color","var(--bs-primary-color-label)")
				$(classCardLabel).css("color","var(--bs-heading-medium-emphasis)")
				$(classCardValue).css("color","var(--bs-heading-high-emphasis)")

				if(customerInfo.CustomerInProduction == 1 || customerInfo.CustomerInProduction == 2){
					// VERDE
					$(IDCard).css("background-color","var(--bs-card-background-green)")
					$(classCardTitle).css("color","var(--bs-card-title-green)")
					$(classCardLabel).css("color","var(--bs-card-label-green)")
					$(classCardValue).css("color","var(--bs-card-value-green)")
				}
				if(customerInfo.CustomerInProduction == 10){
					// VERDE
					$(IDCard).css("background-color","var(--bs-card-background-undefined)")
					$(IDImage).css("opacity", "0.15")
					$(classCardTitle).css("color","var(--bs-card-title-undefined)")
					$(classCardLabel).css("color","var(--bs-card-label-undefined)")
					$(classCardValue).css("color","var(--bs-card-value-undefined)")
				}
			})
			.catch(error => console.error(error))
	})
}

function getConnectionStatus(customerList){
	// Esegue il ciclo per ogni cliente presente
	customerList.rows.forEach((el, i) => {
		// Recupera il nome dell'entity
		let entityName =  el.name
		// Recupera i dati usando il nome della thing del cliente
		tw.getCustomersInfo(entityName)
		.then(customerInfo => {
			// Genera l'id che identifica i campi della singola card da valorizzare
			let IDCard = "#IDCard" + i + 'Column'
			if(customerInfo.CustomerInProduction == 10){
				console.log(entityName + ' Disconnesso')
				$(IDCard).detach().appendTo('#IDRowDisconnected')
			}else{
				console.log(entityName + ' Connesso')
				$(IDCard).detach().appendTo('#IDRowConnected')
			}
		})
		.catch(error => console.error(error))
	})
}
