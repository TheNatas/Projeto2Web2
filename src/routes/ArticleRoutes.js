const router = require("express").Router();

const ArticleController = require("../controllers/ArticleController");
const authenticator = require("../middlewares/Authenticator");

router.post("/create", authenticator, ArticleController.create);
router.post("/like/:id", ArticleController.likeArticle);
router.get("/list", ArticleController.getArticles);
router.get("/list/featured", ArticleController.getFeaturedArticles);
router.get("/list/suggested", ArticleController.getSuggestedArticles);
router.get("/list/author/:authorEmail", ArticleController.getArticlesByAuthor);
router.get("/list/keyword/:keyword", ArticleController.getArticlesByKeyword);
router.get("/list/likes", ArticleController.getMostLikedArticles);
router.get("/list/:permalink", ArticleController.getArticleByPermalink);
router.patch("/edit/:id", authenticator, ArticleController.editArticle);
router.delete("/delete/:id", authenticator, ArticleController.deleteArticle);

module.exports = router;
