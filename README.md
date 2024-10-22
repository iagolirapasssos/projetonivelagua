# Sistema de Monitoramento de Lixeiras

## 📋 Descrição
Sistema web para monitoramento em tempo real do nível de resíduos em lixeiras inteligentes. O projeto utiliza Firebase para armazenamento de dados em tempo real e Chart.js para visualização dos dados através de gráficos interativos.

## 🚀 Estrutura do Projeto

```
projeto-medir-nivel/
├── public/
│   └── index.html
├── src/
│   ├── script.js
│   └── styles.css
├── node_modules/
├── .env
├── package.json
├── webpack.config.js
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

## 💻 Requisitos do Sistema

### Requisitos Mínimos
- Node.js 14.x ou superior
- npm 6.x ou superior
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- 2GB de RAM
- 1GB de espaço em disco

## 🔧 Instalação

### Windows

1. **Instalar Node.js e npm**
   - Baixe o instalador do Node.js em: https://nodejs.org/
   - Execute o instalador e siga as instruções
   - Verifique a instalação:
   ```batch
   node --version
   npm --version
   ```

2. **Clonar o Repositório**
   ```batch
   git clone https://seu-repositorio/projeto-medir-nivel.git
   cd projeto-medir-nivel
   ```

3. **Instalar Dependências**
   ```batch
   npm install
   ```

### Linux (Ubuntu/Debian)

1. **Instalar Node.js e npm**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clonar o Repositório**
   ```bash
   git clone https://seu-repositorio/projeto-medir-nivel.git
   cd projeto-medir-nivel
   ```

3. **Instalar Dependências**
   ```bash
   npm install
   ```

### macOS

1. **Instalar Node.js e npm**
   - Usando Homebrew:
   ```bash
   brew install node
   ```
   - Ou baixe o instalador em: https://nodejs.org/

2. **Clonar o Repositório**
   ```bash
   git clone https://seu-repositorio/projeto-medir-nivel.git
   cd projeto-medir-nivel
   ```

3. **Instalar Dependências**
   ```bash
   npm install
   ```

## ⚙️ Configuração

1. **Configurar Variáveis de Ambiente**
   - Crie um arquivo `.env` na raiz do projeto:
   ```env
   API_KEY=seu_api_key
   AUTH_DOMAIN=seu_auth_domain
   DATABASE_URL=seu_database_url
   PROJECT_ID=seu_project_id
   STORAGE_BUCKET=seu_storage_bucket
   MESSAGING_SENDER_ID=seu_messaging_sender_id
   APP_ID=seu_app_id
   MEASUREMENT_ID=seu_measurement_id
   ```

2. **Instalar Dependências Específicas**
   ```bash
   npm install chart.js chartjs-adapter-date-fns date-fns
   ```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
# Inicia o servidor de desenvolvimento
npm start

# O projeto estará disponível em: http://localhost:9000
```

### Produção
```bash
# Gera build de produção
npm run build

# Os arquivos serão gerados na pasta 'dist'
```

## 📊 Funcionalidades

### Monitoramento em Tempo Real
- Visualização do nível de resíduos por lixeira
- Gráfico comparativo entre todas as lixeiras
- Atualização automática dos dados
- Visualização temporal dos dados

### Interface Responsiva
- Layout adaptativo para mobile, tablet e desktop
- Design moderno com Tailwind CSS
- Animações e transições suaves
- Suporte a dark mode

### Visualização de Dados
- Gráficos interativos com Chart.js
- Timeline de medições
- Seleção individual de lixeiras
- Tooltips informativos

## 🔧 Dependências Principais

### Produção
```json
{
  "firebase": "^10.9.0",
  "chart.js": "^4.4.2",
  "date-fns": "^2.30.0",
  "chartjs-adapter-date-fns": "^3.0.0"
}
```

### Desenvolvimento
```json
{
  "webpack": "^5.91.0",
  "babel-loader": "^9.1.3",
  "tailwindcss": "^3.4.1",
  "postcss": "^8.4.38",
  "autoprefixer": "^10.4.19"
}
```

## 🔍 Solução de Problemas

### Erro de MIME Type
Se encontrar erro de MIME Type no CSS:
```bash
npm run build
npm start
```

### Erro de Módulos
Se encontrar erro de módulos não encontrados:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problemas com Webpack
Se o webpack não estiver funcionando:
```bash
npm install -g webpack webpack-cli
npm install
```

## 📱 Compatibilidade

### Navegadores Suportados
- Chrome (última versão)
- Firefox (última versão)
- Safari (última versão)
- Edge (última versão)

### Dispositivos
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Segurança e Boas Práticas

### Firebase
- Configure regras de segurança no Firebase
- Use autenticação quando necessário
- Mantenha as credenciais seguras

### Frontend
- Evite commits de arquivos .env
- Mantenha as dependências atualizadas
- Use HTTPS em produção

## 📸 Screenshots

### Desktop View
![Desktop Dashboard](screenshots/desktop.png)
- Visualização completa do dashboard
- Gráficos lado a lado
- Menu de navegação expandido

### Tablet View
![Tablet Dashboard](screenshots/tablet.png)
- Layout adaptado para tablets
- Gráficos empilhados
- Menu de navegação compacto

### Mobile View
![Mobile Dashboard](screenshots/mobile.png)
- Interface otimizada para mobile
- Navegação simplificada
- Gráficos responsivos

## 📊 Exemplos de Uso

### Monitorando uma Lixeira Específica
```javascript
// Exemplo de como acessar dados de uma lixeira
const sensorRef = ref(database, `sensors/${sensorId}`);
onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    console.log('Nível atual:', data.altura);
});
```

### Configurando Alertas
```javascript
// Exemplo de como configurar alertas de nível
const alertLevel = 80; // 80% de capacidade
onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (data.altura > alertLevel) {
        notifyAdmin('Lixeira quase cheia!');
    }
});
```

## 🔄 Ciclo de Dados

### Fluxo de Dados
1. Sensor IoT coleta dados
2. Dados são enviados para o Firebase
3. Frontend recebe atualização em tempo real
4. Interface atualiza automaticamente

### Estrutura do Banco de Dados
```javascript
{
  "sensors": {
    "sensor1": {
      "medição1": {
        "altura": 75,
        "tempo": "2024-03-21T14:30:00"
      },
      "medição2": {
        "altura": 80,
        "tempo": "2024-03-21T14:35:00"
      }
    }
  }
}
```

## 🛠 APIs e Integrações

### Firebase Realtime Database
```javascript
// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  // ...outras configurações
};
```

### Chart.js
```javascript
// Configuração básica do Chart.js
const chartConfig = {
  type: 'line',
  data: {
    datasets: [{
      label: 'Nível da Lixeira',
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }
};
```

## 🔧 Manutenção

### Backup de Dados
```bash
# Exportar dados do Firebase
firebase database:get / > backup.json

# Restaurar dados
firebase database:set / backup.json
```

### Limpeza de Dados Antigos
```javascript
// Script para limpar dados antigos
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const query = ref.orderByChild('tempo').endAt(oneMonthAgo.toISOString());
remove(query);
```

## 📈 Monitoramento e Analytics

### Firebase Analytics
```javascript
// Configuração do Analytics
const analytics = getAnalytics(app);

// Registrar eventos
logEvent(analytics, 'sensor_view', {
  sensor_id: 'sensor1',
  view_time: new Date().toISOString()
});
```

### Métricas Importantes
- Taxa de atualização dos sensores
- Tempo médio entre medições
- Picos de utilização
- Padrões de enchimento

## 🔒 Segurança

### Regras do Firebase
```json
{
  "rules": {
    "sensors": {
      ".read": "auth != null",
      ".write": "auth != null && auth.token.admin === true",
      "$sensorId": {
        ".validate": "newData.hasChildren(['altura', 'tempo'])"
      }
    }
  }
}
```

### Proteção de Dados
- Sanitização de inputs
- Validação de dados
- Rate limiting
- Controle de acesso

## 🚀 Otimizações

### Performance
```javascript
// Exemplo de code splitting
const Chart = await import(/* webpackChunkName: "chart" */ 'chart.js/auto');
```

### Caching
```javascript
// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 🌐 Internacionalização

### Suporte a Múltiplos Idiomas
```javascript
const messages = {
  pt: {
    title: 'Sistema de Monitoramento de Lixeiras',
    // ...
  },
  en: {
    title: 'Waste Bin Monitoring System',
    // ...
  }
};
```

## 🧪 Testes

### Testes Unitários
```bash
# Executar testes
npm test

# Coverage report
npm run test:coverage
```

### Testes E2E
```bash
# Executar testes E2E
npm run test:e2e
```

## 📱 PWA Support

### Manifest
```json
{
  "name": "Sistema de Monitoramento de Lixeiras",
  "short_name": "MonitorLixeiras",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🔄 CI/CD

### GitHub Actions
```yaml
name: CI/CD

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy
        run: npm run deploy
```

## 📚 Recursos Adicionais

### Links Úteis
- [Documentação do Firebase](https://firebase.google.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tutoriais
1. [Configuração Inicial](docs/setup.md)
2. [Integração com IoT](docs/iot-integration.md)
3. [Customização de Gráficos](docs/charts.md)

## 🤝 Code of Conduct

### Diretrizes
- Respeite outros contribuidores
- Mantenha discussões profissionais
- Siga as boas práticas de código
- Documente suas alterações

## 📝 Changelog

### v1.0.0 (2024-03-21)
- Lançamento inicial
- Suporte a múltiplos sensores
- Gráficos em tempo real

### v1.1.0 (2024-03-28)
- Adicionado suporte a PWA
- Melhorias na responsividade
- Correções de bugs

## 🔮 Roadmap

### Próximas Features
- [ ] Integração com sistemas de coleta
- [ ] App mobile nativo
- [ ] Machine learning para previsões
- [ ] Sistema de notificações push

## 👥 Contribuição
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença
Este projeto está sob a licença ISC.

## 👥 Autores
- Seu Nome (seus-contatos)

## 📞 Suporte
Para suporte, email@exemplo.com ou abra uma issue no GitHub.

## 🔄 Atualizações
O projeto é ativamente mantido e atualizado. Verifique o changelog para mais informações sobre as últimas alterações.