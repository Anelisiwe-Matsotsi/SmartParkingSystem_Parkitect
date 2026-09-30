const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getBayFromBeacon(nodeKey: string) {
  const response = await fetch(
    `${API_URL}/api/Parking/beacon/${encodeURIComponent(nodeKey)}`
  );

  if (!response.ok) {
    throw new Error("Could not find parking bay for this beacon.");
  }

  return await response.json();
}

export async function parkVehicle(
  firebaseUid: string,
  bayID: number
) {
  const response = await fetch(`${API_URL}/api/Parking/park`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firebaseUid,
      bayID,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Could not save parking session.");
  }

  return await response.json();
}