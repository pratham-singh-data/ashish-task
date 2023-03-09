const { Router, } = require(`express`);
const { registerUser,
    loginUser,
    logoutUser, } = require('../controller/userControllers');

// eslint-disable-next-line new-cap
const router = Router({
    caseSensitive: true,
});

router.post(`/register`, registerUser);
router.post(`/login`, loginUser);
router.post(`/logout`, logoutUser);

module.exports = router;

