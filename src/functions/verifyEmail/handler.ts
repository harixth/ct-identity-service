import { connect } from "mongoose";
import { formatErrorResponse, formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import IdentityModel, { MONGODB_URL } from "../../db/model";
import { APIGatewayProxyEvent } from "aws-lambda";

const verify = async (event: APIGatewayProxyEvent) => {
  try {
    const code = event.pathParameters.code;
    const token = event.pathParameters.token;

    await connect(MONGODB_URL);

    const identity = await IdentityModel.findOne({ authToken: token });

    if (!identity) {
      throw new Error("Account not found");
    }

    if (identity.emailVerified) {
      throw new Error("Email has already been verified");
    }

    const currentTime = Math.round(new Date().getTime() / 1000);

    if (currentTime > Number(identity.verifyExpiry)) {
      throw new Error(
        "Verification code has expired, Please request a new one"
      );
    }

    if (identity.authCode !== Number(code)) {
      throw new Error("Code entered is invalid");
    }

    const updatedIdentity = await IdentityModel.findByIdAndUpdate(
      identity.id,
      {
        emailVerified: true,
        verifyExpiry: currentTime,
      },
      { new: true }
    );

    return formatJSONResponse({
      message: `successfully verified an email`,
      identity: updatedIdentity,
    });
  } catch (error) {
    return formatErrorResponse(
      {
        message:
          error.message ?? `Something when wrong during email verification`,
        error,
      },
      500
    );
  }
};

export const main = middyfy(verify);
