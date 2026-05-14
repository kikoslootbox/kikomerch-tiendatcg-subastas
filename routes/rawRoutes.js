const router =
require("express").Router();

const controller =
require("../controllers/rawController");

const upload =
require("../middleware/upload");

/* =========================
GET
========================= */

router.get(
  "/",
  controller.getAll
);

/* =========================
CREATE
========================= */

router.post(

  "/",

  upload.single("image"),

  controller.create

);

/* =========================
DELETE
========================= */

router.delete(
  "/:id",
  controller.delete
);

module.exports = router;