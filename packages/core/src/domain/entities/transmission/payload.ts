export interface SendTransmissionPayload<M extends string> {
  url: string;
  method: M;
  payload: Record<string, string>;
}
