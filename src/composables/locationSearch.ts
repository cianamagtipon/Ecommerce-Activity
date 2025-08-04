import { luzonLocations } from '@/assets/data/luzonLocations'

export function useLocationSearch() {
  // search for a city based on the full or partial ZIP code
  function findCityByZipPrefix(
    zipCode: string,
  ): { province: string; city: string } | null {
    for (const [province, cities] of Object.entries(luzonLocations)) {
      for (const cityEntry of cities) {
        if (
          cityEntry.zipPrefixes.some((prefix) => zipCode.startsWith(prefix))
        ) {
          return { province, city: cityEntry.city }
        }
      }
    }
    return null
  }

  // search for a city by its name (case-insensitive)
  function searchCityByName(
    name: string,
  ): { province: string; city: string } | null {
    const lower = name.toLowerCase()
    for (const [province, cities] of Object.entries(luzonLocations)) {
      for (const cityEntry of cities) {
        if (cityEntry.city.toLowerCase() === lower) {
          return { province, city: cityEntry.city }
        }
      }
    }
    return null
  }

  // get all cities under a given province
  function getCitiesByProvince(province: string): string[] {
    return luzonLocations[province]?.map((entry) => entry.city) ?? []
  }

  // get all provinces
  function getAllProvinces(): string[] {
    return Object.keys(luzonLocations)
  }

  function getPostalCodeSuggestions(
    query: string,
    filters?: { province?: string; city?: string },
  ): { value: string; label: string }[] {
    const results: { value: string; label: string }[] = []
    const trimmed = query.trim().toLowerCase()

    for (const [province, cities] of Object.entries(luzonLocations)) {
      if (filters?.province && filters.province !== province) continue

      for (const cityEntry of cities) {
        if (
          filters?.city &&
          cityEntry.city.toLowerCase() !== filters.city.toLowerCase()
        )
          continue

        for (const prefix of cityEntry.zipPrefixes) {
          if (prefix.length === 4 && prefix.startsWith(trimmed)) {
            results.push({
              value: prefix,
              label: `${prefix} - ${cityEntry.city}, ${province}`,
            })
          }
        }
      }
    }

    return results
  }

  return {
    findCityByZipPrefix,
    searchCityByName,
    getCitiesByProvince,
    getAllProvinces,
    getPostalCodeSuggestions,
  }
}
