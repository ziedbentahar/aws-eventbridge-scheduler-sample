import { Context, SQSEvent } from "aws-lambda";
import { sendSms } from "../shared/smsSender";
import { IdentifiableEntity } from "../types/Identifiable-entity.model";
import { Reminder } from "../types/reminder.model";

export const handler = async (event: SQSEvent, context: Context) => {
  for (const record of event.Records) {
    const { id, entity } = JSON.parse(record.body) as IdentifiableEntity<
      string,
      Reminder
    >;

    const result = await sendSms({
      message: entity.message,
      phoneNumber: entity.phoneNumber,
      senderId: process.env.SMS_SENDER_ID!,
    });

    if (result.status === "Error") {
      throw new Error("error occured when sending sms");
    }
  }
};
