const supabase = require("../config/database");

class RoomService {
  async createRoom(roomData) {
    const { name, description, capacity } = roomData;

    const { data, error } = await supabase
      .from("rooms")
      .insert([{ name, description, capacity }])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  }

  async getAllRooms() {
    const { data, error } = await supabase
      .from("room_details")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getRoomById(roomId) {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getRoomMembers(roomId) {
    const { data, error } = await supabase
      .from("room_members_details")
      .select("*")
      .eq("room_id", roomId)
      .order("added_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async addMembersToRoom(roomId, userIds) {
    const members = userIds.map((userId) => ({
      room_id: roomId,
      user_id: userId,
    }));

    const { data, error } = await supabase
      .from("room_members")
      .insert(members)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async removeMemberFromRoom(roomId, userId) {
    const { data, error } = await supabase
      .from("room_members")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", userId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  }

  async updateRoom(roomId, roomData) {
    const { data, error } = await supabase
      .from("rooms")
      .update(roomData)
      .eq("id", roomId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  }

  async deleteRoom(roomId) {
    const { data, error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", roomId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  }

  async getRoomStats(roomId) {
    const room = await this.getRoomById(roomId);
    const members = await this.getRoomMembers(roomId);

    return {
      room,
      totalMembers: members.length,
      capacity: room.capacity,
      availableSlots: room.capacity - members.length,
      members,
    };
  }
}

module.exports = new RoomService();
