import { connect } from "mongoose";
import {
  formatErrorResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import IdentityModel, { MONGODB_URL } from "../../db/model";

const register: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    await connect(MONGODB_URL);

    const { email, phone, password, authToken, authCode, verifyExpiry } =
      event.body;

    // TODO: Find better way to prevent null phone number colliding in unique field
    const count = await IdentityModel.count();

    const newIdentity = new IdentityModel({
      email,
      phone: phone ?? count.toString(),
      password,
      authToken,
      authCode,
      verifyExpiry,
    });

    const identity = await newIdentity.save();

    return formatJSONResponse({
      message: `successfully created an account`,
      identity,
    });
  } catch (error) {
    let message =
      error.message ?? `Something when wrong during account creation`;
    if (error.code === 11000) {
      message = "Your email or phone already associated to an account";
    }
    return formatErrorResponse(
      {
        message,
        error,
      },
      500
    );
  }
};

export const main = middyfy(register);
