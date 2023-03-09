const { Router, } = require(`express`);
const { createPost, } = require('../controller/postControllers');
const { checkToken, } = require('../middleware/checkToken');

// eslint-disable-next-line new-cap
const router = Router({
    caseSensitive: true,
});

router.post(`/`, checkToken, createPost);

module.exports = router;
