import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get one admin by ID
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching admin' });
  }
};

// Create new admin
export const createAdmin = async (req, res) => {
  try {
    const newAdmin = new Admin(req.body);
    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
  } catch (err) {
    res.status(400).json({ error: 'Error creating admin' });
  }
};

// Update admin
export const updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAdmin) return res.status(404).json({ error: 'Admin not found' });
    res.json(updatedAdmin);
  } catch (err) {
    res.status(400).json({ error: 'Error updating admin' });
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ message: 'Admin deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting admin' });
  }
};

// Enhanced user summary with detailed analytics
export const getUserSummary = async (req, res) => {
  try {
    const users = await User.find({}, 'name email phone role createdAt');
    
    // Get detailed order analytics
    const orderAgg = await Order.aggregate([
      {
        $lookup: {
          from: 'orderitems',
          localField: '_id',
          foreignField: 'order',
          as: 'items'
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$user',
          orders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          totalProductsBought: { $sum: '$items.quantity' },
          products: {
            $push: {
              productId: '$items.product',
              productType: '$items.productType',
              quantity: '$items.quantity',
              price: '$items.price',
              orderDate: '$createdAt'
            }
          },
          lastOrderDate: { $max: '$createdAt' },
          firstOrderDate: { $min: '$createdAt' }
        }
      }
    ]);

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today }
        }
      },
      {
        $lookup: {
          from: 'orderitems',
          localField: '_id',
          foreignField: 'order',
          as: 'items'
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$user',
          todayOrders: { $sum: 1 },
          todaySpent: { $sum: '$totalAmount' },
          todayProducts: { $sum: '$items.quantity' }
        }
      }
    ]);

    const byUser = new Map(orderAgg.map(o => [String(o._id), o]));
    const todayByUser = new Map(todayOrders.map(o => [String(o._id), o]));

    const result = users.map(u => {
      const agg = byUser.get(String(u._id)) || { 
        orders: 0, 
        totalSpent: 0, 
        totalProductsBought: 0, 
        products: [],
        lastOrderDate: null,
        firstOrderDate: null
      };
      const todayData = todayByUser.get(String(u._id)) || { 
        todayOrders: 0, 
        todaySpent: 0, 
        todayProducts: 0 
      };

      return {
        userId: u._id,
        name: u.name || 'N/A',
        email: u.email,
        phone: u.phone || 'N/A',
        role: u.role,
        orders: agg.orders,
        totalSpent: agg.totalSpent,
        totalProductsBought: agg.totalProductsBought,
        todayOrders: todayData.todayOrders,
        todaySpent: todayData.todaySpent,
        todayProducts: todayData.todayProducts,
        products: agg.products,
        lastOrderDate: agg.lastOrderDate,
        firstOrderDate: agg.firstOrderDate,
        createdAt: u.createdAt,
      };
    });

    res.json({ userDetails: result });
  } catch (err) {
    console.error('Error in getUserSummary:', err);
    res.status(500).json({ error: 'Failed to build user summary' });
  }
};

// Get all users with full details
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { name, email, role }, 
      { new: true, select: '-password' }
    );
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};