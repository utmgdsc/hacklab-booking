interface ModelResponseBase {
    status: number;
}

export interface ModelResponseSuccess<T> extends ModelResponseBase {
    data: NonNullable<T>;
}

export interface ModelResponseError extends ModelResponseBase {
    message: string;
}
type ModelResponse<T> = ModelResponseSuccess<T> | ModelResponseError;
export default ModelResponse;
