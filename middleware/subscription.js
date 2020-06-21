const middlewareObj = {},
	Email = require('../models/email'),
	nodemailer = require('nodemailer');

middlewareObj.sendSubscription = (req, res, next) => {
	Email.find({}, (err, allEmails) => {
		const subscirberEmailArray = allEmails.map((a) => a.email);

		const emailMessage = `
		<div style="
		width: 100%;
		padding-top: .5rem;
		padding-bottom: .5rem;
		background-color: #dfe7ff; text-align: center">
   <h2>Naujas Koala Blog įrašas!</h2>
   <h2 style="font-size: 2rem;">${req.body.blog.title}</h2>
	 <div style="max-height: 30rem;
		 width: 100%;
		 overflow: hidden;
		 display: flex;">
	   <img style="width: 100%; object-fit: cover;" src="${req.body.blog.blogImage}" alt="(Paveikslėlio apibūdinimas)">
	</div>
	<div style="padding: .5rem 0">
	   <h2 style="font-size: 1.8rem; font-weight: normal;">${req.body.blog.titleHeading}</h2>
	   <p style="font-size: 1.4rem;">${req.body.blog.body.substring(0, 500)}...</p>
	   <a style="font-size: 1.8rem; display: block; padding-bottom: 1rem" href="<<SITENAME.COM/Blogs/+${
			req.body.blog.id
		}>>">Skaityti įrašą</a>
	   <p style="font-size: 14px">Norėdami atsisakyti prenumeratos parašykite mums elektroniniu paštu: 
	   <<EMAIL>></p>
	   <p style="font-size: 12px;  padding-bottom: 1rem">© KOALA Blog 2020</p>
	</div>
  </div>
      `;
		async function main() {
			let transporter = nodemailer.createTransport({
				host: 'smtp.gmail.com', //SMTP email host
				port: 587,
				secure: false, // true for 465, false for other ports
				auth: {
					user: '<<EMAIL>>', // generated ethereal user
					pass: '<<PASSWORD>>', // generated ethereal password
				},
			});

			// send mail with defined transport object
			// Looping though subscriberEmailArray, sending mail to each one, not to show mailing list to all subscription recipients
			for (var i = 0; i < subscirberEmailArray.length; i++) {
				let info = await transporter.sendMail({
					from: '<<SENDER ADRESS>>', // sender address
					to: subscirberEmailArray[i], // list of receivers
					subject: '<<SUBJECT LINE>>', // Subject line
					html: emailMessage, // html body
				});
			}
		}
		main().catch(console.error);
	});
	next();
};

module.exports = middlewareObj;
