// Carica le funzioni globali
import * as tw from "../../../../Global/Thingworx/thingworx_api_module.js"
import * as am from "../../../../Global/amchart/amchart_functions.js"
import * as fb from "../../../../Global/Firebase/firebase_auth_module.js"
import * as lang from "../../../../Global/Common/Translation.js"
import * as common from "../../../../Global/Common/commonFunctions.js"

// definisce l'url di base della pagina attuale (in questo caso della pagina index.html).
// il risultato è http(s)://xxx.xxx.xxx.xxx:xxxx
// baseURL verrà utilizzato come base per il cambio pagina.
let baseURL = window.location.protocol + "//" + window.location.host
if(window.location.protocol == 'https:'){
	baseURL = window.location.protocol + "//" + window.location.host + '/bootstrap'
}

let pageURL = window.location.href
// Recupera il nome dell'utente da firebase, controlla che sia loggato.
// Nel caso non fosse loggato richiama la pagina di login
fb.onAuthStateChanged_2(baseURL, pageURL)
// Recupera dei dati dalle local storage
let selectedCustomer = localStorage.getItem("global_selected_customer")
let selectedLine 		 = localStorage.getItem("global_selected_line")
let entityName			 = localStorage.getItem('global_selected_line_entityName')
// Imposta il nome del cliente nella breadcrumb
// Vengono sostituiti tutti gli underscore presenti nel nome
$("#IDBreadcrumbCustomer").text(selectedCustomer.replace(/_/g, ' '));
// Recupera la lingua utilizzata dall'utente e sostituisce tutti i testi
// ATTENZIONE - Questa istruzione traduce solamente i testi statici e non
// i testi caricati dalle funzioni.
lang.getLanguage()

// Istanzia i grafici dell'attuale e dello storico
// I grafici devono essere istanziati una volta solamente
// La funzione am.createXYChart ha i seguenti parametri di ingresso
// - ID del div che contiene il grafico
// - ID del div che contiene la legenda
// - ID per la colorazione delle series
// - Numero di assi Y associate al GRAFICO
// - Array con le unità di misura
let arrayUM = ['Produzione (kg/h)', 'Pressione Estrusore (Bar)']
let chartActualProduction = am.createXYChart("IDTrendActualProduction", 'IDLegendActualProduzione', 0, 2, arrayUM)
let chartHistoryProduction = am.createXYChart("IDTrendHistoryProduction", 'IDLegendHistoryProduction', 0, 2, arrayUM)
// Crea le series da visualizzare sul grafico
am.createLineSeries(chartActualProduction, "PV - Impasto", "time", "PV_Impasto", "kg/h", 0, false, true, true)
am.createLineSeries(chartActualProduction, "SP - Impasto", "time", "SP_Impasto", "kg/h", 0, false, true)
am.createLineSeries(chartActualProduction, "PV - Pressione", "time", "PV_Pressione", "Bar", 0, false, false)
am.createLineSeries(chartActualProduction, "PV - Canne al Minuto", "time", "PV_Canne_Minuto", "Canne/min", 0, false, true)
am.createLineSeries(chartActualProduction, "SP - Canne Prodotte", "time", "PV_Canne_Prodotte", "", 0, false, true)
am.createLineSeries(chartActualProduction, "PV - Peso Canna", "time", "PV_Peso_Canna", "kg", 0, false, true)
am.createLineSeries(chartActualProduction, "SP - Tempo Canna", "time", "PV_Tempo_Canna", "sec", 0, false, true)
// Crea le series da visualizzare nel grafico
am.createLineSeries(chartHistoryProduction, "PV - Impasto", "time", "PV_Impasto", "kg/h", 0, false, true, true)
am.createLineSeries(chartHistoryProduction, "SP - Impasto", "time", "SP_Impasto", "kg/h", 0, false, true)
am.createLineSeries(chartHistoryProduction, "PV - Pressione", "time", "PV_Pressione", "Bar", 0, false, false)
am.createLineSeries(chartHistoryProduction, "PV - Canne al Minuto", "time", "PV_Canne_Minuto", "Canne/min", 0, false, true)
am.createLineSeries(chartHistoryProduction, "SP - Canne Prodotte", "time", "PV_Canne_Prodotte", "", 0, false, true)
am.createLineSeries(chartHistoryProduction, "PV - Peso Canna", "time", "PV_Peso_Canna", "kg", 0, false, true)
am.createLineSeries(chartHistoryProduction, "SP - Tempo Canna", "time", "PV_Tempo_Canna", "sec", 0, false, true)

// Ricalcola la dimensione del div della legenda - viene eseguito ogni secondo
setInterval(am.refreshLegendSize, 1000, chartActualProduction, 'IDLegendActualProduzione')
setInterval(am.refreshLegendSize, 1000, chartHistoryProduction, 'IDLegendHistoryProduction')

// Definisce la query da inviare a influxdb
// I parametri da sostituire sono indicati da {1}, {2}, ecc...
// Invece l'entityName è sempre comune per tutte le query
let query  = 'SELECT '
query += 'mean("Impasto_PV_Impasto_Totale") as "PV_Impasto", '
query += 'mean("Impasto_SP_Impasto_Totale") as "SP_Impasto", '
query += 'mean("Pressa_Motori_Estrusore_PV_Pressione") as "PV_Pressione", '
query += 'mean("Stenditrice_PV_Canne_Minuto") as "PV_Canne_Minuto", '
query += 'mean("Stenditrice_PV_Canne_Prodotto") as "PV_Canne_Prodotte", '
query += 'mean("Stenditrice_PV_Peso_Canna") as "PV_Peso_Canna", '
query += 'mean("Stenditrice_PV_Tempo_Canna") as "PV_Tempo_Canna" '
query += 'FROM "' + entityName + '" '
query += 'WHERE time > {1}ms and time < {2}ms GROUP BY time(1m) fill(previous)'

// Recupera i dati da thingworx e li visualizza nella pagina
// all'interno delle card.
// La funzione viene poi richiamata ogni 30 sec
setLineinfo(entityName)
setInterval(setLineinfo, 30000, entityName)

// Pulsanti per l'esportazione del grafico in png
$('#IDButtonExportTrendActualProduction').click(el => { am.getExport(chartActualProduction) })
$('#IDButtonExportTrendHistoryProduction').click(el => { am.getExport(chartHistoryProduction) })


// *******************************************************
// ******************** Grafico Cards ********************
// *******************************************************

// Grafico Card Tempo canna
// Recupera l'inizio e la fine della produzione attuale.
// In questo caso la fine produzione è sempre l'ora attuale
tw.getLineTimeRange(entityName)
.then(time => {
	// Instanzia il grafico di amchart, i parametri sono:
  // - ID div dove viene visualizzato il grafico
  // - Indice del colore del grafico
  let chart = am.createXYChartNoLegend('IDDivChart1', 0);
  // Aggiunge la serie al grafico
	am.createLineSeries(chart, "PV", "time", "PV", "kg")
  // Definisce la query
	// Definisce la query
	let query = 'SELECT '
	query += 'mean("Stenditrice_PV_Peso_Canna") as "PV" '
	query += 'FROM "' + entityName + '" '
	query += 'WHERE time > ' + time.start + 'ms and time < ' + time.end + 'ms GROUP BY time(1m) fill(previous)'
  // Setta i dati del grafico
  am.setChartData(chart, query, '.lds-dual-ring.info-cell');
	// Funzioni cicliche
	setInterval(am.setChartData, 120000, chart, query, '.lds-dual-ring.info-cell')
})
.catch(e => console.error(e))

// Grafico Card canne al minuto
// Recupera l'inizio e la fine della produzione attuale.
// In questo caso la fine produzione è sempre l'ora attuale
tw.getLineTimeRange(entityName)
.then(time => {
	// Instanzia il grafico di amchart, i parametri sono:
  // - ID div dove viene visualizzato il grafico
  // - Indice del colore del grafico
  let chart = am.createXYChartNoLegend('IDDivChart2', 0);
  // Aggiunge la serie al grafico
	am.createLineSeries(chart, "PV", "time", "PV", "")
  // Definisce la query
	// Definisce la query
	let query = 'SELECT '
	query += 'mean("Stenditrice_PV_Canne_Minuto") as "PV" '
	query += 'FROM "' + entityName + '" '
	query += 'WHERE time > ' + time.start + 'ms and time < ' + time.end + 'ms GROUP BY time(1m) fill(previous)'
  // Setta i dati del grafico
  am.setChartData(chart, query, '.lds-dual-ring.info-cell');
	// Funzioni cicliche
	setInterval(am.setChartData, 120000, chart, query, '.lds-dual-ring.info-cell')
})
.catch(e => console.error(e))

// Grafico Card Canne prodotte
// Recupera l'inizio e la fine della produzione attuale.
// In questo caso la fine produzione è sempre l'ora attuale
tw.getLineTimeRange(entityName)
.then(time => {
	// Instanzia il grafico di amchart, i parametri sono:
  // - ID div dove viene visualizzato il grafico
  // - Indice del colore del grafico
  let chart = am.createXYChartNoLegend('IDDivChart3', 0);
  // Aggiunge la serie al grafico
	am.createLineSeries(chart, "PV", "time", "PV", "")
  // Definisce la query
	// Definisce la query
	let query = 'SELECT '
	query += 'mean("Stenditrice_PV_Canne_Prodotto") as "PV" '
	query += 'FROM "' + entityName + '" '
	query += 'WHERE time > ' + time.start + 'ms and time < ' + time.end + 'ms GROUP BY time(1m) fill(previous)'
  // Setta i dati del grafico
  am.setChartData(chart, query, '.lds-dual-ring.info-cell');
	// Funzioni cicliche
	setInterval(am.setChartData, 120000, chart, query, '.lds-dual-ring.info-cell')
})
.catch(e => console.error(e))


// ******************** GRAFICO PRODUZIONE ATTUALE ********************

// Grafico dell'avanzamento telai
// Recupera l'inizio e la fine della produzione attuale.
// In questo caso la fine produzione è sempre l'ora attuale
tw.getLineTimeRange(entityName)
.then(time => {
	// Definisce la query da inviare a influxdb
  // Sostituisce le stringe con i parametri
	let subquery = query.replaceAll('{1}', time.start).replaceAll('{2}', time.end)
	// Recupera i dati da influxdb e li visualizza sul grafico
	am.setChartData(chartActualProduction, subquery, '.lds-dual-ring.actual-production-trend')
	// Funzioni cicliche
	setInterval(am.setChartData, 1800000, chartActualProduction, query, '.lds-dual-ring.actual-production-trend')	// ogni 30 min
})
.catch(e => console.error(e))


// ******************** STORICO PRODUZIONI ********************

// Visualizza il widget che indica il valore in aggiornamento
$('.lds-dual-ring.history-production-list').show()

// Definisce le variabili come date
let timeStartHistory = new Date()
let timeEndHistory   = new Date()
// Imposta X giorni prima della data odierna
timeStartHistory.setDate(timeStartHistory.getDate() - 14)
// Imposta i 2 data picker con le date calcolate prima
// La funzione getDate ritorna solamente l'anno, il mese e il giorno
// yyyy-MM-dd
$('#IDTimeStart').val(common.getDate(timeStartHistory))
$('#IDTimeEnd').val(common.getDate(timeEndHistory))
// Recupera la lista delle produzioni con il time range impostato di default
// Da data Attuale a data attuale - 14 giorni.
// Per default viene visualizzata la prima produzione dell'elenco. (l'ultima produzione effettuata in ordine cronologico)
tw.getLineHistoryProduction('#IDHistoryTableBody', entityName, timeStartHistory, timeEndHistory, chartHistoryProduction, query)
// Listener sul cambio di valore della data di inizio produzione
// Al cambio di valore viene eseguita la funzione seguente.
// Viene recuperata di nuovo la lista delle produzioni con il range time aggiornato
$('#IDTimeStart').change(function() {
  // Visualizza lo spinner per indicare il caricamento in corso
	$('.lds-dual-ring.history-production-list').show()
  // Recupera i valori di inizio e fine produzione
	let timeStartHistory = new Date($(this).val())
	let timeEndHistory   = new Date($('#IDTimeEnd').val())
  // Recupera la lista delle produzioni
  // Per default viene visualizzata la prima produzione dell'elenco. (l'ultima produzione effettuata in ordine cronologico)
	tw.getLineHistoryProduction('#IDHistoryTableBody', entityName, timeStartHistory, timeEndHistory, chartHistoryProduction, query)
});
// Listener sul cambio di valore della data di fine produzione
// Al cambio di valore viene eseguita la funzione seguente.
// Viene recuperata di nuovo la lista delle produzioni con il range time aggiornato
$('#IDTimeEnd').change(function() {
  // Visualizza lo spinner per indicare il caricamento in corso
	$('.lds-dual-ring.history-production-list').show()
	// Recupera i valori di inizio e fine produzione
  let timeStartHistory = new Date($('#IDTimeStart').val())
	let timeEndHistory   = new Date($(this).val())
  // Recupera la lista delle produzioni
  // Per default viene visualizzata la prima produzione dell'elenco. (l'ultima produzione effettuata in ordine cronologico)
	tw.getLineHistoryProduction('#IDHistoryTableBody', entityName, timeStartHistory, timeEndHistory, chartHistoryProduction, query)
});


// **************************************************
// ******************** FUNCTION ********************
// **************************************************

// Funzione che imposta i dati dell'impasto nei rispettivi campi
async function setLineinfo(entityName){
	// Visualizza il widget che indica il valore in aggiornamento
	$('.lds-dual-ring.info-cell').show()
	// Recupera le informazioni della linea da thingworx
  let line_info = await tw.getLineStenditriceInfo(entityName);
	// Imposta i valori dei vari tile con i dati recuperati da thingworx
	$("#recipe_number").text(line_info.Impasto_Ricetta_Numero_Ricetta);
	$("#recipe_name").text(line_info.Impasto_Ricetta_Nome_Ricetta);
	try{ $("#stick_weight").text(line_info.Stenditrice_PV_Peso_Canna.toFixed(2)+ " Hz") }catch(e){}
	try{ $("#time_stick").text(line_info.Stenditrice_PV_Peso_Canna.toFixed(2)+ " sec") }catch(e){}
	try{ $("#sticks_minutes").text(line_info.Stenditrice_PV_Canne_Minuto.toFixed(2)+ " sticks/m") }catch(e){}
	$("#produced_sticks").text(line_info.Stenditrice_PV_Canne_Prodotte);
  // Finita la funzione aspetta un secondo prima di nascondere il widget dell'aggiornamento
	setTimeout(function() {	$('.lds-dual-ring.info-cell').hide() }, 1000);
}
