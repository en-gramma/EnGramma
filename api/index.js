import express from "express";
import authRoutes from "./routes/auth.js";
import passRecRoutes from"./routes/passRec.js";
import albumRoutes from "./routes/albums.js";
import dateRoutes from "./routes/dates.js";
import messageRoutes from "./routes/messages.js";
import linkRoutes from "./routes/links.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from 'node-fetch';


dotenv.config();

const apiUrl = process.env.API_URL_SERVER;
const app = express();

// activation de express.json
app.use(express.json());

// activation de cors
app.use(cors({
  origin: `${apiUrl}`,
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', `${apiUrl}`);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


// validation du captcha
app.post('/api/recaptcha', async (req, res) => {
  const { response } = req.body;
  const secret = process.env.SECRET_SITE_KEY;

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`;

  try {
    const captchaResponse = await fetch(url, { method: 'POST' });
    const data = await captchaResponse.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// activation de cookie-parser
app.use(cookieParser());
// utilisation des routes

app.use("/api/auth",authRoutes);
app.use("/api/passwordrecovery",passRecRoutes)
app.use("/api/albums", albumRoutes);
app.use("/api/dates", dateRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/links', linkRoutes);

//gestion des erreurs, les erreurs seront retournées avec ce message générique
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Une erreur s'est produite." });
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});