import { Schema, model, models } from "mongoose";

const ConfigSchema = new Schema(
  {
    raffleThreshold: {
      type: Number,
      required: true,
      maxLength: 50,
    },
    page: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

//if not exists than create a table but if exists use schema
export default models.Config || model("Config", ConfigSchema);
