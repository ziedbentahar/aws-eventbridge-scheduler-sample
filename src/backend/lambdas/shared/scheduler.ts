import AWS from "aws-sdk";
import { randomUUID } from "crypto";
import { IdentifiableEntity } from "../types/Identifiable-entity.model";
import { OperationResult } from "../types/operation-result";
import { Reminder } from "../types/reminder.model";

const scheduler = new AWS.Scheduler({
  region: process.env.AWS_REGION,
});

const scheduleReminder = async (
  identifiableReminder: IdentifiableEntity<string, Reminder>
): Promise<OperationResult> => {
  const target: AWS.Scheduler.Target = {
    RoleArn: process.env.REMINDER_TARGET_ROLE_ARN!,
    Arn: process.env.REMINDER_TARGET_ARN!,
    Input: JSON.stringify(identifiableReminder),
  };

  const schedulerInput: AWS.Scheduler.CreateScheduleInput = {
    Name: identifiableReminder.id,
    FlexibleTimeWindow: {
      Mode: "OFF",
    },
    Target: target,
    ScheduleExpression: `at(${identifiableReminder.entity.atTime})`,
    GroupName: process.env.REMINDER_SCHEDULER_GROUP_NAME!,
    ClientToken: randomUUID(),
  };

  const result = await scheduler.createSchedule(schedulerInput).promise();

  if (result.$response.httpResponse.statusCode == 200) {
    return { status: "Success" };
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

const deleteScheduledReminder = async (id: string) => {
  const schedulerInput: AWS.Scheduler.DeleteScheduleInput = {
    Name: id,
  };

  await scheduler.deleteSchedule(schedulerInput);
};

export { scheduleReminder, deleteScheduledReminder };
