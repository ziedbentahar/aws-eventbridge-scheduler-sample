import { APIGatewayProxyEvent, Context } from "aws-lambda";
import AWS from "aws-sdk";
import { randomUUID } from "crypto";
import Reminder from "../types/reminder.model";

var scheduler = new AWS.Scheduler({
  region: process.env.AWS_REGION,
});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  const request = JSON.parse(event.body!) as Reminder;

  const target: AWS.Scheduler.Target = {
    RoleArn: process.env.REMINDER_TARGET_ROLE_ARN!,
    Arn: process.env.REMINDER_TARGET_ARN!,
    Input: JSON.stringify(request!),
  };

  const schedulerInput: AWS.Scheduler.CreateScheduleInput = {
    Name: randomUUID(),
    FlexibleTimeWindow: {
      Mode: "OFF",
    },
    Target: target,
    ScheduleExpression: mapRequestToScheduledExpression(request),
    GroupName: process.env.APPLICATION_NAME!,
    ClientToken: randomUUID(),
  };

  const result = await scheduler.createSchedule(schedulerInput).promise();

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Reminder created correctly",
    }),
  };

  return response;
};

function mapRequestToScheduledExpression(request: Reminder): string {
  return `at(${request.atTime})`;
}
