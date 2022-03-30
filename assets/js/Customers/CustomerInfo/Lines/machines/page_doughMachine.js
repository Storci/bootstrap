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
am.createLineSeries(chartActualProduction, "PV - Impasto", "time", "PV_Impasto", "kg/h", 0, false, false, true)
am.createLineSeries(chartActualProduction, "SP - Impasto", "time", "SP_Impasto", "kg/h", 0, true, false)
am.createLineSeries(chartActualProduction, "PV - Pressione", "time", "PV_Pressione", "Bar", 0, false, false)
am.createLineSeries(chartActualProduction, 'PV - Portata Acqua', 'time', 'PV_Portata_Acqua', '°C', 0, false, true)
am.createLineSeries(chartActualProduction, 'SP - Portata Acqua', 'time', 'SP_Portata_Acqua', '°C', 0, false, true)
am.createLineSeries(chartActualProduction, 'PV - Temperatura Acqua', 'time', 'PV_Temp_Acqua', '°C', 0, false, true)
am.createLineSeries(chartActualProduction, 'SP - Temperatura Acqua', 'time', 'SP_Temp_Acqua', '°C', 0, false, true)
am.createLineSeries(chartActualProduction, "PV - kcal/h", "time", "PV_Consumi", "kcal/h", 1, false, true)
// Crea le series da visualizzare nel grafico
am.createLineSeries(chartHistoryProduction, "PV - Impasto", "time", "PV_Impasto", "kg/h", 0, false, false, true)
am.createLineSeries(chartHistoryProduction, "SP - Impasto", "time", "SP_Impasto", "kg/h", 0, false, false)
am.createLineSeries(chartHistoryProduction, "PV - Pressione", "time", "PV_Pressione", "Bar", 0, false, false)
am.createLineSeries(chartHistoryProduction, 'PV - Portata Acqua', 'time', 'PV_Portata_Acqua', '°C', 0, false, true)
am.createLineSeries(chartHistoryProduction, 'SP - Portata Acqua', 'time', 'SP_Portata_Acqua', '°C', 0, false, true)
am.createLineSeries(chartHistoryProduction, 'PV - Temperatura Acqua', 'time', 'PV_Temp_Acqua', '°C', 0, false, true)
am.createLineSeries(chartHistoryProduction, 'SP - Temperatura Acqua', 'time', 'SP_Temp_Acqua', '°C', 0, false, true)
am.createLineSeries(chartHistoryProduction, "PV - kcal/h", "time", "PV_Consumi", "kcal/h", 1, false, true)

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
query += 'mean("Impasto_PV_Dosatore_Acqua") as "PV_Portata_Acqua", '
query += 'mean("Impasto_SP_Dosatore_Acqua_Litri") as "SP_Portata_Acqua", '
query += 'mean("Impasto_PV_Temperatura_Acqua") as "PV_Temp_Acqua", '
query += 'mean("Impasto_SP_Temperatura_Acqua") as "SP_Temp_Acqua", '
query += 'mean("Pressa_Motori_Estrusore_PV_Calorie") as "PV_Consumi" '
query += 'FROM "' + entityName + '" '
query += 'WHERE time > {1}ms and time < {2}ms GROUP BY time(10s) fill(previous)'

// Recupera i dati da thingworx e li visualizza nella pagina
// all'interno delle card.
// La funzione viene poi richiamata ogni 30 sec
setLineinfo(entityName)
setInterval(setLineinfo, 30000, entityName)

// Pulsanti per l'esportazione del grafico in png
$('#IDButtonExportTrendActualProduction').click(el => { am.getExport(chartActualProduction) })
$('#IDButtonExportTrendHistoryProduction').click(el => { am.getExport(chartHistoryProduction) })


// ******************** Grafico Cards ********************
// Grafico Card Pressione Estrusore
common.cardLineTrend('IDDivChart1', entityName, 'Impasto_PV_Impasto_Totale', 'Impasto_SP_Impasto_Totale', 'kg/h')
// Grafico card Temperatura Cilindro
common.cardLineTrend('IDDivChart2', entityName, 'Impasto_PV_Dosatore_Sfarinato_1', 'Impasto_SP_Dosatore_Sfarinato_1', 'kg/h')
// Grafico card Temperatura Testata
common.cardLineTrend('IDDivChart3', entityName, 'Impasto_PV_Dosatore_Acqua', 'Impasto_SP_Dosatore_Acqua_Litri', 'L/h')
// Grafico card Temperatura Testata
common.cardLineTrend('IDDivChart4', entityName, 'Impasto_PV_Dosatore_Liquido_1', 'Impasto_SP_Dosatore_Liquido_1', 'L/h')
// Grafico card Temperatura Testata
common.cardLineTrend('IDDivChart5', entityName, 'Impasto_PV_Temperatura_Acqua', 'Impasto_SP_Temperatura_Acqua', '°C')
// Grafico card Temperatura Testata
common.cardLineTrend('IDDivChart6', entityName, 'Impasto_PV_Quantita_Vuoto', '', 'bar')
// Grafico card Temperatura Testata
common.cardLineTrend('IDDivChart7', entityName, 'Impasto_PV_Livello_Vasca', '', 'mm')
// Grafico Card Pressione Estrusore
common.cardLineTrend('IDDivChart8', entityName, 'Pressa_Motori_Estrusore_PV_Pressione', '', 'bar')
// Grafico card Temperatura Cilindro
common.cardLineTrend('IDDivChart9', entityName, 'Pressa_Termostatazione_Cilindro_PV_Temperatura', 'Pressa_Termostatazione_Cilindro_SP_Temperatura', '°C')
// Grafico card Temperatura Testata
common.cardLineTrend('IDDivChart10', entityName, 'Pressa_Termostatazione_Testata_PV_Temperatura', 'Pressa_Termostatazione_Testata_SP_Temperatura', '°C')

// ******************** GRAFICO PRODUZIONE ATTUALE ********************
common.actualLineProduction(chartActualProduction, query, entityName)

// ******************** STORICO PRODUZIONI ********************
common.historyLineProduction(chartHistoryProduction, query, entityName)

// ******************** FUNCTION ********************
// Funzione che imposta i dati dell'impasto nei rispettivi campi
async function setLineinfo(entityName){
	// Visualizza il widget che indica il valore in aggiornamento
	$('.lds-dual-ring.info-cell').show()
	// Recupera le informazioni della linea da thingworx
	let line_info = await tw.getLineDoughInfo(entityName);
	// Imposta i valori dei vari tile con i dati recuperati da thingworx
	$("#line_recipe").text(line_info.Impasto_Ricetta_Nome_Ricetta)
	$("#recipe_number").text(line_info.Impasto_Ricetta_Numero_Ricetta)
  $("#total_sp").text(line_info.Impasto_SP_Impasto_Totale.toFixed(2)+ " kg/h")
  $("#total_dough").text(line_info.Impasto_PV_Impasto_Totale.toFixed(2)+ " kg/h")
  $("#flour_sp").text(line_info.Impasto_SP_Dosatore_Sfarinato_1.toFixed(2)+ " kg/h")
  $("#flour_dough").text(line_info.Impasto_PV_Dosatore_Sfarinato_1.toFixed(2)+ " kg/h")
  $("#water_dosing_sp").text(line_info.Impasto_SP_Dosatore_Acqua_Litri.toFixed(2)+ " l/h")
  $("#water_dosing_percent").text(line_info.Impasto_SP_Dosatore_Acqua_Percentuale.toFixed(2)+ " %")
  $("#water_dosing").text(line_info.Impasto_PV_Dosatore_Acqua.toFixed(2)+ " l/h")
  $("#liqiud_dosing_sp").text(line_info.Impasto_PV_Dosatore_Liquido_1.toFixed(2)+ " l/h")
  $("#liquid_dosing_percent").text(line_info.Impasto_SP_Dosatore_Liquido_1_Percentuale.toFixed(2)+ " %")
  $("#liquid_dosing").text(line_info.Impasto_SP_Dosatore_Liquido_1_Litri.toFixed(2)+ " l/h")
  $("#powder_dosing_sp").text(line_info.Impasto_SP_Dosatore_Polvere_1.toFixed(2)+ " kg/h")
  $("#powder_dosing").text(line_info.Impasto_PV_Dosatore_Polvere_1.toFixed(2)+ " kg/h")
  $("#water_sp").text(line_info.Impasto_SP_Temperatura_Acqua.toFixed(2)+ " °C")
  $("#water_temp").text(line_info.Impasto_PV_Temperatura_Acqua.toFixed(2)+ " °C")
  $("#tank_level").text(line_info.Impasto_PV_Livello_Vasca_Percentuale.toFixed(2)+ " %")
  $("#tank_vacuum").text(line_info.Impasto_PV_Quantita_Vuoto.toFixed(2)+ " Bar")
  $("#extruder-pressure").text(line_info.Pressa_Motori_Estrusore_PV_Pressione.toFixed(2)+ " Bar")
  $("#cylinder_temp_sp").text(line_info.Pressa_Termostatazione_Cilindro_SP_Temperatura.toFixed(2)+ "°C")
  $("#cylinder-temperature").text(line_info.Pressa_Termostatazione_Cilindro_PV_Temperatura.toFixed(2)+ " °C")
  $("#head_temp_sp").text(line_info.Pressa_Termostatazione_Testata_SP_Temperatura.toFixed(2)+ " °C")
  $("#head_temperature").text(line_info.Pressa_Termostatazione_Testata_PV_Temperatura.toFixed(2)+ " °C")
	// Finita la funzione aspetta un secondo prima di nascondere il widget dell'aggiornamento
	setTimeout(function() {	$('.lds-dual-ring.info-cell').hide() }, 1000)
}
