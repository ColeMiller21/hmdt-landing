import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
    },
    designatedAddress: { type: String, required: false, maxLength: 50 },
    bidAmount: { type: Number, required: true },
    totalBalance: { type: Number, required: true },
    offChainWallet: { type: String, required: false, maxLength: 50 },
    balanceUpdateSinceLastOnchainSync: { type: Number, required: false },
    enrolled: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

//if not exists than create a table but if exists use schema
export default models.User || model("User", UserSchema);
