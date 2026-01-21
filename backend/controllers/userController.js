const userService = require("../services/userService");

class UserController {
  async createUser(req, res) {
    try {
      const { name, whatsapp_phone, department } = req.body;
      if (!name || !whatsapp_phone || !department) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
          message: "Please provide name, whatsapp_phone, and department",
        });
      }

      const user = await userService.createUser({
        name,
        whatsapp_phone,
        department,
      });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();

      res.json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async getUsersByDepartment(req, res) {
    try {
      const { department } = req.params;

      const users = await userService.getUsersByDepartment(department);

      res.json({
        success: true,
        department: department,
        count: users.length,
        data: users,
      });
    } catch (error) {
      console.error("Error fetching users by department:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async getRandomUsers(req, res) {
    try {
      const count = parseInt(req.params.count) || 50;

      const result = await userService.getRandomUsers(count);

      res.json({
        success: true,
        total_users: result.totalCount,
        selected: result.selectedCount,
        data: result.users,
      });
    } catch (error) {
      console.error("Error selecting random users:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(404).json({
        success: false,
        error: "User not found",
        message: error.message,
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;

      const user = await userService.updateUser(id, userData);

      res.json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await userService.deleteUser(id);

      res.json({
        success: true,
        message: "User deleted successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        success: false,
        error: "Database error",
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
