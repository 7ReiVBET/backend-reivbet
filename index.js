const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.use(cors({
  origin: ['https://7reivbet.github.io'],
  methods: ['GET', 'POST'],
}));

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err));

// Health check (Render exige isso)
app.get('/health', (req, res) => {
  res.send("OK");
});

// Exemplo de rota de teste
app.get('/api/ping', (req, res) => {
  res.json({ pong: true });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
