import { ResponseType } from "@/lib/types/apiResponse";

import { createItemRequest, getItemRequests, updateItemStatus } from "@/server/requestService";
import { ServerResponseBuilder } from "@/lib/builders/serverResponseBuilder";
import { InputException, InvalidInputError, InvalidPaginationError } from "@/lib/errors/inputExceptions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || undefined;
  const page = parseInt(url.searchParams.get("page") || "1");
  
  try {
    if (page < 1) {
      throw new InvalidPaginationError(page, 10);
    }
    if (status && !["pending", "completed", "approved", "rejected"].includes(status)) {
      throw new InvalidInputError("status");
    }
    const requests = await getItemRequests(page, status);
    return new Response(JSON.stringify(requests), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PUT(request: Request) {
  try {
    const req = await request.json();
    if (!req.requestorName || !req.itemRequested) {
      throw new InvalidInputError("requestor name or item requested");
    }
    if (req.requestorName.length < 3 || req.requestorName.length > 30 || req.itemRequested.length < 2 || req.itemRequested.length > 100) {
      throw new InvalidInputError("invalid length of parameters");
    }
    const newRequest = await createItemRequest({
      requestorName: req.requestorName, 
      itemRequested: req.itemRequested,
    });
    return new Response(JSON.stringify(newRequest), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PATCH(request: Request) {
  try {
    const req = await request.json();
    if (!(req.id && req.status)) {
      throw new InvalidInputError("id or status");
    }
    const updated = await updateItemStatus(req);
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}
