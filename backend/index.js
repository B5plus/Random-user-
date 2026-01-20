const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "https://random-user-1-yf7c.onrender.com",
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, whatsapp_phone, department } = req.body;

    if (!name || !whatsapp_phone || !department) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Please provide name, whatsapp_phone, and department",
      });
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(whatsapp_phone.replace(/[\s-]/g, ""))) {
      return res.status(400).json({
        error: "Invalid phone number",
        message: "Please provide a valid WhatsApp phone number",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          whatsapp_phone,
          department,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Database error",
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: data[0],
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Database error",
        message: error.message,
      });
    }

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

app.get("/api/users/department/:department", async (req, res) => {
  try {
    const { department } = req.params;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("department", department)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Database error",
        message: error.message,
      });
    }

    res.json({
      success: true,
      department,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Get random 50 users
app.get("/api/admin/users/random/:count", async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 50;

    // Get all users first
    const { data: allUsers, error: fetchError } = await supabase
      .from("users")
      .select("*");

    if (fetchError) {
      console.error("Supabase error:", fetchError);
      return res.status(500).json({
        error: "Database error",
        message: fetchError.message,
      });
    }

    // Shuffle and select random users
    const shuffled = allUsers.sort(() => 0.5 - Math.random());
    const selectedUsers = shuffled.slice(0, Math.min(count, allUsers.length));

    res.json({
      success: true,
      requested: count,
      selected: selectedUsers.length,
      total_users: allUsers.length,
      data: selectedUsers,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Create a new room
app.post("/api/admin/rooms", async (req, res) => {
  try {
    const { name, description, capacity } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Please provide a room name",
      });
    }

    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          name,
          description: description || null,
          capacity: capacity || 50,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Database error",
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: data[0],
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Add users to a room
app.post("/api/admin/rooms/:roomId/members", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Please provide an array of user IDs",
      });
    }

    // Create room member records
    const roomMembers = userIds.map((userId) => ({
      room_id: roomId,
      user_id: userId,
    }));

    const { data, error } = await supabase
      .from("room_members")
      .insert(roomMembers)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Database error",
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: `${data.length} users added to room successfully`,
      added_count: data.length,
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Get all rooms
app.get("/api/admin/rooms", async (req, res) => {
  try {
    const { data, error } = await supabase.from("room_details").select("*");

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Database error",
        message: error.message,
      });
    }

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Get room members
app.get("/api/admin/rooms/:roomId/members", async (req, res) => {
  try {
    const { roomId } = req.params;

    const { data, error } = await supabase
      .from("room_members_details")
      .select("*")
      .eq("room_id", roomId);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Database error",
        message: error.message,
      });
    }

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Delete a room
app.delete("/api/admin/rooms/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    const { data, error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", roomId)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Database error",
        message: error.message,
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        error: "Room not found",
        message: "The specified room does not exist",
      });
    }

    res.json({
      success: true,
      message: "Room deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
