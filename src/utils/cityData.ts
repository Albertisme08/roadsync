
// This is a comprehensive dataset of major US cities including those within 100 miles of common cities
// In a production app, you'd want a more comprehensive dataset or API
export type CityData = {
  city: string;
  state: string;
  display: string;
};

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
  { city: "Tulsa", state: "OK", display: "Tulsa, OK" }
];

export const filterCities = (query: string): CityData[] => {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return cities.filter((city) => 
    city.display.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 7); // Increased from 5 to 7 suggestions for better coverage
};
