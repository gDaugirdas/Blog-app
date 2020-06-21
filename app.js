const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	flash = require('connect-flash'),
	LocalStrategy = require('passport-local');
port = 3000;
(sassMiddleware = require('node-sass-middleware')),
	(User = require('./models/user')),
	(Blog = require('./models/blog')),
	(Gallery = require('./models/gallery')),
	(Comment = require('./models/comment')),
	(Email = require('./models/email')),
	(helpers = require('./helpers'));

const blogRoutes = require('./routes/blog'),
	galleryRoutes = require('./routes/gallery'),
	commentRoutes = require('./routes/comment'),
	emailRoutes = require('./routes/email'),
	authRoutes = require('./routes/auth'),
	otherRoutes = require('./routes/other');

app.locals.moment = require('moment');

app.use(
	sassMiddleware({
		src: __dirname + '/sass', //where the sass files are
		dest: __dirname + '/public', //where css should go
		debug: true,
	})
);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

// CONNECT TO LOCAL DATABASE OR A CLUSTER

// connect to local database
mongoose.connect('mongodb://localhost/koala_blog_app');

// connect to a cluster
// mongoose
// 	.connect('<<MongoDB cluster link>>', {
// 		useNewUrlParser: true,
// 		useCreateIndex: true,
// 	})
// 	.then(() => {
// 		console.log('connected to DB');
// 	})
// 	.catch((err) => {
// 		console.log('ERROR', err.message);
// 	});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIG

app.use(
	require('express-session')({
		secret: 'Lost',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(blogRoutes);
app.use(galleryRoutes);
app.use(commentRoutes);
app.use(authRoutes);
app.use(emailRoutes);
app.use(otherRoutes);

app.listen(process.env.PORT || 3000);
