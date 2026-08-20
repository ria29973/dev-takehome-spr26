/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring
import mockItemRequests from "@/app/api/request/mock/data";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { InvalidInputError } from "@/lib/errors/inputExceptions";
import {
  MockEditStatusRequest,
  MockItemRequest,
} from "@/lib/types/mock/request";
import { RequestStatus } from "@/lib/types/request";
import {
  generateMockId,
  sortMockItemRequests,
} from "@/lib/utils/mock/requests";
import paginate from "@/lib/utils/pagination";
import {
  isValidMockStatus,
  validateMockCreateItemRequest,
  validateMockEditStatusRequest,
} from "@/lib/validation/mock/requests";

export function getMockItemRequests(
  status: string | null,
  page: number
): MockItemRequest[] {
  const sortedRequests = sortMockItemRequests(mockItemRequests);
  let filteredRequests = sortedRequests;
  if (status && isValidMockStatus(status)) {
    filteredRequests = filteredRequests.filter((req) => req.status === status);
  }
  const paginatedRequests = paginate(
    filteredRequests,
    page,
    PAGINATION_PAGE_SIZE
  ).data;
  return paginatedRequests;
}

export function createNewMockRequest(request: any): MockItemRequest {
  const validatedRequest = validateMockCreateItemRequest(request);
  if (!validatedRequest) {
    throw new InvalidInputError("created item request");
  }
  const date = new Date();
  const newRequest: MockItemRequest = {
    id: generateMockId(mockItemRequests),
    requestorName: validatedRequest.requestorName,
    itemRequested: validatedRequest.itemRequested,
    requestCreatedDate: date,
    lastEditedDate: date,
    status: RequestStatus.PENDING,
  };
  mockItemRequests.push(newRequest);
  return newRequest;
}

export function editMockStatusRequest(request: any): MockEditStatusRequest {
  const validatedRequest = validateMockEditStatusRequest(request);
  if (!validatedRequest) {
    throw new InvalidInputError("edit item request");
  }
  const editedItemRequest = mockItemRequests.find(
    (req) => req.id === validatedRequest.id
  );
  if (!editedItemRequest) {
    throw new InvalidInputError("edit item ID");
  }
  editedItemRequest.status = validatedRequest.status;
  editedItemRequest.lastEditedDate = new Date();
  return editedItemRequest;
}
