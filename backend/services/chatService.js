const supabase = require("../config/database");

class ChatService {
  async sendMessage(messageData) {
    const { room_id, sender_type, sender_id, sender_name, message } =
      messageData;

    const { data, error } = await supabase
      .from("chat_messages")
      .insert([
        {
          room_id,
          sender_type,
          sender_id,
          sender_name,
          message,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  }

  async getRoomMessages(roomId) {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async verifyPlayerAccess(roomId, whatsappPhone) {
    const { data: member, error } = await supabase
      .from("room_members_details")
      .select("*")
      .eq("room_id", roomId)
      .eq("whatsapp_phone", whatsappPhone)
      .single();

    if (error || !member) {
      return { hasAccess: false, user: null };
    }

    return { hasAccess: true, user: member };
  }

  async deleteMessage(messageId) {
    const { data, error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("id", messageId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  }

  async getPlayerRooms(whatsappPhone) {
    const { data, error } = await supabase
      .from("room_members_details")
      .select("*")
      .eq("whatsapp_phone", whatsappPhone)
      .order("added_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

module.exports = new ChatService();
