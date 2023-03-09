const { Router, } = require(`express`);
const { createPost,
    likePost,
    commentPost,
    getPost,
    getAllPost, } = require('../controller/postControllers');
const { checkToken, } = require('../middleware/checkToken');

// eslint-disable-next-line new-cap
const router = Router({
    caseSensitive: true,
});

router.post(`/`, checkToken, createPost);
router.patch(`/like/:id`, checkToken, likePost);
router.post(`/comment/:id`, checkToken, commentPost);
router.get(`/`, checkToken, getPost, getAllPost);

module.exports = router;
