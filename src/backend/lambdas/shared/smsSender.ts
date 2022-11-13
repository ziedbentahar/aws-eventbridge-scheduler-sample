import AWS from "aws-sdk";
import { PublishInput } from "aws-sdk/clients/sns";
import { OperationResult } from "../types/operation-result";

const sns = new AWS.SNS({
  region: process.env.AWS_REGION,
});

const sendSms = async (messageToPublish: {
  message: string;
  phoneNumber: string;
}): Promise<OperationResult> => {
  const smsInput: PublishInput = {
    Message: messageToPublish.message,
    PhoneNumber: messageToPublish.phoneNumber,
  };
  const request = sns.publish(smsInput);

  const result = await request.promise();

  if (result.$response.httpResponse.statusCode == 200) {
    return {
      status: "Success",
    };
  } else {
    return {
      status: "Error",
      details: {
        statusMessage: result.$response.httpResponse.statusMessage,
        statusCode: result.$response.httpResponse.statusCode,
      },
    };
  }
};

export { sendSms };
