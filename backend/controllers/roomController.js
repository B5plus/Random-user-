const roomService = require("../services/roomService");

class RoomController {
  async createRoom(req, res) {
    try {
      const { name, description, capacity } = req.body;

      if (!name || !capacity) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
          message: "Please provide name and capacity",
        });
      }

      const room = await roomService.createRoom({
        name,
        description: description || "",
        capacity,
      });

      res.status(201).json({
        success: true,
        message: "Room created successfully",
        data: room,
      });
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async getAllRooms(req, res) {
    try {
      const rooms = await roomService.getAllRooms();

      res.json({
        success: true,
        count: rooms.length,
        data: rooms,
      });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async getRoomById(req, res) {
    try {
      const { roomId } = req.params;

      const room = await roomService.getRoomById(roomId);

      res.json({
        success: true,
        data: room,
      });
    } catch (error) {
      console.error("Error fetching room:", error);
      res.status(404).json({
        success: false,
        error: "Room not found",
        message: error.message,
      });
    }
  }

  async getRoomMembers(req, res) {
    try {
      const { roomId } = req.params;

      const members = await roomService.getRoomMembers(roomId);

      res.json({
        success: true,
        room_id: roomId,
        count: members.length,
        data: members,
      });
    } catch (error) {
      console.error("Error fetching room members:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async addMembersToRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { userIds } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Invalid input",
          message: "Please provide an array of user IDs",
        });
      }

      const members = await roomService.addMembersToRoom(roomId, userIds);

      res.status(201).json({
        success: true,
        message: "Members added to room successfully",
        added_count: members.length,
        data: members,
      });
    } catch (error) {
      console.error("Error adding members to room:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async removeMemberFromRoom(req, res) {
    try {
      const { roomId, userId } = req.params;

      const member = await roomService.removeMemberFromRoom(roomId, userId);

      res.json({
        success: true,
        message: "Member removed from room successfully",
        data: member,
      });
    } catch (error) {
      console.error("Error removing member from room:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async updateRoom(req, res) {
    try {
      const { roomId } = req.params;
      const roomData = req.body;

      const room = await roomService.updateRoom(roomId, roomData);

      res.json({
        success: true,
        message: "Room updated successfully",
        data: room,
      });
    } catch (error) {
      console.error("Error updating room:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async deleteRoom(req, res) {
    try {
      const { roomId } = req.params;

      const room = await roomService.deleteRoom(roomId);

      res.json({
        success: true,
        message: "Room deleted successfully",
        data: room,
      });
    } catch (error) {
      console.error("Error deleting room:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async getRoomStats(req, res) {
    try {
      const { roomId } = req.params;

      const stats = await roomService.getRoomStats(roomId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error fetching room stats:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }
}

module.exports = new RoomController();
