export interface Ticket {
    ticketID: number;
    userID: string;
    bayID: string;
    bayNumber: string;
    sectionID: string;
    reason: string;
    description: string | null;
    imageURL: string | null;
    status: string;
    createdAt: string;
    updatedAt: string | null;
    response: string | null;
}