const { Router, } = require(`express`);
const { createPost,
    likePost,
    commentPost, } = require('../controller/postControllers');
const { checkToken, } = require('../middleware/checkToken');

// eslint-disable-next-line new-cap
const router = Router({
    caseSensitive: true,
});

router.post(`/`, checkToken, createPost);
router.post(`/like/:id/:type`, checkToken, likePost);
router.post(`/comment/:id`, checkToken, commentPost);

module.exports = router;
