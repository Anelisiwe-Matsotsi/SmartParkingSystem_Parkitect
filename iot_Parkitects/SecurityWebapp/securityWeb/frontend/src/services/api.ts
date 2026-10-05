import type { Ticket } from "../models/ticket";

const API_URL = import.meta.env.VITE_API_URL;

//gets the users name through firebase ID
export async function getUserByFirebaseUid(firebaseUid: string): Promise<{name: string}> {
  const response = await fetch(`${API_URL}/User/profile/${firebaseUid}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

// GET ALL tickets
export async function getTickets(): Promise<Ticket[]> {
  const response = await fetch(`${API_URL}/Tickets`);

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return response.json();
}

// GET ONE ticket
export async function getTicket(id: number): Promise<Ticket> {
  const response = await fetch(`${API_URL}/Tickets/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch ticket");
  }

  return response.json();
}

// CREATE a ticket
export async function createTicket(ticket: Ticket): Promise<Ticket> {
  const response = await fetch(`${API_URL}/Tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  });

  if (!response.ok) {
    throw new Error("Failed to create ticket");
  }

  return response.json();
}

// UPDATE a ticket
export async function updateTicket(
  ticket: Ticket,
  id: number
): Promise<void> {
  const response = await fetch(`${API_URL}/Tickets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  });

  if (!response.ok) {
    throw new Error("Failed to update ticket");
  }
}

// DELETE a ticket
export async function deleteTicket(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/Tickets/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete ticket");
  }
}

//UPLOAD an image 
export async function uploadTicketImage(
  file: File
): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_URL}/Tickets/upload-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload ticket image");
  }

  const data = await response.json();

  return data.imageUrl;
}

export async function getOccupiedBays(): Promise<{ bayID: number; bayNumber: string }[]> {
  const response = await fetch(`${API_URL}/Parking/occupied`);
  if (!response.ok) throw new Error("Failed to fetch occupied bays");
  return response.json();

}
//(TypeScript, 2026)
  //Parking map
  export interface BayMap {
    bayID: number;
    bayNumber: string;
    isOccupied: boolean;
    hasPhysicalSensor: boolean;
    distanceReadingCm: number | null;
  }

  export interface SectionMap {
    sectionID: number;
    sectionName: string;
    totalBays: number;
    availableBays: number;
    bays: BayMap[];
  }

  export interface ParkingMap {
    totalBays: number;
    availableBays: number;
    occupiedBays: number;
    sections: SectionMap[];
  }

  export interface BayDetails {
  bayID: number;
  bayNumber: string;
  sectionName: string;
  isOccupied: boolean;
  hasPhysicalSensor: boolean;
  distanceReadingCm: number | null;
  occupantName: string | null;
  occupantNumber: string | null;
  parkedSince: string | null;
}

// GET the whole campus map: sections, bays and totals
export async function getParkingMap(): Promise<ParkingMap> {
  const response = await fetch(`${API_URL}/Parking/map`);
  if (!response.ok) throw new Error("Failed to fetch parking map");
  return response.json();
}

// GET details and current occupant for one bay, for example: A1
export async function getBayDetails(bayNumber: string): Promise<BayDetails> {
  const response = await fetch(
    `${API_URL}/Parking/bay/${encodeURIComponent(bayNumber)}`
  );
  if (!response.ok) throw new Error("Failed to fetch bay details");
  return response.json();
}

/**Reference List:
 * TypeScript. 2026. Object Types. (Version 2.0) [Source Code] Available at:<https://www.typescriptlang.org/docs/handbook/2/objects.html> [Accessed 3 October 2026].
 * 
 */