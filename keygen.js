import crypto from "crypto";

// Generate a 256-bit (32-byte) random key
const jwtSecretKey = crypto.randomBytes(32).toString("hex");

console.log("JWT Secret Key:", jwtSecretKey);
