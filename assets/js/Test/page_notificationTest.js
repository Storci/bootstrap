function notifyMe() {
	console.log("ciao")

	let baseURL = window.location.protocol + "//" + window.location.host;
	let image = baseURL + "/assets/img/Storci_Logo_1024_1024.png"

	// Let's check whether notification permissions have already been granted
	if (Notification.permission === "granted") {
	// If it's okay let's create a notification
	var notification = new Notification("NEW NOTIFY", {
			body: "Notifiche abilitate,  Nuova notifica arrivata",
			icon: image
		});
	}

	// Otherwise, we need to ask the user for permission
	else if (Notification.permission !== "denied") {
	Notification.requestPermission().then(function (permission) {
	  // If the user accepts, let's create a notification
	  if (permission === "granted") {
		var notification = new Notification("NEW NOTIFY", {
			body: "Nuova notifica arrivata",
			icon: image
		});
	  }
	});
	}
	// At last, if the user has denied notifications, and you
	// want to be respectful there is no need to bother them any more.
}
