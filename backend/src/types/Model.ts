import ModelResponse from './ModelResponse';

type Model = { [key: string]: (...args: any[]) => Promise<ModelResponse<object>> };
export default Model;
