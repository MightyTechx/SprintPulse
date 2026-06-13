export interface LocationResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address?: {
    city?: string;
    suburb?: string;
    neighbourhood?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

// Geoapify — best coverage including small suburbs/localities (free key: geoapify.com)
async function fetchFromGeoapify(
  query: string,
  apiKey: string,
  signal?: AbortSignal,
): Promise<LocationResult[]> {
  const params = new URLSearchParams({
    text: query,
    apiKey,
    limit: '8',
    lang: 'en',
  });

  const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`, {
    signal,
  });
  if (!res.ok) throw new Error(`Geoapify ${res.status}`);

  const data = await res.json();
  return (data.results ?? []).map((r: any) => ({
    place_id: r.place_id ?? String(Math.random()),
    display_name: r.formatted ?? '',
    lat: String(r.lat ?? ''),
    lon: String(r.lon ?? ''),
    type: r.result_type ?? '',
    address: {
      city: r.city || r.county || undefined,
      suburb: r.suburb || undefined,
      neighbourhood: r.district || undefined,
      state: r.state || undefined,
      country: r.country || undefined,
      postcode: r.postcode || undefined,
    },
  }));
}

// Photon (Komoot) — free, no key, OpenStreetMap data, good global coverage
async function fetchFromPhoton(query: string, signal?: AbortSignal): Promise<LocationResult[]> {
  const params = new URLSearchParams({ q: query, limit: '8', lang: 'en' });

  const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`Photon ${res.status}`);

  const data = await res.json();
  return (data.features ?? []).map((f: any) => {
    const p = f.properties ?? {};
    const [lon, lat] = f.geometry?.coordinates ?? [0, 0];

    const parts: string[] = [];
    if (p.name) parts.push(p.name);
    if (p.city && p.city !== p.name) parts.push(p.city);
    if (p.state) parts.push(p.state);
    if (p.country) parts.push(p.country);

    return {
      place_id: String(p.osm_id ?? Math.random()),
      display_name: parts.join(', '),
      lat: String(lat),
      lon: String(lon),
      type: p.osm_value ?? p.type ?? '',
      address: {
        city: p.city || undefined,
        suburb: p.osm_value === 'suburb' ? p.name : p.suburb || undefined,
        neighbourhood: p.osm_value === 'neighbourhood' ? p.name : undefined,
        state: p.state || undefined,
        country: p.country || undefined,
        postcode: p.postcode || undefined,
      },
    };
  });
}

export async function fetchLocationSuggestions(
  query: string,
  signal?: AbortSignal,
): Promise<LocationResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const apiKey: string | undefined = import.meta.env?.VITE_GEOAPIFY_API_KEY;
  const hasKey = apiKey && apiKey !== 'your-geoapify-api-key-here';

  return hasKey ? fetchFromGeoapify(trimmed, apiKey!, signal) : fetchFromPhoton(trimmed, signal);
}
