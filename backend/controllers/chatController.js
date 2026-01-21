const chatService = require("../services/chatService");

class ChatController {
  async sendMessage(req, res) {
    try {
      const { room_id, sender_type, sender_id, sender_name, message } = req.body;

      if (!room_id || !sender_type || !sender_name || !message) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
          message: "Please provide room_id, sender_type, sender_name, and message",
        });
      }

      const chatMessage = await chatService.sendMessage({
        room_id,
        sender_type,
        sender_id: sender_id || null,
        sender_name,
        message,
      });

      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: chatMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async getRoomMessages(req, res) {
    try {
      const { roomId } = req.params;

      const messages = await chatService.getRoomMessages(roomId);

      res.json({
        success: true,
        count: messages.length,
        data: messages,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async verifyPlayerAccess(req, res) {
    try {
      const { roomId } = req.params;
      const { whatsapp_phone } = req.body;

      if (!whatsapp_phone) {
        return res.status(400).json({
          success: false,
          error: "Missing required field",
          message: "Please provide whatsapp_phone",
        });
      }

      const result = await chatService.verifyPlayerAccess(roomId, whatsapp_phone);

      if (!result.hasAccess) {
        return res.status(403).json({
          success: false,
          error: "Access denied",
          message: "You are not a member of this room",
        });
      }

      res.json({
        success: true,
        message: "Access granted",
        data: result.user,
      });
    } catch (error) {
      console.error("Error verifying access:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;

      const message = await chatService.deleteMessage(messageId);

      res.json({
        success: true,
        message: "Message deleted successfully",
        data: message,
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }
}

module.exports = new ChatController();

