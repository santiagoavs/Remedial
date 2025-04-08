import { Schema, model } from "mongoose";

const patientsSchema = new Schema (
    {
        name: {
            type: String,
            require: true,
        },

        age: {
            type: Number,
            require: true,
        },

        email: {
            type: String,
            require: true,
        },

        password: {
            type: String,
            require: true,
        },

        telephone: {
            type: String,
        },

        isVerified: {
            type: Boolean,
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model ("patients", patientsSchema);