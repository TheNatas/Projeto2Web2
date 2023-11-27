const router = require("express").Router();

const UserController = require("../controllers/UserController");
const authenticator = require("../middlewares/Authenticator");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/list", authenticator, UserController.getUsers);
router.get("/:id", UserController.getUserById);
router.patch("/edit/:id", authenticator, UserController.editUser,);
router.delete("/delete/:id", authenticator, UserController.deleteUser);

module.exports = router;
