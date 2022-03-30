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
am.createLineSeries(chartActualProduction, "PV - Temperatura", "time", "PV_Temp_Trabatto", "°C", 0, false, false)
am.createLineSeries(chartActualProduction, "SP - Temperatura", "time", "SP_Temp_Trabatto", "°C", 0, false, false)
// Crea le series da visualizzare nel grafico
am.createLineSeries(chartHistoryProduction, "PV - Impasto", "time", "PV_Impasto", "kg/h", 0, false, true, true)
am.createLineSeries(chartHistoryProduction, "SP - Impasto", "time", "SP_Impasto", "kg/h", 0, false, true)
am.createLineSeries(chartHistoryProduction, "PV - Pressione", "time", "PV_Pressione", "Bar", 0, false, false)
am.createLineSeries(chartHistoryProduction, "PV - Temperatura", "time", "PV_Temp_Trabatto", "°C", 0, false, false)
am.createLineSeries(chartHistoryProduction, "SP - Temperatura", "time", "SP_Temp_Trabatto", "°C", 0, false, false)

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
query += 'mean("Trabatto_PV_Temperatura_Trabatto") as "PV_Temp_Trabatto", '
query += 'mean("Trabatto_SP_Temperatura_Trabatto") as "SP_Temp_Trabatto" '
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

// ******************** Grafico Cards ********************
// Grafico Card Temperatura Trabatto
common.cardLineTrend('IDDivChart1', entityName, 'Trabatto_PV_Temperatura_Trabatto', 'Trabatto_SP_Temperatura_Trabatto', '°C')

// ******************** GRAFICO PRODUZIONE ATTUALE ********************
common.actualLineProduction(chartActualProduction, query, entityName)

// ******************** STORICO PRODUZIONI ********************
common.historyLineProduction(chartHistoryProduction, query, entityName)

// ******************** FUNCTIONS ********************
// Funzione che imposta i dati dell'impasto nei rispettivi campi
async function setLineinfo(entityName){
	// Visualizza il widget che indica il valore in aggiornamento
	$('.lds-dual-ring.info-cell').show()
	// Recupera le informazioni della linea da thingworx
  let line_info = await tw.getLineTrabattoInfo(entityName);
	// Imposta i valori dei vari tile con i dati recuperati da thingworx
	$("#recipe_number").text(line_info.Impasto_Ricetta_Numero_Ricetta)
	$("#recipe_name").text(line_info.Impasto_Ricetta_Nome_Ricetta)
  try{ $("#pre_dryer_temperature_sp").text(line_info.Trabatto_SP_Temperatura_Trabatto.toFixed(2)+ " °C") } catch(e){}
	try{ $("#pre_dryer_temperature_pv").text(line_info.Trabatto_PV_Temperatura_Trabatto.toFixed(2)+ " °C") } catch(e){}
	// Finita la funzione aspetta un secondo prima di nascondere il widget dell'aggiornamento
	setTimeout(function() {	$('.lds-dual-ring.info-cell').hide() }, 1000)
}
