import * as crypto from "crypto";
import { connect } from "mongoose";
import { formatErrorResponse, formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import IdentityModel, { MONGODB_URL } from "../../db/model";
import { APIGatewayProxyEvent } from "aws-lambda";
import { isValidEmailAddress } from "@functions/login/utils";

const change = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters.id;

    await connect(MONGODB_URL);

    const identity = await IdentityModel.findById(id);

    if (!identity) {
      throw new Error("Identity not found");
    }

    return formatJSONResponse({
      message: `successfully find an identity`,
      identity,
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
