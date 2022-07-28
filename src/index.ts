import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    loggedIn: boolean,
    username: string
  }
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  name: '<UNIQUE_APPS_NAME>',
  secret: '<COOKIE_SECRET>',
  saveUninitialized: false
}));

app.get('/', (req, res) => {
  if (!req.session.loggedIn) res.json({
    success: false,
    message: 'Not authenticated'
  });
  else res.json({
    success: true,
    message: 'Authenticated'
  });
});

app.post('/login',
  (req, res, next) => {
    if (req.body.username == 'root' && req.body.password == 'jaringan') {
      res.locals.username = req.body.username;
      next();
    } else res.sendStatus(401);
  },
  (req, res, next) => {
    req.session.loggedIn = true;
    req.session.username = res.locals.username;
    res.json({
      success: true,
      message: 'Login success'
    })
  }
);

app.get('/logout', (req, res, next) => {
  req.session.destroy(err => { });
  res.json({
    status: true,
    message: 'Logout success'
  })
})

app.listen(4000,  () => {
  console.log('listening to port 4000...');
})