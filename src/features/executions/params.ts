import { parseAsInteger } from "nuqs/server";
import { PAGINATION } from "@/config/constants";

// /executions?page=1&pageSize=10&search=foo
export const executionsParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),
}
