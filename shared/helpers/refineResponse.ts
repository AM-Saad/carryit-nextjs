import Response,{Status} from "shared/models/Response";

export const refineResponse = (status:Status , message: string, items?: any): Response => {
    return {
      status,
      message,
      items,
    };
  };