const router = require("express").Router();
const { renderSignup, renderActivate, renderDashboard, renderSignin, create_account } = require("../controllers/authsControl");
const csrf = require("csurf");

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/create_account', renderSignup);
router.post('/create_account', create_account);

router.get('/activate', renderActivate);
router.get('/signin', renderSignin);
// router.get('/create_account', renderSignup);


module.exports = router;