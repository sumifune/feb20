var createError = require("http-errors");
var passport = require("passport");
var flash = require('connect-flash');
var express = require("express");
var session = require("express-session");
var redis = require("redis");
var RedisStore = require("connect-redis")(session);
var path = require("path");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var walletsRouter = require("./routes/wallets");
var redisRouter = require("./routes/redis");
var v1 = require("./routes/v1");
var sessionsRouter = require("./routes/sessions");
var rbacRouter = require("./routes/rbac");

var db = require("./db");
var redisParallelAuth = require("./redis");

var setUpPassport = require("./authentication/setup-passport");

// var dictValidator = require("./authentication/dictionary-validator.js");

var app = express();

setUpPassport();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// app.use(cookieParser());
// sinon-test or sinon-mongoose can produce problems
let redisClient = redis.createClient({
  host: "redis",
  port: 6379,
  // password: 'funky password here', // no creo que use esto  -ALLOW_EMPTY_PASSWORD=yes in dc file
  db: 1 // DB used for sessions
});
redisClient.unref();
redisClient.on('error', function (err) {
    console.log(` ERROR >>> Something went wrong ${err} `);
});
redisClient.on('connect', function() {
    console.log(` SUCCESS >>> Redis client connected`);
});

let store = new RedisStore({
  client: redisClient,
  // If the session cookie has a expires date,
  // connect-redis will use it as the TTL.
  // Check documentation.
  ttl: 20 * 60 // TTL of 20 minutes represented in seconds - OWASP
});

app.use(
  session({
    store: store,
    name: "id", // <-- a generic name for the session id - ofuscation
    secret: "this is a nice secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      // domain: 'secure.example.com', // limit the cookie exposure
      // secure: true, // set the cookie only to be served with HTTPS
      path: "/",
      httpOnly: true, // Mitigate XSS
      maxAge: 1000 * 60 * 15 // 15 minutos
    }
  })
);

// ---------------------- Two-tier session system ---------------------------
// Extend the Session prototype with some custom functions
// Add a login function
// session.Session.prototype.login = function login(cb) {
//   // The sessionID is now regenerated upon login,
//   // which mitigates the session-fixation attack vector.
//   var req = this.req;
//   this.regenerate(function(err) {
//     if (err) {
//       cb(err);
//       return;
//     }
//     req.session._loggedInAt = Date.now();
//     // Bind the session to Prevent Hijacking
//     req.session._ip = req.ip;
//     req.session._ua = req.headers["user-agent"];
//     cb();
//   });
// };
// Add a function to check the logged in status of the user
// session.Session.prototype.isLoggedIn = function isLoggedIn() {
//   return !!this._loggedInAt;
// };
// // Add a function to check the freshness of the session
// session.Session.prototype.isFresh = function isFresh() {
//   // Return true if logged in less then 3 minutes ago

//   console.log("------------------------------------------------------------");
//   console.log("Date.now - " + Date.now());
//   console.log("this._loggedInAt - " + this._loggedInAt);
//   console.log("minutos - " + 1000 * 60 * 3);
//   console.log("------------------------------------------------------------");

//   return this._loggedInAt && Date.now() - this._loggedInAt < 1000 * 60 * 3;
// };

// // Check Session information
// // to Prevent Session Hijacking
// app.use(function(req, res, next) {
//   if (!req.session) {
//     // If there is no session then something is wrong
//     next(new Error("Session object missing"));
//     return;
//   }
//   if (!req.session.isLoggedIn()) {
//     // If not logged in then continue
//     console.log("Not logged in");
//     next();
//     return;
//   }
//   if (req.session._ip !== req.ip) {
//     // Check ip match
//     // It would be wise to log more information here
//     // to either notify the user or
//     // to try and prevent further attacks
//     console.warn("The request IP did not match session IP");
//     // Generate a new unauthenticated session
//     req.session.regenerate(function() {
//       next();
//     });
//     return;
//   }
//   if (req.session._ua !== req.headers["user-agent"]) {
//     // Check UA validity
//     // It would be wise to log more information here
//     // to either notify the user or
//     // to try and prevent further attacks
//     console.warn("The request User Agent did not match session user agent");
//     // Generate a new unauthenticated session
//     req.session.regenerate(function() {
//       next();
//     });
//     return;
//   }
//   // Everything checks out so continue
//   next();
// });

// The SessionID should never be cached
// Set cache control header to eliminate cookies from cache
//
// The no-cache="Set-Cookie" tells the browser not to cache the server "Set-Cookie" header
// http://www.w3.org/Protocols/HTTP/Issues/cache-private.html
// app.use(function(req, res, next) {
//   res.header("Cache-Control", 'no-cache="Set-Cookie, Set-Cookie2"');
//   next();
// });

// passport uses flash to give feedback
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  // Everything added to res.locals will be available to
  // the view engine i.e. pug, ejs,...
  //
  // passport adds user to req
  res.locals.currentUser = req.user;
  // Passport uses flash to send messages.
  // Dump flash messages to res.local.
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  // express-session add session to req
  res.locals.session = req.session;
  next();

});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/wallets", walletsRouter);
app.use("/v1", v1);
app.use("/sessions", sessionsRouter);
app.use("/redis", redisRouter);
app.use("/rbac", rbacRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
