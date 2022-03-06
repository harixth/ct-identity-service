export default {
  type: "object",
  properties: {
    email: { type: "string" },
    phone: { type: "string" },
    password: { type: "string" },
  },
  required: ["password"],
} as const;
