import { connect } from "mongoose";
import {
  formatErrorResponse,
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import IdentityModel, { MONGODB_URL } from "../../db/model";
import schema from "./schema";

const change: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const id = event.pathParameters.id;

    await connect(MONGODB_URL);

    const identity = event.body.oldPassword
      ? await IdentityModel.findById(id)
      : await IdentityModel.findOne({ authToken: id });

    if (!identity) {
      throw new Error("Identity not found");
    }

    if (event.body.oldPassword) {
      if (identity.password !== event.body.oldPassword) {
        throw new Error("Old Password is invalid");
      }
    } else {
      const currentTime = Math.round(new Date().getTime() / 1000);

      if (currentTime > Number(identity.verifyExpiry)) {
        throw new Error(
          "Verification link has expired, Please request a new one"
        );
      }
    }

    const updatedIdentity = await IdentityModel.findByIdAndUpdate(identity.id, {
      password: event.body.password,
    });

    return formatJSONResponse({
      message: `successfully changed password`,
      identity: updatedIdentity,
    });
  } catch (error) {
    return formatErrorResponse(
      {
        message: error.message ?? `Something when wrong during password update`,
        error,
      },
      500
    );
  }
};

export const main = middyfy(change);
