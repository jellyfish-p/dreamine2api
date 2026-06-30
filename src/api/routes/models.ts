import Request from "@/lib/request/Request.ts";
import { listModels } from "@/api/controllers/models.ts";

export default {
  prefix: "/v1",

  get: {
    "/models": async (request: Request) => {
      return listModels();
    },
  },
};