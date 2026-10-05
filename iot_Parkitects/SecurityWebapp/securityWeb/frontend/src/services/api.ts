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

export type WebSettings = {
  darkMode: boolean;
  compactTables: boolean;
  largerText: boolean;
  reducedMotion: boolean;
  ticketUpdates: boolean;
  parkingAlerts: boolean;
  systemAlerts: boolean;
  alertSound: boolean;
};

export const defaultWebSettings: WebSettings = {
  darkMode: false,
  compactTables: false,
  largerText: false,
  reducedMotion: false,
  ticketUpdates: true,
  parkingAlerts: true,
  systemAlerts: true,
  alertSound: true,
};

// GET the saved web settings for a firebase uid
export async function getWebSettings(uid: string): Promise<WebSettings> {
  const response = await fetch(`${API_URL}/Settings/web/${encodeURIComponent(uid)}`);

  if (!response.ok) {
    throw new Error(`Failed to load settings (${response.status}).`);
  }

  const data = await response.json();
  return { ...defaultWebSettings, ...data };
}

export async function saveWebSettings(uid: string, settings: WebSettings): Promise<WebSettings> {
  const response = await fetch(`${API_URL}/Settings/web/${encodeURIComponent(uid)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...settings, userID: uid }),
  });

  if (!response.ok) {
    const detail = (await response.text()).trim();
    throw new Error(detail || `Settings save failed (${response.status}).`);
  }

  const data = await response.json();
  return { ...defaultWebSettings, ...data };
}

export async function syncUserProfile(uid: string, name: string, email: string): Promise<void> {
  const response = await fetch(`${API_URL}/User/profile/${encodeURIComponent(uid)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Profile sync failed (${response.status}).`);
  }
}

export type SystemStatus = {
  online: boolean;
  totalBays: number;
  baysWithSensors: number;
};

// Reads the live parking map so the System tab shows real sensor status
export async function getSystemStatus(): Promise<SystemStatus> {
  try {
    const response = await fetch(`${API_URL}/Parking/map`);
    if (!response.ok) return { online: false, totalBays: 0, baysWithSensors: 0 };

    const map = await response.json();
    const sections: { bays?: { hasPhysicalSensor?: boolean }[] }[] = map.sections ?? [];
    const bays = sections.flatMap((section) => section.bays ?? []);

    return {
      online: true,
      totalBays: bays.length,
      baysWithSensors: bays.filter((bay) => bay.hasPhysicalSensor).length,
    };
  } catch {
    return { online: false, totalBays: 0, baysWithSensors: 0 };
  }
}

export type ParkingHistoryRow = {
  bay?: string;
  user?: string;
  userType?: string;
  timeIn?: string;
  timeOut?: string;
  duration?: string;
  status?: string;
};

export async function getParkingHistory(): Promise<ParkingHistoryRow[]> {
  const response = await fetch(`${API_URL}/Analytics/history`);

  if (!response.ok) {
    throw new Error("Failed to fetch parking history");
  }

  return response.json();
}

export type AppNotification = {
  notificationID: number;
  notificationType: string;
  title: string;
  description: string;
  time: string;
};

export async function getNotifications(): Promise<AppNotification[]> {
  const response = await fetch(`${API_URL}/Notification`);

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
}

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
