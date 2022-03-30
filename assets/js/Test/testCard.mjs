import * as tw from "../Global/thingworx_api_module.mjs";
import * as am from "../Global/amchart/amchart_functions.mjs";
import * as fb from "../Global/Firebase/firebase_auth_module.mjs";



// Esegue il codice solo quando viene caricato il body
$("#IDBody").ready(async function(){

  // Definisce le variabili come date
  let timeStart = new Date();	// TODO - rendere dinamico
  let timeEnd   = new Date(); // TODO - rendere dinamico
  // Imposta l'ora a mezzanotte del giorno attuale
  timeStart.setHours(0,0,0,0)
  timeStart.setDate(timeStart.getDate() - 1)
  // Definisce la variabile
  let query;
  // Recupera il timestamp dell'inizio di Produzione
  // Se non viene trovato rimane impostato il time a mezzanotte
  try{
    // Definisce la query da inviare a influxdb
    query  = 'SELECT '
    query += '"Dati_Ciclo_Ciclo_On" '
    query += 'FROM "' + 'Storci.Thing.Antiche_Tradizioni_Di_Gragnano.F245.Cella.2' + '" '
    query += 'WHERE time < ' + timeEnd.getTime() + 'ms '
    query += 'AND "Dati_Ciclo_Ciclo_On" =  true ORDER BY time DESC LIMIT 1'

    // recupera i dati da influxdb
    let response = await tw.influxQuery(query)
    // Aggiunge una riga all'array data
    response.results[0].series[0].values.forEach(el => { timeStart = new Date(el[0]) })
    // Imposta i timestamp un'ora prima e un'ora dopo
    timeStart = Number(timeStart.getTime()) - 3600000
  }catch(e){
    console.log(e)
    // Imposta i timestamp un'ora prima e un'ora dopo
    timeStart = Number(timeStart.getTime())
  }
  // Imposta i timestamp un'ora prima e un'ora dopo
  timeEnd   = Number(timeEnd.getTime()) + 3600000


  // Definisce il grafico
  let chart1 = am.createXYChartNoLegend("IDDivChart1", 1);
  // Aggiunge la serie al grafico
  am.createLineSeries(chart1, "PV", "time", "PV_Temperatura_Cella", "°C");
  am.createLineSeries(chart1, "SP", "time", "SP_Temperatura_Cella", "°C");
  // Definisce la query
  query  = 'SELECT ';
  query += 'mean("Dati_Ciclo_Temperatura_PV") as "PV_Temperatura_Cella", ';
  query += 'mean("Dati_Ciclo_Temperatura_SP") as "SP_Temperatura_Cella" ';
  query += 'FROM "' + 'Storci.Thing.Antiche_Tradizioni_Di_Gragnano.F245.Cella.2' + '" ';
  query += 'WHERE time > ' + timeStart + 'ms and time < ' + timeEnd + 'ms GROUP BY time(10m) fill(previous)';
  console.log(query)
  // Setta i dati del grafico
  chart1.data = await setChartData(chart1, query);


  // Definisce il grafico
  let chart2 = am.createXYChartNoLegend("IDDivChart-1", 1);
  // Aggiunge la serie al grafico
  am.createLineSeries(chart2, "PV", "time", "PV_Umidita_Cella", "%H");
  am.createLineSeries(chart2, "SP", "time", "SP_Umidita_Cella", "%H");
  // Definisce la query
  query  = 'SELECT ';
  query += 'mean("Dati_Ciclo_Umidita_PV") as "PV_Umidita_Cella", ';
  query += 'mean("Dati_Ciclo_Umidita_SP") as "SP_Umidita_Cella" ';
  query += 'FROM "' + 'Storci.Thing.Antiche_Tradizioni_Di_Gragnano.F245.Cella.2' + '" ';
  query += 'WHERE time > ' + timeStart + 'ms and time < ' + timeEnd + 'ms GROUP BY time(10m) fill(previous)';
  console.log(query)
  // Setta i dati del grafico
  chart2.data = await setChartData(chart2, query);
})





// Inserisce i dati nel grafico
async function setChartData(chart, query) {
	// Definisce la variabile come array
	let data = [];
	// recupera li dati da influxdb
	let response = await tw.influxQuery(query);
  console.log(response.results[0].series[0].values)
	// Aggiunge una riga all'array data
	response.results[0].series[0].values.forEach(el => {
		// Definisce la variabile come json object
		let obj  = {};
		// Aggiunge le chiavi-valore all'oggetto json obj
		// Le chiavi sono le colonne della query di influxdb
		response.results[0].series[0].columns.forEach((key, id) => {
			// controllo che il valore ritornato sia un numero
			if(typeof(el[id]) == "number"){
				// Riduco la precisione a 2 valori decimali
				el[id] = el[id].toFixed(2);
			}
			//Aggiungo il valore all'oggetto obj
			obj[key] = el[id];
		});
		// Aggiungi il json all'array
		data.push(obj);
	});
	// Ritorna l'array dei dati
	return data;
}
