const express = require('express'),
	router = express.Router(),
	Email = require('../models/email'),
	nodemailer = require('nodemailer'),
	{ check, validationResult } = require('express-validator');

// CREATE ROUTE
router.post(
	'/email',
	// Send subscription notification to provided e-email address
	[
		check('email[email]')
			// Adding custom error messages
			.not()
			.isEmpty()
			.withMessage('Elektroninio pašto adreso laukas negali būti tuščias')
			.isEmail()
			.withMessage('Šis elektroninio pašto adresas yra netinkamas')
			// Checking if provided email already exists in the database
			.custom((value, { req }) => {
				return new Promise((resolve, reject) => {
					Email.findOne({ email: req.body.email.email }, function (err, email) {
						if (err) {
							reject(new Error('Įvyko duomenų bazės klaida, prašome pranešti administratoriui'));
						}
						if (Boolean(email)) {
							// If provided email exists in the database, add custom error message
							reject(new Error('Šis elektroninio pašto adresas jau prenumeruoja tinklaraštį'));
							return;
						}
						resolve(true);
					});
				});
			}),
	],
	(req, res) => {
		// Checking for errors and adding error messages to 'errors' array
		const validationErrors = validationResult(req);
		let errors = [];
		if (!validationErrors.isEmpty()) {
			Object.keys(validationErrors.mapped()).forEach((field) => {
				errors.push(validationErrors.mapped()[field]['msg']);
			});
		}

		// If error array has values 'is truthy' flash error message and redirect user
		if (errors.length) {
			req.flash('error', errors[0]);
			res.redirect(req.get('referer'));
		} else {
			// Adding email to the database only if no errors are present
			Email.create(req.body.email, (err) => {
				if (err) {
					req.flash('error', 'Įvyko duomenų bazės klaida, prašome pranešti administratoriui');
					res.redirect(req.get('referer'));
				}
			});

			async function main() {
				const emailMessage = `
				<div style="background-color: #dfe7ff; text-align: center; padding-top: .5rem;
				padding-bottom: .5rem">
				<h2 style="">Sveiki!</h2>
				<h4>Dėkojame, kad prenumeruojate Koala Blog.</h4>
				<p>Pranešimus apie naujus tinklaraščio įrašus gausite į šį elektroninio pašto adresą.</p>
				<br>
				<p style="font-size: 14px">Norėdami atsisakyti prenumeratos parašykite mums elektroniniu paštu: 
				<<EMAIL>></p>
				<p style="font-size: 12px">© KOALA Blog 2020</p>
				<br>
				</div>
              `;

				let transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com', //SMTP email host
					port: 587,
					secure: false, // true for 465, false for other ports
					auth: {
						user: '<<EMAIL>>', // generated ethereal user
						pass: '<PASSWORD>>', // generated ethereal password
					},
				});

				await transporter.sendMail({
					from: '<<SENDER ADRESS>>', // sender address
					to: req.body.email.email, // list of receivers
					subject: '<<SUBJECT LINE>>', // Subject line
					html: emailMessage, // html body
				});
			}
			main().catch(console.error);

			req.flash('success', 'Elektroninio pašto adresas sėkmingai pridėtas prie prenumetatorių sąrašo');
			res.redirect(req.get('referer'));
		}
	}
);

module.exports = router;
