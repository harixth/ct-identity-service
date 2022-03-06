export default {
  type: "object",
  properties: {
    oldPassword: { type: "string" },
    password: { type: "string" },
  },
  required: ["password"],
} as const;
