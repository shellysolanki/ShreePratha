import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
       type: String, 
       required: [true, 'Name is required'],
       trim: true,
       minlength: [2, 'Name must be at least 2 characters'],
       maxlength: [50, 'Name must be under 50 characters']
      },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true 
    },
    password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
    phone: {
    type: String,
    trim: true,
    match: [/^\d{10}$/, 'Phone must be 10 digits']
    },
   role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },

    // 🔗 Associations
    bodycare: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bodycare" }],
    coupon: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }],
    inner: [{ type: mongoose.Schema.Types.ObjectId, ref: "Inner" }],
    jewellery: [{ type: mongoose.Schema.Types.ObjectId, ref: "Jewellery" }],
    makeup: [{ type: mongoose.Schema.Types.ObjectId, ref: "Makeup" }],
    order: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
