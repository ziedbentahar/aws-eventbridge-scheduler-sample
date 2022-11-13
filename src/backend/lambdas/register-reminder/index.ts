import { APIGatewayProxyEvent } from "aws-lambda";
import { randomUUID } from "crypto";
import { scheduleReminder } from "../shared/scheduler";
import { IdentifiableEntity } from "../types/Identifiable-entity.model";
import { Reminder } from "../types/reminder.model";

export const handler = async (event: APIGatewayProxyEvent) => {
  const request = JSON.parse(event.body!) as Reminder;

  const identifiableReminder: IdentifiableEntity<string, Reminder> = {
    id: randomUUID(),
    entity: request,
  };

  const result = await scheduleReminder(identifiableReminder);

  if (result.status === "Error") {
    throw new Error("Error occured while scheduling the reminder");
  } else {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        reminderId: identifiableReminder.id,
        message: "Reminder created correctly",
      }),
    };

    return response;
  }
};
