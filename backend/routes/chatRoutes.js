const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/messages", chatController.sendMessage);
router.get("/rooms/:roomId/messages", chatController.getRoomMessages);
router.post("/rooms/:roomId/verify-access", chatController.verifyPlayerAccess);
router.delete("/messages/:messageId", chatController.deleteMessage);
router.get("/player/rooms", chatController.getPlayerRooms);

module.exports = router;
