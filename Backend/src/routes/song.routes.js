const express = require("express");
const upload = require("../middleware/upload.middleware");
const songController = require("../controller/song.controller");

const router = express.Router();

router.post("/", upload.single("song"), songController.uploadSong);

router.get("/",songController.getSongs);

module.exports = router;