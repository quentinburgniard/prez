const axios = require('axios');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const router = express.Router();

const app = express();
const port = 8080;

app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.static('public', { maxAge: '7d' }));
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.set('view engine', 'pug');
app.disable('view cache');

app.use((req, res, next) => {
  //res.set('cache-control', 'max-age=3600');
  next();
});

app.use((req, res, next) => {
  res.utils = {
    cdn: (URL) => {
      return URL.replace('digitalleman.fra1.digitaloceanspaces.com', 'static.digitalleman.com');
    } 
  };
  next();
});

app.use((req, res, next) => {
  req.token = req.cookies.t || '';
  next();
});

app.get('/:id', (req, res, next) => {
  axios.get('https://api.digitalleman.com/v2/presentations/' + req.params.id + '?populate=slides', {
    headers: {
      'authorization': `Bearer ${req.token}`
    },
    params: {
      populate: 'slides'
    }
  })
  .then((api) => {
    res.render('App', {
      presentation: api.data.data
    });
  })
  .catch(function (error) {
    if (error && [401, 403].includes(error.response.status)) {
      res.redirect('https://id.digitalleman.com?r=prez.digitalleman.com%2F' + req.params.id);
    } else {
      res.sendStatus(error.response.status);
    }
  });
});



//app.set('view engine', 'pug');

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  res.status(err.status || 500);
  res.send(err);
});

app.listen(port);