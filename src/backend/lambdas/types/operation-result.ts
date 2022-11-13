export type OperationResult =
  | { status: "Success" }
  | { status: "Error"; details: any };
