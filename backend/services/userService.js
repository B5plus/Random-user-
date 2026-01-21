const supabase = require("../config/database");

class UserService {
  async createUser(userData) {
    const { name, whatsapp_phone, department } = userData;

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, whatsapp_phone, department }])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  }

  async getAllUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getUsersByDepartment(department) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("department", department)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getRandomUsers(count) {
    const { count: totalCount, error: countError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (countError) {
      throw new Error(countError.message);
    }

    const { data: allUsers, error: usersError } = await supabase
      .from("users")
      .select("*");

    if (usersError) {
      throw new Error(usersError.message);
    }

    const shuffled = allUsers.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, allUsers.length));

    return {
      users: selected,
      totalCount: totalCount,
      selectedCount: selected.length,
    };
  }

  async getUserById(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async updateUser(userId, userData) {
    const { data, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", userId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  }

  async deleteUser(userId) {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  }
}

module.exports = new UserService();
