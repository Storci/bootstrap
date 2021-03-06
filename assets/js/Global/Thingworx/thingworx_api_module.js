import * as am from "../amchart/amchart_functions.js"

let baseUrl   		 = 'https://storciiot.storci.com:8445/Thingworx/'
let appKey 				 = 'cdd83674-f63f-4535-9aa2-33ac5b70b52c'

/* I SERVIZI DI SEGUITO APPARTENGONO ALLA THING 'Storci.Thing.Manage.Bootstrap' */

// *** Impostazioni generiche ***
// Imposta il percorso della things di bootstrap
let bootstrapThing = 'Things/Storci.Thing.Manage.Bootstrap/Services/'
// Imposta i settings da utilizzare nelle REST API.
let settings = {
	"url"     : '',
	"method"  : "POST",
	"timeout" : 0,
	"headers" : {
		"appKey"	  : appKey,
		"Accept"	  : "application/json",
		"Content-Type": "application/json"
	},
	"data": ''
};


/*
	service_01_getDryersGeneralInfo
	l'entityName da passare deve corrispondere alla thing customer (es. Storci.Thing.Canossa)
	recupera i dati generali di tutte le celle installate dal cliente.
	i dati recuperati sono:
		- celle totali installate
		- celle attive
		- temperatura ambiente
		- umidità ambiente
		- allarmi attivi
*/
function service_01_getDryersGeneralInfo(entityName){
	// Definisce l'url da richiamare per la REST API
	settings.url  = baseUrl + bootstrapThing + 'service_01_getDryersGeneralInfo'
	settings.data = JSON.stringify({"entityName":entityName})
	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){ $.ajax(settings).done(response => resolve(response)) })
}

/*
	service_01_getDryersGeneralInfo
	l'entityName da passare deve corrispondere alla thing customer (es. Storci.Thing.Canossa)
	recupera i dati generali di tutte le celle installate dal cliente.
	i dati recuperati sono:
		- celle totali installate
		- celle attive
		- temperatura ambiente
		- umidità ambiente
		- allarmi attivi
*/
function service_02_getLinesGeneralInfo(entityName){
	// Definisce l'url da richiamare per la REST API
	settings.url  = baseUrl + bootstrapThing + 'service_02_getLinesGeneralInfo'
	settings.data = JSON.stringify({"entityName":entityName})
	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){ $.ajax(settings).done(response => resolve(response)) })
}






// Recupera il valore di una property di una thing
function getPropertyName(entityName, propertyName){
	// Definisce l'url da richiamare per la REST API
	var url = baseUrl + "Things/" + entityName + "/Properties/" + propertyName;

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "GET",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": ""
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => resolve(response));
	})
}


/* THING : Storci.Thing.Manage.Bootstrap */
// Recupera l'elenco dei clienti presenti
function getCustomersList(){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getCustomersList";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": ""
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => {resolve(response)});
	});
}
// Esegue una query verso influx e ritorna il risultato
function influxQuery(query){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/influxQuery";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"query" : query})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => {resolve(response)});
	});
}
// Recupera l'elenco dei gruppi macchina di un cliente
function getCustomerGroupMachine(customer, typeGroup){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getCustomerGroupMachine";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"Customer":customer, "TypeGroup":typeGroup})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => {resolve(response)});
	});
}
// Recupera l'elenco delle celle di un cliente
function getCustomerCells(customer){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getCustomerCells";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"Customer":customer})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => {resolve(response)});
	});
}
// Recupera il record dell'utente inserito nella DataTable Storci.DataTables.Customer_Users.
function getUser(username){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getUser";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"username":username})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => {resolve(response)});
	});
}
// Recupera i dati della cella
function getCellInfo(entityName){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getCellInfo";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => {resolve(response)});
	});
}
// Recupera i dati storici della cella
function getCellHistoryProductions(entityName, timeStart, timeEnd, filter){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getCellHistoryProductions";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName, "timeStart":timeStart, "timeEnd":timeEnd, "filter":filter})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => {resolve(response)});
	});
}
// Recupera la ricetta storica della cella
function getCellHistoryRecipe(entityName, timeStart, timeEnd){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getCellHistoryRecipe";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName, "timeStart":timeStart, "timeEnd":timeEnd})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => {resolve(response)});
	});
}
// Recupera i dati dell'impasto della linea
function getLineDoughInfo(entityName){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getLineDoughInfo";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => {resolve(response)});
	});
}
// Recupera le informazioni sullo stato delle macchine del cliente
function getCustomersInfo(entityName){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getCustomersInfo";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => resolve(response));
	})
}
// Recupera le informazione sulle machine del cliente
function  getCustomerLineMachine(entityName){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getCustomerLineMachine";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => resolve(response));
	})
}
//Recupera le informazione sulla Pressa
function  getLinePressInfo(entityName){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getLinePressInfo";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => resolve(response));
	})
}
// Recupera informazione sulla PastaInstant
function  getLinePastaInstantInfo(entityName){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getLinePastaInstantInfo";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => resolve(response));
	})
}
// Recupera informazione sul Avanzamento Telaio
function  getLineAvanzamentoTelaiInfo(entityName){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getLineAvanzamentoTelaiInfo";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => resolve(response));
	})
}
// Recupera informazione sul Omnidryer
function  getLineOmnidryerInfo(entityName){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getLineOmnidryerInfo";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => resolve(response));
	})
}
// Recupera informazione sul Stenditrice
function  getLineStenditriceInfo(entityName){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getLineStenditriceInfo";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => resolve(response));
	})
}
// Recupera informazione sul Trabatto
function  getLineTrabattoInfo(entityName){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getLineTrabattoInfo";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => resolve(response));
	})
}
// Recupera le informazioni della linea
function getLineInfo(entityName){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getLineInfo";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => resolve(response));
	})
}
// La funzione restituisce la lista dello storico produzioni dell'impasto
function getLineDoughHistoryProduction(filter, entityName, startTime, endTime){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getLineDoughHistoryProduction";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({'filter':filter, 'entityName':entityName, 'startTime':startTime, 'endTime':endTime})
	};

	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => resolve(response));
	})
}
// Recupera gli allarmi attivi della linea
function getLineAlertsActive(entityName){
	// Definisce l'url da richiamare per la REST API
	let url = baseUrl + "Things/Storci.Thing.Manage.Bootstrap/Services/getLineAlertsActive";

	// Imposta i settings da utilizzare nelle REST API.
	// Nel campo data vengono inseriti i parametri di ingresso del servizio di TW.
	let settings = {
		"url"     : url,
		"method"  : "POST",
		"timeout" : 0,
		"headers" : {
			"appKey"	  : appKey,
			"Accept"	  : "application/json",
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"entityName":entityName})
	};
	// Ritorna una promise, in questo modo il valore ritorna solamente quando la REST API è conclusa.
	return new Promise(function(resolve){
		// Esegue la chiamata REST API.
		$.ajax(settings).done(response => resolve(response));
	})
}

// COMMON FUNCTIONS

// Viene effettuata una query verso thingworx per recuperare
// il timestamp di inizio produzione. In questo modo i grafici
// vengono eliminati gli spazi vuoti del grafico presenti prima di ogni produzione
// Se viene generato un'errore sul recupero del timestamp di inizio produzione,
// il grafico partirà dalla mezzanotte del giorno attuale.
async function getDryerTimeRange(entityName){
	// Definisce le variabili come date
	let timeStart = new Date()
	let timeEnd   = new Date()
	// Imposta l'ora a mezzanotte del giorno attuale
	timeStart.setHours(0,0,0,0)
	// Recupera il timestamp dell'inizio di Produzione
	// Se non viene trovato rimane impostato il time a mezzanotte
	try{
		// Definisce la query da inviare a influxdb
		let query  = 'SELECT '
		query += '"Dati_Ciclo_Ciclo_On" '
		query += 'FROM "' + entityName + '" '
		query += 'WHERE time > ' + timeStart.getTime() + 'ms and time < ' + timeEnd.getTime() + 'ms '
		query += 'AND "Dati_Ciclo_Ciclo_On" =  true ORDER BY time DESC LIMIT 1'
		// Effettua la query a influxdb
		let response = await influxQuery(query)
		// Imposta il timestamp di inizio con il time recuperato da influxdb.
		// Ogni values di influx è jsonArray contenente il timestamp e tutte le colonne richieste dalla query
		// L'elemento 0 dell'array (el[0]) è il timestamp, sopra lo zero sono dati
		response.results[0].series[0].values.forEach(el => { timeStart = new Date(el[0]) })
		// Converte la variabile in timestamp e decrementa lo zoom di un'ora
		timeStart = Number(timeStart.getTime()) - 3600000
	}catch(e){
		console.error(e)
		// Converte la variabile in timestamp
		timeStart = Number(timeStart.getTime())
	}
	// Converte la variabile in timestamp ed incrementa lo zoom di un'ora
	timeEnd = Number(timeEnd.getTime()) + 3600000
  // Ritorna un json object con la data di inizio e fine
	return {'start':timeStart, 'end':timeEnd}
}
// Recupera la lista delle produzioni effettuate
// In base al range time impostato.
function getDryerHistoryProduction(idTable, entityName, timeStart, timeEnd, chart, query){
	// Recupera lo storico delle lavorazioni effettuate dalla cella
	getCellHistoryProductions(entityName, timeStart, timeEnd, '')
	.then(recipe => {
		// Cancella tutte le righe della tabella
		$(idTable).empty()
		// Per ogni ricetta trovata genera una nuova riga nella tabella
		recipe.rows.forEach((el, i) => {
			// Converte il timestamp in Date
			let timeStart = new Date(el.timeStart).toLocaleString();
			let timeEnd = new Date(el.timeEnd).toLocaleString();
			// Definisce l'id della riga della tabella
			let id = "IDHistoryTableRow" + i;
			// Definisce l'html della riga da aggiungere
			let row = '<tr id=' + id + ' class="hover_tr" style="border-style: none;background: var(--bs-table-bg);">'
			row    += '    <td style="font-size: 12px;border-style: none;">' + timeStart  + '</td>'
			row    += '    <td style="font-size: 12px;border-style: none;">' + timeEnd    + '</td>'
			row    += '    <td style="font-size: 12px;border-style: none;">' + el.ricetta + '</td>'
			row    += '    <td style="font-size: 12px;border-style: none;">' + el.durata  + '</td>'
			row    += '</tr>'
			// Aggiunge la riga alla tabella
			$(idTable).append(row)
			// Imposta i timestamp di inizio e fine essiccazione (il range temporale è allargato 30 min prima dell'inizio e 30 min dopo la fine)
			let timestampStart = el.timeStart - 1800000
			let timestampEnd   = el.timeEnd + 1800000
			// Controlla se la data è invalida, nel caso l'essiccazione è in corso e carica la data attuale
			if(timestampEnd == undefined || timestampEnd == null || timestampEnd == '' || Number.isNaN(timestampEnd)){
				timestampEnd = Date.now() + 1800000
			}
			// Abilita onclick sulla card
			document.getElementById(id).onclick = function(){
				// Aggiunge la classe table-primary alla riga seleziona e la rimuove dalle altre righe
				$(this).addClass('table-primary').siblings().removeClass('table-primary')
				// Definisce la query da inviare a influxdb
				let subquery = query.replaceAll('{1}', timestampStart).replaceAll('{2}', timestampEnd)
				// Recupera i dati da influxdb e li visualizza sul grafico
				am.setChartData(chart, subquery, '.lds-dual-ring.history-production-trend')
				// Nasconde l'icona del caricamento alla fine delle funzione + 1s dopo
				setTimeout(function() {	$('.lds-dual-ring.history-production-trend').hide() }, 1000)
			}
		})
    // Recupera la prima riga della tabella
		let elem = document.getElementById('IDHistoryTableRow0')
    // Definisce la variabile come click event
		let clickEvent = new Event('click');
    // Esegue l'evento dell'elemento, in questo modo simula il click
    // sulla prima riga della tabella, e viene caricato il grafico
		elem.dispatchEvent(clickEvent)
    // Finita la funzione aspetta un secondo prima di nascondere il widget dell'aggiornamento
    setTimeout(function() {	$('.lds-dual-ring.history-production-list').hide() }, 1000);
	})
	.catch(error => console.error(error))
}


// Viene effettuata una query verso thingworx per recuperare
// il timestamp di inizio produzione. In questo modo i grafici
// vengono eliminati gli spazi vuoti del grafico presenti prima di ogni produzione
// Se viene generato un'errore sul recupero del timestamp di inizio produzione,
// il grafico partirà dalla mezzanotte del giorno attuale.
async function getLineTimeRange(entityName){
	// Definisce le variabili come date
	let timeStart = new Date()
	let timeEnd   = new Date()
	// Imposta l'ora a mezzanotte del giorno attuale
	timeStart.setHours(0,0,0,0)
	// Recupera il timestamp dell'inizio di Produzione
	// Se non viene trovato rimane impostato il time a mezzanotte
	try{
		// Definisce la query da inviare a influxdb
		let query  = 'SELECT '
		query += '"Impasto_Ricetta_Produzione_In_Corso" '
		query += 'FROM "' + entityName + '" '
		query += 'WHERE time > ' + timeStart.getTime() + 'ms and time < ' + timeEnd.getTime() + 'ms '
		query += 'AND "Impasto_Ricetta_Produzione_In_Corso" =  true LIMIT 1'
		// Effettua la query a influxdb
		let response = await influxQuery(query)
		// Imposta il timestamp di inizio con il time recuperato da influxdb.
		// Ogni values di influx è jsonArray contenente il timestamp e tutte le colonne richieste dalla query
		// L'elemento 0 dell'array (el[0]) è il timestamp, sopra lo zero sono dati
		response.results[0].series[0].values.forEach(el => { timeStart = new Date(el[0]) })
		// Converte la variabile in timestamp e decrementa lo zoom di un'ora
		timeStart = Number(timeStart.getTime()) - 3600000
	}catch(e){
		console.error(e)
		// Converte la variabile in timestamp
		timeStart = Number(timeStart.getTime())
	}
	// Converte la variabile in timestamp ed incrementa lo zoom di un'ora
	timeEnd = Number(timeEnd.getTime()) + 3600000
  // Ritorna un json object con la data di inizio e fine
	return {'start':timeStart, 'end':timeEnd}
}
// Recupera la lista delle produzioni effettuate
// In base al range time impostato.
function getLineHistoryProduction(idTable, entityName, timeStart, timeEnd, chart, query){
	// Recupera lo storico delle lavorazioni effettuate dalla cella
	getLineDoughHistoryProduction('', entityName, timeStart, timeEnd)
	.then(recipe => {
		// Cancella tutte le righe della tabella
		$(idTable).empty()
		// Per ogni ricetta trovata genera una nuova riga nella tabella
		recipe.rows.forEach((el, i) => {
			// Converte il timestamp in Date
			let timeStart = new Date(el.timeStart).toLocaleString();
			let timeEnd = new Date(el.timeEnd).toLocaleString();
			// Definisce l'id della riga della tabella
			let id = "IDHistoryTableRow" + i;
			// Definisce l'html della riga da aggiungere
			let row = '<tr id=' + id + ' class="hover_tr" style="border-style: none;background: var(--bs-table-bg);">'
			row    += '    <td style="font-size: 12px;border-style: none;">' + timeStart  + '</td>'
			row    += '    <td style="font-size: 12px;border-style: none;">' + timeEnd    + '</td>'
			row    += '    <td style="font-size: 12px;border-style: none;">' + el.ricetta + '</td>'
			row    += '    <td style="font-size: 12px;border-style: none;">' + el.durata  + '</td>'
			row    += '</tr>'
			// Aggiunge la riga alla tabella
			$(idTable).append(row)
			// Imposta i timestamp di inizio e fine essiccazione (il range temporale è allargato 30 min prima dell'inizio e 30 min dopo la fine)
			let timestampStart = el.timeStart - 1800000
			let timestampEnd   = el.timeEnd + 1800000
			// Controlla se la data è invalida, nel caso l'essiccazione è in corso e carica la data attuale
			if(timestampEnd == undefined || timestampEnd == null || timestampEnd == '' || Number.isNaN(timestampEnd)){
				timestampEnd = Date.now() + 1800000
			}
			// Abilita onclick sulla card
			document.getElementById(id).onclick = function(){
				// Aggiunge la classe table-primary alla riga seleziona e la rimuove dalle altre righe
				$(this).addClass('table-primary').siblings().removeClass('table-primary')
				// Definisce la query da inviare a influxdb
				let subquery = query.replaceAll('{1}', timestampStart).replaceAll('{2}', timestampEnd)
				// Recupera i dati da influxdb e li visualizza sul grafico
				am.setChartData(chart, subquery, '.lds-dual-ring.history-production-trend')
				// Nasconde l'icona del caricamento alla fine delle funzione + 1s dopo
				setTimeout(function() {	$('.lds-dual-ring.history-production-trend').hide() }, 1000)
			}
		})
    // Recupera la prima riga della tabella
		let elem = document.getElementById('IDHistoryTableRow0')
    // Definisce la variabile come click event
		let clickEvent = new Event('click');
    // Esegue l'evento dell'elemento, in questo modo simula il click
    // sulla prima riga della tabella, e viene caricato il grafico
		elem.dispatchEvent(clickEvent)
    // Finita la funzione aspetta un secondo prima di nascondere il widget dell'aggiornamento
    setTimeout(function() {	$('.lds-dual-ring.history-production-list').hide() }, 1000);
	})
	.catch(error => console.error(error))
}

export{
	service_01_getDryersGeneralInfo,
	service_02_getLinesGeneralInfo,
	getPropertyName,
	getCustomersList,
	influxQuery,
	getCustomerGroupMachine,
	getCustomerCells,
	getUser,
	getCellInfo,
	getCellHistoryProductions,
	getCellHistoryRecipe,
	getLineDoughInfo,
	getCustomersInfo,
	getCustomerLineMachine,
	getLinePressInfo,
	getLinePastaInstantInfo,
	getLineAvanzamentoTelaiInfo,
	getLineOmnidryerInfo,
	getLineStenditriceInfo,
	getLineTrabattoInfo,
	getLineInfo,
	getLineDoughHistoryProduction,
	getLineAlertsActive,
	getDryerTimeRange,
	getDryerHistoryProduction,
	getLineTimeRange,
	getLineHistoryProduction
}
