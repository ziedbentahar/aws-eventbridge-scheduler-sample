import { Context, SQSEvent } from "aws-lambda";
import { deleteScheduledReminder } from "../shared/scheduler";
import { sendSms } from "../shared/smsSender";
import { IdentifiableEntity } from "../types/Identifiable-entity.model";
import { Reminder } from "../types/reminder.model";

export const handler = async (event: SQSEvent, context: Context) => {
  for (const record of event.Records) {
    const { id, entity } = JSON.parse(record.body) as IdentifiableEntity<
      string,
      Reminder
    >;

    const result = await sendSms(entity);

    if (result.status == "Error") {
      throw new Error("error occured when sending sms");
    } else {
      await deleteScheduledReminder(id);
    }
  }
};
