import requestModel  from "./models/requestModel"
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { InvalidInputError} from "@/lib/errors/inputExceptions";
import { CreateItemRequest, UpdateStatusInput, ItemRequest } from "@/lib/types/requestInterfaces";



export async function createItemRequest(data: CreateItemRequest): Promise<ItemRequest> {
    const newRequest = new requestModel({
        requestorName: data.requestorName,
        itemRequested: data.itemRequested,
        createdDate: new Date(), 
        lastEdited: new Date(), 
        status: "pending",
    });
    
    await newRequest.save();
    return newRequest.toObject();
    
}

export async function getItemRequests(page: number = 1, status?: string) {
    const filter = status ? { status: status as "pending" | "completed" | "approved" | "rejected" } : {};
    const skip = (page - 1) * PAGINATION_PAGE_SIZE; 
    const total = await requestModel.countDocuments(filter); 
    const requests = await requestModel.find(filter)
    .sort({ createdDate: -1 }) 
    .skip(skip)
    .limit(PAGINATION_PAGE_SIZE); 
    
    return {
        data: requests, 
        page, 
        pageSize: PAGINATION_PAGE_SIZE, 
        total, 
        totalPages: Math.ceil(total / PAGINATION_PAGE_SIZE),
    };
}

export async function updateItemStatus(data: UpdateStatusInput): Promise<ItemRequest> {
  
    const result = await requestModel.findByIdAndUpdate(
        data.id, 
        {
            status: data.status,
            lastEdited: new Date(),
        },
        {new: true}
    );
    if (!result) {
        throw new InvalidInputError("id");
    }
    return result;

}

