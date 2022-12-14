import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";
import register from "@functions/register";
import login from "@functions/login";
import verifyEmail from "@functions/verifyEmail";
import changePassword from "@functions/changePassword";
import forgotPassword from "@functions/forgotPassword";
import identity from "@functions/identity";

const serverlessConfiguration: AWS = {
  service: "ct-identity-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: {
    hello,
    register,
    login,
    verifyEmail,
    changePassword,
    forgotPassword,
    identity,
  },
  package: { individually: true },
  custom: {
    ["serverless-offline"]: {
      httpPort: 5000,
      websocketPort: 5001,
      lambdaPort: 5002,
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
