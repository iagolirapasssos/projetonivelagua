import './styles.css';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let myChart = null;
let allSensorsChart = null;
let updateInterval = null;

const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutos em milissegundos

async function loadChartJS() {
  const { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale } = await import('chart.js');
  const { default: adapter } = await import('chartjs-adapter-date-fns');
  
  Chart.register(
    LineController, 
    LineElement, 
    PointElement, 
    LinearScale, 
    Title, 
    CategoryScale,
    TimeScale
  );
  
  return Chart;
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: { 
            type: 'time',
            time: {
                unit: 'minute',
                displayFormats: {
                    minute: 'HH:mm',
                    hour: 'HH:mm',
                    day: 'dd/MM',
                    week: 'dd/MM',
                    month: 'MM/yyyy'
                },
                tooltipFormat: 'dd/MM/yyyy HH:mm'
            },
            title: {
                display: true,
                text: 'Data e Hora',
                font: {
                    size: window.innerWidth < 768 ? 12 : 16,
                    weight: 'bold'
                }
            },
            ticks: {
                source: 'auto',
                autoSkip: true,
                maxTicksLimit: 10,
                font: {
                    size: window.innerWidth < 768 ? 10 : 12
                },
                maxRotation: 45,
                minRotation: 45
            },
            display: true // Garante que o eixo seja exibido
        },
        y: { 
            beginAtZero: true,
            title: {
                display: true,
                text: 'Altura Lixo',
                font: {
                    size: window.innerWidth < 768 ? 12 : 16,
                    weight: 'bold'
                }
            },
            ticks: {
                font: {
                    size: window.innerWidth < 768 ? 10 : 12
                }
            }
        }
    },
    plugins: {
        legend: {
            position: window.innerWidth < 768 ? 'bottom' : 'top',
            labels: {
                font: {
                    size: window.innerWidth < 768 ? 10 : 12
                },
                boxWidth: window.innerWidth < 768 ? 10 : 40
            }
        },
        tooltip: {
            callbacks: {
                title: function(context) {
                    const timestamp = context[0].parsed.x;
                    return new Date(timestamp).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            }
        }
    },
    interaction: {
        intersect: false,
        mode: 'index'
    }
};

function startAutoRefresh() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    updateInterval = setInterval(() => {
        console.log('Atualizando dados...', new Date().toLocaleString());
        const selectedSensor = document.getElementById('sensorSelect').value;
        if (selectedSensor) {
            loadSensorData(selectedSensor);
            loadAllSensorsData();
        }
    }, REFRESH_INTERVAL);

    const lastUpdateSpan = document.createElement('span');
    lastUpdateSpan.id = 'lastUpdate';
    lastUpdateSpan.className = 'text-sm text-gray-600 ml-2';
    document.getElementById('sensorSelect').parentNode.appendChild(lastUpdateSpan);

    function updateLastUpdateTime() {
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            lastUpdate.textContent = `Última atualização: ${new Date().toLocaleString()}`;
        }
    }

    const originalLoadSensorData = loadSensorData;
    loadSensorData = function(sensorId) {
        originalLoadSensorData(sensorId);
        updateLastUpdateTime();
    };

    updateLastUpdateTime();
}

function stopAutoRefresh() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

async function loadAllSensorsData() {
    const allSensorsRef = ref(database, 'sensors');
    
    onValue(allSensorsRef, async (snapshot) => {
        const allDatasets = [];
        snapshot.forEach((sensorSnapshot) => {
            const rawData = Object.entries(sensorSnapshot.val() || {})
                .map(([key, value]) => ({
                    timestamp: new Date(value.tempo).getTime(),
                    altura: value.altura
                }))
                .sort((a, b) => a.timestamp - b.timestamp);

            allDatasets.push({
                label: `Lixeira ${sensorSnapshot.key}`,
                data: rawData.map(d => ({
                    x: d.timestamp,
                    y: d.altura
                })),
                borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6
            });
        });

        const ctxAll = document.getElementById('allSensorsChart').getContext('2d');
        if (allSensorsChart && typeof allSensorsChart.destroy === 'function') {
            allSensorsChart.destroy();
        }

        allSensorsChart = await createChart(ctxAll, {
            type: 'line',
            data: { datasets: allDatasets },
            options: {
                ...chartOptions,
                scales: {
                    ...chartOptions.scales,
                    x: {
                        ...chartOptions.scales.x,
                        offset: true, // Adiciona offset para melhor visualização
                        distribution: 'linear', // Distribui os pontos linearmente
                        bounds: 'data' // Ajusta os limites baseado nos dados
                    }
                }
            }
        });
    });
}


async function loadSensorData(sensorId) {
    const sensorRef = ref(database, `sensors/${sensorId}`);

    onValue(sensorRef, async (snapshot) => {
        const rawData = Object.entries(snapshot.val() || {})
            .map(([key, value]) => ({
                timestamp: new Date(value.tempo).getTime(),
                altura: value.altura
            }))
            .sort((a, b) => a.timestamp - b.timestamp);

        const dataset = {
            label: `Dados da Lixeira ${sensorId}`,
            data: rawData.map(d => ({
                x: d.timestamp,
                y: d.altura
            })),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        };

        const ctx = document.getElementById('myChart').getContext('2d');
        if (myChart && typeof myChart.destroy === 'function') {
            myChart.destroy();
        }

        myChart = await createChart(ctx, {
            type: 'line',
            data: { datasets: [dataset] },
            options: {
                ...chartOptions,
                scales: {
                    ...chartOptions.scales,
                    x: {
                        ...chartOptions.scales.x,
                        offset: true,
                        distribution: 'linear',
                        bounds: 'data'
                    }
                }
            }
        });
    });
}

async function createChart(ctx, config) {
    const Chart = await loadChartJS();
    return new Chart(ctx, config);
}

function addAutoRefreshControl() {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'flex items-center mt-2';
    
    const toggleButton = document.createElement('button');
    toggleButton.className = 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors';
    toggleButton.textContent = 'Pausar Atualização';
    
    let isAutoRefreshEnabled = true;
    
    toggleButton.addEventListener('click', () => {
        if (isAutoRefreshEnabled) {
            stopAutoRefresh();
            toggleButton.textContent = 'Retomar Atualização';
            toggleButton.className = 'px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors';
        } else {
            startAutoRefresh();
            toggleButton.textContent = 'Pausar Atualização';
            toggleButton.className = 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors';
        }
        isAutoRefreshEnabled = !isAutoRefreshEnabled;
    });
    
    controlDiv.appendChild(toggleButton);
    document.getElementById('sensorSelect').parentNode.appendChild(controlDiv);
}

document.addEventListener('DOMContentLoaded', addAutoRefreshControl);

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
        option.textContent = `Lixeira ${sensorKey}`;
        select.appendChild(option);
    });

    if (firstSensor) {
        select.value = firstSensor;
        loadSensorData(firstSensor);
        loadAllSensorsData();
        startAutoRefresh();
    }
});

window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
});

window.addEventListener('resize', () => {
    const updateChartOptions = (chart) => {
        if (chart) {
            const newOptions = {
                ...chartOptions,
                plugins: {
                    ...chartOptions.plugins,
                    legend: {
                        ...chartOptions.plugins.legend,
                        position: window.innerWidth < 768 ? 'bottom' : 'top',
                        labels: {
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            },
                            boxWidth: window.innerWidth < 768 ? 10 : 40
                        }
                    }
                },
                scales: {
                    ...chartOptions.scales,
                    x: {
                        ...chartOptions.scales.x,
                        ticks: {
                            ...chartOptions.scales.x.ticks,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        title: {
                            ...chartOptions.scales.x.title,
                            font: {
                                size: window.innerWidth < 768 ? 12 : 16,
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        ...chartOptions.scales.y,
                        ticks: {
                            ...chartOptions.scales.y.ticks,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        title: {
                            ...chartOptions.scales.y.title,
                            font: {
                                size: window.innerWidth < 768 ? 12 : 16,
                                weight: 'bold'
                            }
                        }
                    }
                }
            };
            chart.options = newOptions;
            chart.update();
        }
    };

    updateChartOptions(myChart);
    updateChartOptions(allSensorsChart);
});

// Exporta funções que podem ser necessárias em outros módulos
export {
    loadSensorData,
    loadAllSensorsData,
    startAutoRefresh,
    stopAutoRefresh
};ssss