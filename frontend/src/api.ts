const API_BASE_URL = "/api"

function getToken() {
  return localStorage.getItem("token")
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
  if (!res.ok) {
    throw new Error(await res.text())
  }
  return res.json()
}
