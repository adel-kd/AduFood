import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  addresses: [
    {
      name: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      phone: String,
      isDefault: { type: Boolean, default: false },
    },
  ],
  usedPromoCodes: {
    type: [String],
    default: [],
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);