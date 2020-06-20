const middlewareObj = {};

middlewareObj.checkAdminPrivilige = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		return next();
	} else {
		req.flash('error', 'Šis svetainės adresas prieinamas tik administratoriui, prašome prisijungti');
		res.redirect('/login');
	}
};

module.exports = middlewareObj;
