Tools and dependencies

* GULP is used for assets compiling and bundling.
* Babel is used to compile new ES syntax to older versions.
* EJS is used for html templating.

Run project

* Connect the project to a databse in app.js file (line 38 - 54)
* From root folder in terminal run "gulp" (this command runs gulp development server)
* Open http://localhost:3000/

Set blog admin priviliges

* In project routes/auth.js directory (line 19) set req.body.adminCode
* Enter the set req.body.adminCode in /register page, while creating new user, to be granted admin priviliges

Set nodemailer parameters for blog subsciption service

* Set subsciption e-email message and email parameters for new blog post notification in project middleware/subscription.js directory.
* Set new subscriber notification message and email parameters in project routes/email.js directory.
