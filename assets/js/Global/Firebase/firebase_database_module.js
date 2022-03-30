let db = firebase.firestore();

db.collection("users").doc('user1').set({
    name: "user",
    email: "user1@user.com",
    prova: 'prova1',
    pippo:'pippo'
})
.then(() => {
    console.log("Document successfully written!");
})
.catch((error) => {
    console.error("Error writing document: ", error);
});
