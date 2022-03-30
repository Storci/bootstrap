// Carica le funzioni globali
import * as tw from "../../../../Global/Thingworx/thingworx_api_module.js"
import * as fb from "../../../../Global/Firebase/firebase_auth_module.js"
import * as lang from "../../../../Global/Common/Translation.js"
import * as common from "../../../../Global/Common/commonFunctions.js"

let baseURL = window.location.protocol + "//" + window.location.host
if(window.location.protocol == 'https:'){
	baseURL = window.location.protocol + "//" + window.location.host + '/bootstrap'
}


// Nasconde il messaggio di errore nel momento in cui digito qualcosa di diverso nei vari campi
$('.form-control').on('input', function(){
  $('#IDErrorMessage').css("display", "none")
})



// Funzione scatenata dalla pressione del pulsante di sign up
$('#IDButtonSignUp').click(function(){

  let email = $('#IDEmail').val()
  // Controlla che l'email non sia già stata usata
  // Recupera il record dell'utente dalla tabella di tw
	tw.getUser(email)
		.then(tableRow => {
      if(tableRow.rows.length > 0){
        $('#IDErrorMessage').css("display", "block")
        $('#IDErrorMessage').text('Error, the email is already use')
      }else{
        // controlla che le 2 password coincidano
        let pass1 = $('#IDPassword').val()
        let pass2 = $('#IDPassword_repeat').val()

        if(pass1 == pass2){
          fb.signUpWithEmailPassword(email, pass1, baseURL)
        }else{
          $('#IDErrorMessage').css("display", "block")
          $('#IDErrorMessage').text('Error, the 2 passwords are different')
        }
      }
    })
		.catch(error => console.error(error))
})
