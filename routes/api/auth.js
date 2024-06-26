const express = require("express");
const {
  register,
  login,
  refresh,
  getCurrent,
  logout,
  updateTheme,
  updateProfile,
  getHelpEmail,
} = require("../../controllers/auth");

const User = require("../../models/user");
const { confirmEmail } = require("../../controllers/auth");
const validateBody = require("../../middlewares/validateBody");
const authenticate = require("../../middlewares/authenticate");
const schemas = require("../../models/validation-schemas/user-validation");
const uploadCloud = require("../../middlewares/uploadMiddlewares");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), register);

router.get("/confirm", async (req, res) => {
  const { userId, token } = req.query;

  try {
    await confirmEmail(userId, token);
    res.send("Email confirmed successfully!");
  } catch (error) {
    res.status(400).send("Error confirming email: " + error.message);
  }
});
router.post("/login", validateBody(schemas.loginSchema), login);

router.post("/refresh", validateBody(schemas.refreshSchema), refresh);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

router.patch(
  "/theme",
  authenticate,
  validateBody(schemas.themeSchema),
  updateTheme
);

router.put(
  "/profile",
  authenticate,
  uploadCloud.single("avatarURL"),
  validateBody(schemas.registerSchema),
  updateProfile
);

router.post(
  "/help",
  authenticate,
  validateBody(schemas.helpSchema),
  getHelpEmail
);

module.exports = router;
