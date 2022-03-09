import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

const hello = async () => {
  return formatJSONResponse({
    message: `Hi mate, ct-identity-service is up and running!`,
    healthCheck: "OK",
  });
};

export const main = middyfy(hello);
