const { Schema, model, models } = require("mongoose");

const DebugSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    claimAmount: {
      type: Number,
      required: true,
      default: 1000,
    },
    claimStatus: {
      type: String,
      required: true,
      default: "unclaimed",
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//if not exists than create a table but if exists use schema
module.exports = models.Debug || model("Debug", DebugSchema);
