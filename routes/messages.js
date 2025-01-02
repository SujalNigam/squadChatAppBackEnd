const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
// router.post("/getlastmsg/", getLastMessage);


module.exports = router;
