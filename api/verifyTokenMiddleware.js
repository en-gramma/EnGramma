import session from "express-session";
import MySQLStore from "express-mysql-session";
import { v4 as uuidv4 } from "uuid";

const MySQLStoreSession = MySQLStore(session);

const sessionStore = new MySQLStoreSession({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  clearExpired: true,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
});

const sessionMiddleware = session({
  genid: (req) => {
    return uuidv4();
  },
  secret: 'your secret',
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    path: '/',
    httpOnly: true,
    secure: "auto",
    sameSite: "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000,
  }, 
  store: sessionStore, 
});

const verifySessionMiddleware = (req, res, next) => {
    req.session.userId = 'userId';

    if (!req.session || !req.session.userId) {
        console.error('Session verification failed:', req.session);
        return res.status(401).json("Non authentifié");
    }

    req.userId = req.session.userId;
    next();
};

export { sessionMiddleware, verifySessionMiddleware };