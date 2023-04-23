import Response,{Status} from "@/shared/modals/Response";

export const refineResponse = (status:Status , message: string, items?: any): Response => {
    return {
      status,
      message,
      items,
    };
  };