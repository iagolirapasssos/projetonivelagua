import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

const firebaseConfig = {
  apiKey: API_KEY_PLACEHOLDER,
  authDomain: AUTH_DOMAIN_PLACEHOLDER,
  databaseURL: DATABASE_URL_PLACEHOLDER,
  projectId: PROJECT_ID_PLACEHOLDER,
  storageBucket: STORAGE_BUCKET_PLACEHOLDER,
  messagingSenderId: MESSAGING_SENDER_ID_PLACEHOLDER,
  appId: APP_ID_PLACEHOLDER,
  measurementId: MEASUREMENT_ID_PLACEHOLDER
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let myChart = null;
let allSensorsChart = null;

function loadAllSensorsData() {
    const allSensorsRef = ref(database, 'sensors');

    onValue(allSensorsRef, (snapshot) => {
        const allDatasets = [];
        snapshot.forEach((sensorSnapshot) => {
            const dadosAltura = [];
            const dadosTempo = [];

            sensorSnapshot.forEach((dataSnapshot) => {
                const data = dataSnapshot.val();
                dadosAltura.push(data.altura);
                dadosTempo.push(data.tempo);
            });

            allDatasets.push({
                label: `Dados de ${sensorSnapshot.key}`,
                data: dadosAltura.map((height, index) => ({ x: dadosTempo[index], y: height })),
                borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                borderWidth: 1,
                fill: false,
                tension: 0.1
            });
        });

        const ctxAll = document.getElementById('allSensorsChart').getContext('2d');
        if (allSensorsChart && typeof allSensorsChart.destroy === 'function') {
            allSensorsChart.destroy();
        }
        allSensorsChart = new Chart(ctxAll, {
            type: 'line',
            data: {
                datasets: allDatasets
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
}

function loadSensorData(sensorId) {
    const sensorRef = ref(database, `sensors/${sensorId}`);

    onValue(sensorRef, (snapshot) => {
        const dadosAltura = [];
        const dadosTempo = [];

        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            dadosAltura.push(data.altura);
            dadosTempo.push(data.tempo);
        });

        const ctx = document.getElementById('myChart').getContext('2d');
        if (myChart && typeof myChart.destroy === 'function') {
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dadosTempo,
                datasets: [{
                    label: `Dados de ${sensorId}`,
                    data: dadosAltura,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
}


document.getElementById('sensorSelect').addEventListener('change', (e) => {
    loadSensorData(e.target.value);
});

const sensorsRef = ref(database, 'sensors');
onValue(sensorsRef, (snapshot) => {
    const select = document.getElementById('sensorSelect');
    select.innerHTML = '';
    let firstSensor = null;
    snapshot.forEach((childSnapshot) => {
        const sensorKey = childSnapshot.key;
        if (!firstSensor) firstSensor = sensorKey;
        const option = document.createElement('option');
        option.value = sensorKey;
        option.textContent = sensorKey;
        select.appendChild(option);
    });

    if (firstSensor) {
        select.value = firstSensor;
        loadSensorData(firstSensor);
        loadAllSensorsData(); // Load all sensors data for the general chart
    }
});
