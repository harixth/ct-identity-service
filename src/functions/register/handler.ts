import { connect } from "mongoose";
import {
  formatErrorResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import IdentityModel, { MONGODB_URL } from "../../db/model";
import schema from "./schema";

const register: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    await connect(MONGODB_URL);

    const { email, phone, password, authCode, verifyExpiry } = event.body;

    const newIdentity = new IdentityModel({
      email,
      phone,
      password,
      authCode,
      verifyExpiry,
    });

    const identity = await newIdentity.save();

    return formatJSONResponse({
      message: `successfully created an account`,
      identity,
    });
  } catch (error) {
    let message = `Something when wrong`;
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
