import { Context, SQSEvent } from "aws-lambda";
import AWS from "aws-sdk";
import { PublishInput } from "aws-sdk/clients/sns";
import Reminder from "../types/reminder.model";

var sns = new AWS.SNS({
  region: process.env.AWS_REGION,
});

export const handler = async (event: SQSEvent, context: Context) => {
  for (const record of event.Records) {
    const reminder = JSON.parse(record.body) as Reminder;

    const smsInput: PublishInput = {
      Message: reminder.message,
      PhoneNumber: reminder.phoneNumber,
      TopicArn: process.env.TARGET_TOPIC_ARN,
    };

    sns.publish(smsInput);
  }
};