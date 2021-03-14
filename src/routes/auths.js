const router = require("express").Router();
const { renderSignup, renderActivate, renderDashboard, renderSignin, create_account, activate_account, logout, login } = require("../controllers/authsControl");
const csrf = require("csurf");
const { checkUser } = require("../../@utils/verifyUser");

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/create_account', renderSignup);
router.post('/create_account', create_account);

router.get('/activate', renderActivate);
router.post('/activate', activate_account);
router.get('/signin', renderSignin);
router.get('/dashboard', checkUser, renderDashboard);
router.post('/signin', login);
router.get('/logout', checkUser, logout);


module.exports = router;