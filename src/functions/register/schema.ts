export default {
  type: "object",
  properties: {
    email: { type: "string" },
    phone: { type: "string" },
    password: { type: "string" },
    authCode: { type: "number" },
    verifyExpiry: { type: "string" },
  },
  required: ["password"],
} as const;
