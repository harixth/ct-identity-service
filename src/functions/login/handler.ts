import * as crypto from "crypto";
import { connect } from "mongoose";
import {
  formatErrorResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";

import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import IdentityModel, { MONGODB_URL } from "../../db/model";
import schema from "./schema";

const login: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    await connect(MONGODB_URL);

    const identity = event.body.phone
      ? await IdentityModel.findOne({ phone: event.body.phone })
      : await IdentityModel.findOne({ email: event.body.email });

    if (identity.password) {
      const hmac = crypto
        .createHmac("sha512", event.body.password)
        .digest("hex")
        .toString();
      if (identity && identity.password === hmac) {
        return formatJSONResponse({
          message: `successfully sign in to an account`,
          identity,
        });
      }
    }
    throw new Error("identity not found");
  } catch (error) {
    return formatErrorResponse(
      {
        message: `Something when wrong`,
        error,
      },
      500
    );
  }
};

export const main = middyfy(login);
