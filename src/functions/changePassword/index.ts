import { handlerPath } from "@libs/handler-resolver";
import schema from "./schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "put",
        path: "change-password/{id}",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
    {
      http: {
        method: "put",
        path: "reset-password/{id}",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
