import * as crypto from "crypto";
import { connect } from "mongoose";
import { formatErrorResponse, formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import IdentityModel, { MONGODB_URL } from "../../db/model";
import { APIGatewayProxyEvent } from "aws-lambda";

const change = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters.id;

    await connect(MONGODB_URL);

    const identity = await IdentityModel.findById(id);

    if (!identity) {
      throw new Error("Identity not found");
    }

    const currentTime = Math.round(new Date().getTime() / 1000);
    const verifyExpiry = currentTime + 24 * 3600;

    const hmac = crypto
      .createHmac("sha256", identity.email + currentTime.toString())
      .digest("hex");

    const updatedIdentity = await IdentityModel.findByIdAndUpdate(identity.id, {
      authToken: hmac,
      verifyExpiry,
    });

    return formatJSONResponse({
      message: `successfully generate new token for password reset`,
      identity: updatedIdentity,
    });
  } catch (error) {
    return formatErrorResponse(
      {
        message:
          error.message ?? `Something when wrong during password reset request`,
        error,
      },
      500
    );
  }
};

export const main = middyfy(change);
