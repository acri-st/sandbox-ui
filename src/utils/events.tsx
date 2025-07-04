import { IEvent } from "@desp-aas/desp-ui-fwk/src/utils/types";
import dayjs from "dayjs"

export const sortEvents = (a:IEvent, b: IEvent)=> dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1;

