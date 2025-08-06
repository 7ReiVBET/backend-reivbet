require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('Erro ao conectar MongoDB:', err));

// Rotas simples
app.get("/", (req, res) => {
  res.send("✅ API da ReivBET está rodando!");
});

// User schema/model
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  senha: String,
  saldo: { type: Number, default: 0 }
}));

// Registro
app.post("/auth/register", async (req, res) => {
  const { email, senha } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "Email já cadastrado" });
  const user = new User({ email, senha });
  await user.save();
  res.json({ message: "Usuário registrado com sucesso", user });
});

// Login
app.post("/auth/login", async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email, senha });
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });
  res.json({ message: "Login bem-sucedido", user });
});

// Ver saldo
app.get("/balance/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json({ saldo: user.saldo });
});

// Simulação de PIX (modo teste)
app.post("/pix", async (req, res) => {
  const { email, valor } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  user.saldo += valor;
  await user.save();
  res.json({ message: "Pix de teste recebido", saldoAtual: user.saldo });
});

// Start
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));