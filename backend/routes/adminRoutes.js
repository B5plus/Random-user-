const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const roomController = require("../controllers/roomController");

router.get("/users/random/:count", userController.getRandomUsers);

router.post("/rooms", roomController.createRoom);
router.get("/rooms", roomController.getAllRooms);
router.get("/rooms/:roomId", roomController.getRoomById);
router.put("/rooms/:roomId", roomController.updateRoom);
router.delete("/rooms/:roomId", roomController.deleteRoom);
router.get("/rooms/:roomId/stats", roomController.getRoomStats);

router.get("/rooms/:roomId/members", roomController.getRoomMembers);
router.post("/rooms/:roomId/members", roomController.addMembersToRoom);
router.delete(
  "/rooms/:roomId/members/:userId",
  roomController.removeMemberFromRoom,
);

module.exports = router;
