// Sostituisci i valori con quelli del tuo progetto Firebase
const firebaseConfig = {
  apiKey: "TUO_API_KEY",
  authDomain: "TUO_PROJECT_ID.firebaseapp.com",
  projectId: "TUO_PROJECT_ID",
  storageBucket: "TUO_PROJECT_ID.appspot.com",
  messagingSenderId: "TUO_SENDER_ID",
  appId: "TUO_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Funzione per salvare lo stato dei checkbox e delle note su Firestore
async function saveData() {
  const data = {};
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    data[checkbox.id] = checkbox.checked;
  });
  document.querySelectorAll('.note').forEach(div => {
    data[div.id] = div.innerHTML;
  });
  try {
    await db.collection("dati").doc("tracker").set(data);
    console.log("Dati salvati con successo!");
  } catch (error) {
    console.error("Errore nel salvataggio dei dati:", error);
  }
}

// Funzione per caricare i dati da Firestore
async function loadData() {
  try {
    const docRef = db.collection("dati").doc("tracker");
    const doc = await docRef.get();
    if (doc.exists) {
      const data = doc.data();
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (data.hasOwnProperty(checkbox.id)) {
          checkbox.checked = data[checkbox.id];
        }
      });
      document.querySelectorAll('.note').forEach(div => {
        if (data.hasOwnProperty(div.id)) {
          div.innerHTML = data[div.id];
        }
      });
    }
  } catch (error) {
    console.error("Errore nel caricamento dei dati:", error);
  }
}

// Aggiunge listener per salvare ogni volta che c'è un cambiamento
document.querySelectorAll('input, .note').forEach(element => {
  element.addEventListener('input', saveData);
  element.addEventListener('blur', saveData);
});

// Carica i dati al caricamento della pagina
window.addEventListener('load', loadData);
