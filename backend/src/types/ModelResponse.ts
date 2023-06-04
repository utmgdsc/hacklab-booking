interface ModelResponseBase {
  status: number;
}

interface ModelResponseSuccess<T> extends ModelResponseBase {
  data: NonNullable<T>;
}

interface ModelResponseError extends ModelResponseBase {
  message: string;
}
type ModelResponse<T> = ModelResponseSuccess<T> | ModelResponseError;
export default ModelResponse;