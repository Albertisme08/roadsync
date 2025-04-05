// This is a comprehensive dataset of US cities
// In a production app, you'd want to use an API for more comprehensive and updated data
export type CityData = {
  city: string;
  state: string;
  display: string;
};

// Expanded list of cities
export const cities: CityData[] = [
  // Original cities
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
  
  // Cities near New York
  { city: "Trenton", state: "NJ", display: "Trenton, NJ" },
  { city: "New Haven", state: "CT", display: "New Haven, CT" },
  { city: "Stamford", state: "CT", display: "Stamford, CT" },
  { city: "Newark", state: "NJ", display: "Newark, NJ" },
  { city: "Jersey City", state: "NJ", display: "Jersey City, NJ" },
  
  // Cities near Los Angeles
  { city: "Santa Barbara", state: "CA", display: "Santa Barbara, CA" },
  { city: "Riverside", state: "CA", display: "Riverside, CA" },
  { city: "Anaheim", state: "CA", display: "Anaheim, CA" },
  { city: "Long Beach", state: "CA", display: "Long Beach, CA" },
  { city: "Santa Ana", state: "CA", display: "Santa Ana, CA" },
  
  // Cities near Chicago
  { city: "Milwaukee", state: "WI", display: "Milwaukee, WI" },
  { city: "Rockford", state: "IL", display: "Rockford, IL" },
  { city: "South Bend", state: "IN", display: "South Bend, IN" },
  { city: "Kenosha", state: "WI", display: "Kenosha, WI" },
  { city: "Gary", state: "IN", display: "Gary, IN" },
  
  // Cities near Houston
  { city: "Galveston", state: "TX", display: "Galveston, TX" },
  { city: "Beaumont", state: "TX", display: "Beaumont, TX" },
  { city: "Sugar Land", state: "TX", display: "Sugar Land, TX" },
  { city: "The Woodlands", state: "TX", display: "The Woodlands, TX" },
  { city: "Pasadena", state: "TX", display: "Pasadena, TX" },
  
  // Cities near Boston
  { city: "Providence", state: "RI", display: "Providence, RI" },
  { city: "Worcester", state: "MA", display: "Worcester, MA" },
  { city: "Manchester", state: "NH", display: "Manchester, NH" },
  { city: "Lowell", state: "MA", display: "Lowell, MA" },
  { city: "Quincy", state: "MA", display: "Quincy, MA" },
  
  // Cities near San Francisco
  { city: "San Jose", state: "CA", display: "San Jose, CA" },
  { city: "Sacramento", state: "CA", display: "Sacramento, CA" },
  { city: "Santa Rosa", state: "CA", display: "Santa Rosa, CA" },
  { city: "Concord", state: "CA", display: "Concord, CA" },
  { city: "Santa Cruz", state: "CA", display: "Santa Cruz, CA" },
  
  // Cities near Washington DC
  { city: "Baltimore", state: "MD", display: "Baltimore, MD" },
  { city: "Annapolis", state: "MD", display: "Annapolis, MD" },
  { city: "Richmond", state: "VA", display: "Richmond, VA" },
  { city: "Arlington", state: "VA", display: "Arlington, VA" },
  { city: "Alexandria", state: "VA", display: "Alexandria, VA" },
  
  // Cities near Atlanta
  { city: "Athens", state: "GA", display: "Athens, GA" },
  { city: "Macon", state: "GA", display: "Macon, GA" },
  { city: "Marietta", state: "GA", display: "Marietta, GA" },
  { city: "Decatur", state: "GA", display: "Decatur, GA" },
  { city: "Roswell", state: "GA", display: "Roswell, GA" },
  
  // Cities near Dallas
  { city: "Fort Worth", state: "TX", display: "Fort Worth, TX" },
  { city: "Denton", state: "TX", display: "Denton, TX" },
  { city: "Waco", state: "TX", display: "Waco, TX" },
  { city: "Plano", state: "TX", display: "Plano, TX" },
  { city: "Arlington", state: "TX", display: "Arlington, TX" },
  
  // Additional major cities within 100 miles of other common cities
  { city: "St. Paul", state: "MN", display: "St. Paul, MN" },
  { city: "St. Petersburg", state: "FL", display: "St. Petersburg, FL" },
  { city: "Tampa", state: "FL", display: "Tampa, FL" },
  { city: "Cincinnati", state: "OH", display: "Cincinnati, OH" },
  { city: "St. Louis", state: "MO", display: "St. Louis, MO" },
  { city: "Pittsburgh", state: "PA", display: "Pittsburgh, PA" },
  { city: "Kansas City", state: "MO", display: "Kansas City, MO" },
  { city: "Virginia Beach", state: "VA", display: "Virginia Beach, VA" },
  { city: "Raleigh", state: "NC", display: "Raleigh, NC" },
  { city: "Omaha", state: "NE", display: "Omaha, NE" },
  { city: "Aurora", state: "CO", display: "Aurora, CO" },
  { city: "Lexington", state: "KY", display: "Lexington, KY" },
  { city: "Tulsa", state: "OK", display: "Tulsa, OK" },

  // Additional major cities 
  { city: "Fontana", state: "CA", display: "Fontana, CA" },
  { city: "Irvine", state: "CA", display: "Irvine, CA" },
  { city: "Modesto", state: "CA", display: "Modesto, CA" },
  { city: "Bakersfield", state: "CA", display: "Bakersfield, CA" },
  { city: "San Bernardino", state: "CA", display: "San Bernardino, CA" },
  { city: "Stockton", state: "CA", display: "Stockton, CA" },
  { city: "Fremont", state: "CA", display: "Fremont, CA" },
  { city: "Glendale", state: "CA", display: "Glendale, CA" },
  { city: "Santa Clarita", state: "CA", display: "Santa Clarita, CA" },
  { city: "Huntington Beach", state: "CA", display: "Huntington Beach, CA" },
  { city: "Moreno Valley", state: "CA", display: "Moreno Valley, CA" },
  { city: "Aurora", state: "IL", display: "Aurora, IL" },
  { city: "Naperville", state: "IL", display: "Naperville, IL" },
  { city: "Joliet", state: "IL", display: "Joliet, IL" },
  { city: "Springfield", state: "IL", display: "Springfield, IL" },
  { city: "Peoria", state: "IL", display: "Peoria, IL" },
  { city: "Elgin", state: "IL", display: "Elgin, IL" },
  { city: "Arlington Heights", state: "IL", display: "Arlington Heights, IL" },
  { city: "Evanston", state: "IL", display: "Evanston, IL" },
  { city: "Schaumburg", state: "IL", display: "Schaumburg, IL" },
  { city: "Buffalo", state: "NY", display: "Buffalo, NY" },
  { city: "Rochester", state: "NY", display: "Rochester, NY" },
  { city: "Yonkers", state: "NY", display: "Yonkers, NY" },
  { city: "Syracuse", state: "NY", display: "Syracuse, NY" },
  { city: "Albany", state: "NY", display: "Albany, NY" },
  { city: "New Rochelle", state: "NY", display: "New Rochelle, NY" },
  { city: "Mount Vernon", state: "NY", display: "Mount Vernon, NY" },
  { city: "Schenectady", state: "NY", display: "Schenectady, NY" },
  { city: "Utica", state: "NY", display: "Utica, NY" },
  { city: "Baton Rouge", state: "LA", display: "Baton Rouge, LA" },
  { city: "New Orleans", state: "LA", display: "New Orleans, LA" },
  { city: "Shreveport", state: "LA", display: "Shreveport, LA" },
  { city: "Lafayette", state: "LA", display: "Lafayette, LA" },
  { city: "Lake Charles", state: "LA", display: "Lake Charles, LA" },
  { city: "Kenner", state: "LA", display: "Kenner, LA" },
  { city: "Bossier City", state: "LA", display: "Bossier City, LA" },
  { city: "Monroe", state: "LA", display: "Monroe, LA" },
  { city: "Alexandria", state: "LA", display: "Alexandria, LA" },
  { city: "Fort Lauderdale", state: "FL", display: "Fort Lauderdale, FL" },
  { city: "Orlando", state: "FL", display: "Orlando, FL" },
  { city: "Tallahassee", state: "FL", display: "Tallahassee, FL" },
  { city: "Gainesville", state: "FL", display: "Gainesville, FL" },
  { city: "Clearwater", state: "FL", display: "Clearwater, FL" },
  { city: "Palm Bay", state: "FL", display: "Palm Bay, FL" },
  { city: "Coral Springs", state: "FL", display: "Coral Springs, FL" },
  { city: "Cape Coral", state: "FL", display: "Cape Coral, FL" },
  { city: "Pembroke Pines", state: "FL", display: "Pembroke Pines, FL" },
  { city: "Hollywood", state: "FL", display: "Hollywood, FL" },
  { city: "Miramar", state: "FL", display: "Miramar, FL" },
  { city: "Gainesville", state: "FL", display: "Gainesville, FL" },
  { city: "Newark", state: "NJ", display: "Newark, NJ" },
  { city: "Jersey City", state: "NJ", display: "Jersey City, NJ" },
  { city: "Paterson", state: "NJ", display: "Paterson, NJ" },
  { city: "Elizabeth", state: "NJ", display: "Elizabeth, NJ" },
  { city: "Edison", state: "NJ", display: "Edison, NJ" },
  { city: "Woodbridge", state: "NJ", display: "Woodbridge, NJ" },
  { city: "Lakewood", state: "NJ", display: "Lakewood, NJ" },
  { city: "Toms River", state: "NJ", display: "Toms River, NJ" },
  { city: "Hamilton Township", state: "NJ", display: "Hamilton Township, NJ" },
  { city: "Clifton", state: "NJ", display: "Clifton, NJ" },
  { city: "Trenton", state: "NJ", display: "Trenton, NJ" },
  { city: "Camden", state: "NJ", display: "Camden, NJ" },
  { city: "Arlington", state: "TX", display: "Arlington, TX" },
  { city: "Plano", state: "TX", display: "Plano, TX" },
  { city: "Corpus Christi", state: "TX", display: "Corpus Christi, TX" },
  { city: "Laredo", state: "TX", display: "Laredo, TX" },
  { city: "Lubbock", state: "TX", display: "Lubbock, TX" },
  { city: "Garland", state: "TX", display: "Garland, TX" },
  { city: "Irving", state: "TX", display: "Irving, TX" },
  { city: "Amarillo", state: "TX", display: "Amarillo, TX" },
  { city: "Grand Prairie", state: "TX", display: "Grand Prairie, TX" },
  { city: "Brownsville", state: "TX", display: "Brownsville, TX" },
  { city: "McKinney", state: "TX", display: "McKinney, TX" },
  { city: "Frisco", state: "TX", display: "Frisco, TX" },
  { city: "Mesquite", state: "TX", display: "Mesquite, TX" },
  { city: "McAllen", state: "TX", display: "McAllen, TX" },
  { city: "Killeen", state: "TX", display: "Killeen, TX" }
];

export const filterCities = (query: string): CityData[] => {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  // First try to find exact match at beginning of city name or state
  const exactMatches = cities.filter((city) => 
    city.display.toLowerCase().startsWith(lowercaseQuery) ||
    city.city.toLowerCase().startsWith(lowercaseQuery)
  );
  
  // If we have enough exact matches, return those first
  if (exactMatches.length >= 10) {
    return exactMatches.slice(0, 10);
  }
  
  // Otherwise, include partial matches
  const partialMatches = cities.filter((city) => 
    !exactMatches.includes(city) && 
    city.display.toLowerCase().includes(lowercaseQuery)
  );
  
  // Combine matches (exact matches first)
  return [...exactMatches, ...partialMatches].slice(0, 10);
};
