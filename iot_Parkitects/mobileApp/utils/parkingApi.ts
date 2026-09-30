const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getBayFromBeacon(nodeKey: string) {
  const url = `${API_URL}/api/Parking/beacon/${encodeURIComponent(nodeKey)}`;
  console.log("[API] GET", url);

  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.text();
    console.log("[API] failed:", response.status, body);
    throw new Error(body || `Request failed (${response.status})`);
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