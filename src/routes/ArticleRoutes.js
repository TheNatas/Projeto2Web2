const router = require("express").Router();

const ArticleController = require("../controllers/ArticleController");

router.post("/create", ArticleController.create);
router.post("/login", ArticleController.login);
router.get('/test', ArticleController.test);
router.get("/checkuser", ArticleController.checkUser);
router.get("/:id", ArticleController.getUserById);
router.patch(
"/edit/:id", 
ArticleController.editUser,
);

module.exports = router;
