const {Router} = require('express');
const authController = require('../controller/auth.controller');
const router = Router();

router.post('/register',authController.registerUser);
router.post('/login',authController.loginUser);
router.post('/get-me',authController.getMe);
module.exports = router;    