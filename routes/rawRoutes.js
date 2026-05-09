const router = require("express").Router();

const controller = require("../controllers/rawController");

router.get("/", controller.getAll);

router.post("/", controller.create);

router.delete("/:id", controller.delete);

module.exports = router;