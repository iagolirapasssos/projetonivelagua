// URL da planilha no formato CSV
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQlhXUAUC7Ft0C0VTbuGukKsy7dBy2Td7ZsRpIEz-TmzWwuwajIxn0M6IlQu-4zHONJb110xatOGNMN/pub?output=csv";

// Função para carregar e processar os dados CSV
async function fetchCSVData(url) {
    const response = await fetch(url);
    const csvText = await response.text();
    const rows = csvText.split("\n").map(row => row.split(","));
    const labels = rows.map(row => row[0]); // Datas e horas
    const data = rows.map(row => parseFloat(row[1])); // Valores em metros
    return { labels, data };
}

// Inicializa e atualiza o gráfico
let chartInstance = null;
async function renderChart() {
    const { labels, data } = await fetchCSVData(csvUrl);

    const ctx = document.getElementById("sensorChart").getContext("2d");

    // Destroi o gráfico anterior (se existir) para evitar duplicações
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Cria um novo gráfico
    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Sensor Level (m)",
                    data: data,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderWidth: 2,
                    tension: 0.4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permite ajuste dinâmico de altura e largura
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: "black",
                        font: {
                            size: 16, // Tamanho da fonte da legenda
                        },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (context) =>
                            `Value: ${context.raw.toFixed(2)} m`,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: "black",
                        font: {
                            size: 16, // Tamanho da fonte dos ticks do eixo X
                        },
                        autoSkip: true,
                        maxTicksLimit: 10,
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "black",
                        font: {
                            size: 16, // Tamanho da fonte dos ticks do eixo Y
                        },
                    },
                },
            },
        },
    });
}

// Atualiza o gráfico a cada 5 minutos
renderChart();
setInterval(renderChart, 300000); // 300000 ms = 5 minutos

