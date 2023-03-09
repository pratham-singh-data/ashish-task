const { Router, } = require(`express`);
const { registerUser,
    loginUser,
    logoutUser, } = require('../controller/userControllers');
const { checkToken, } = require('../middleware/checkToken');

// eslint-disable-next-line new-cap
const router = Router({
    caseSensitive: true,
});

router.post(`/register`, registerUser);
router.post(`/login`, loginUser);
router.post(`/logout`, checkToken, logoutUser);

module.exports = router;

