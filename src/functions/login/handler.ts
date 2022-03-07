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
import { isValidEmailAddress } from "./utils";

const login: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    await connect(MONGODB_URL);

    const identity = isValidEmailAddress(event.body.username)
      ? await IdentityModel.findOne({ email: event.body.username })
      : await IdentityModel.findOne({ phone: event.body.username });

    if (!identity) {
      throw new Error("Account not found");
    }

    if (identity.password) {
      const hmac = crypto
        .createHmac("sha256", event.body.password)
        .digest("hex")
        .toString();
      if (identity.password === hmac) {
        return formatJSONResponse({
          message: `successfully sign in to an account`,
          identity,
        });
      } else {
        throw new Error("Password is invalid");
      }
    }
  } catch (error) {
    let message = error.message ?? `Something when wrong during sign in`;
    return formatErrorResponse(
      {
        message,
        error,
      },
      500
    );
  }
};

export const main = middyfy(login);
