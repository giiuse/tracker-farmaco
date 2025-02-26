// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0704394oGD--ixg2jBQwXVPbIoR8V5wo",
  authDomain: "tracker-farmaco.firebaseapp.com",
  projectId: "tracker-farmaco",
  storageBucket: "tracker-farmaco.firebasestorage.app",
  messagingSenderId: "848101645508",
  appId: "1:848101645508:web:8ff3d90bcee006aade3d91",
  measurementId: "G-RJGFY0QW77"
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
