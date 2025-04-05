
// This is a simplified dataset of major US cities
// In a production app, you'd want a more comprehensive dataset or API
export type CityData = {
  city: string;
  state: string;
  display: string;
};

export const cities: CityData[] = [
  { city: "New York", state: "NY", display: "New York, NY" },
  { city: "Los Angeles", state: "CA", display: "Los Angeles, CA" },
  { city: "Chicago", state: "IL", display: "Chicago, IL" },
  { city: "Houston", state: "TX", display: "Houston, TX" },
  { city: "Phoenix", state: "AZ", display: "Phoenix, AZ" },
  { city: "Philadelphia", state: "PA", display: "Philadelphia, PA" },
  { city: "San Antonio", state: "TX", display: "San Antonio, TX" },
  { city: "San Diego", state: "CA", display: "San Diego, CA" },
  { city: "Dallas", state: "TX", display: "Dallas, TX" },
  { city: "San Jose", state: "CA", display: "San Jose, CA" },
  { city: "Austin", state: "TX", display: "Austin, TX" },
  { city: "Jacksonville", state: "FL", display: "Jacksonville, FL" },
  { city: "Fort Worth", state: "TX", display: "Fort Worth, TX" },
  { city: "Columbus", state: "OH", display: "Columbus, OH" },
  { city: "Charlotte", state: "NC", display: "Charlotte, NC" },
  { city: "San Francisco", state: "CA", display: "San Francisco, CA" },
  { city: "Indianapolis", state: "IN", display: "Indianapolis, IN" },
  { city: "Seattle", state: "WA", display: "Seattle, WA" },
  { city: "Denver", state: "CO", display: "Denver, CO" },
  { city: "Washington", state: "DC", display: "Washington, DC" },
  { city: "Boston", state: "MA", display: "Boston, MA" },
  { city: "El Paso", state: "TX", display: "El Paso, TX" },
  { city: "Nashville", state: "TN", display: "Nashville, TN" },
  { city: "Detroit", state: "MI", display: "Detroit, MI" },
  { city: "Portland", state: "OR", display: "Portland, OR" },
  { city: "Las Vegas", state: "NV", display: "Las Vegas, NV" },
  { city: "Oklahoma City", state: "OK", display: "Oklahoma City, OK" },
  { city: "Memphis", state: "TN", display: "Memphis, TN" },
  { city: "Louisville", state: "KY", display: "Louisville, KY" },
  { city: "Baltimore", state: "MD", display: "Baltimore, MD" },
  { city: "Milwaukee", state: "WI", display: "Milwaukee, WI" },
  { city: "Albuquerque", state: "NM", display: "Albuquerque, NM" },
  { city: "Tucson", state: "AZ", display: "Tucson, AZ" },
  { city: "Fresno", state: "CA", display: "Fresno, CA" },
  { city: "Sacramento", state: "CA", display: "Sacramento, CA" },
  { city: "Atlanta", state: "GA", display: "Atlanta, GA" },
  { city: "Miami", state: "FL", display: "Miami, FL" },
  { city: "Oakland", state: "CA", display: "Oakland, CA" },
  { city: "Minneapolis", state: "MN", display: "Minneapolis, MN" },
  { city: "Cleveland", state: "OH", display: "Cleveland, OH" },
];

export const filterCities = (query: string): CityData[] => {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return cities.filter((city) => 
    city.display.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 5); // Limit to 5 suggestions for better UX
};
