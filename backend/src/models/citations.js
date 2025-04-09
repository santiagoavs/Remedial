import { Schema, model } from "mongoose";

const citationsSchema = new Schema (
    {
        date: {
            type: Date,
            require: true,
        },

        hour: {
            type: Number,
            require: true,
        },

        motive: {
            type: String,
            require: true,
        },

        assignedDoctor: {
            type: Schema.Types.ObjectId,
            ref: "doctors",
            require: true,
        },

        assignedPatient: {
            type: Schema.Types.ObjectId,
            ref: "patients",
            require: true,
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model ("citations", citationsSchema);