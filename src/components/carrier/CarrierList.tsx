
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Truck, Weight, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import CarrierDetailModal from "./CarrierDetailModal";
import CreateAccountModal from "./CreateAccountModal";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

const CarrierList = () => {
  const [showRequestAccessModal, setShowRequestAccessModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [showCarrierModal, setShowCarrierModal] = useState(false);
  const [maxWeightFilter, setMaxWeightFilter] = useState(30000); // Default max weight filter
  const [equipmentFilter, setEquipmentFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);

  const carriers = [
    { 
      name: "Never Late Express Inc", 
      city: "Bakersfield, CA", 
      dot: "3522606", 
      equipment: "Refrigerated", 
      status: "Active",
      maxWeight: 24000,
      rating: 4.8,
      availability: "Available",
      contactPerson: "John Smith",
      contactPhone: "(555) 123-4567",
      address: "123 Carrier Ave, Bakersfield, CA 93301"
    },
    { 
      name: "Alias Trucking Company", 
      city: "Azusa, CA", 
      dot: "—", 
      equipment: "General Freight", 
      status: "Active",
      maxWeight: 28000,
      rating: 4.5,
      availability: "Available",
      contactPerson: "Maria Rodriguez",
      contactPhone: "(555) 234-5678",
      address: "456 Trucking Blvd, Azusa, CA 91702"
    },
    { 
      name: "Rivas Trucking LLC", 
      city: "Madera, CA", 
      dot: "1635351", 
      equipment: "General Freight", 
      status: "Active",
      maxWeight: 30000,
      rating: 4.2,
      availability: "Limited",
      contactPerson: "Carlos Rivas",
      contactPhone: "(555) 345-6789",
      address: "789 Freight St, Madera, CA 93637"
    },
    { 
      name: "FastTruck", 
      city: "Atlanta, GA", 
      dot: "1234567", 
      equipment: "General Freight", 
      status: "Active",
      maxWeight: 22000,
      rating: 4.7,
      availability: "Available",
      contactPerson: "Sarah Johnson",
      contactPhone: "(555) 456-7890",
      address: "101 Speed Way, Atlanta, GA 30301" 
    },
    { 
      name: "Eagle", 
      city: "Mesa, AZ", 
      dot: "9132736", 
      equipment: "General Freight", 
      status: "Active",
      maxWeight: 26000,
      rating: 4.3,
      availability: "Unavailable",
      contactPerson: "David Williams",
      contactPhone: "(555) 567-8901",
      address: "202 Eagle Dr, Mesa, AZ 85201"
    },
    { 
      name: "Speedy", 
      city: "Columbus, OH", 
      dot: "—", 
      equipment: "General Freight", 
      status: "Active",
      maxWeight: 18000,
      rating: 3.9,
      availability: "Available",
      contactPerson: "Tom Miller",
      contactPhone: "(555) 678-9012",
      address: "303 Quick St, Columbus, OH 43215"
    },
    { 
      name: "Railable", 
      city: "Springfield, MO", 
      dot: "—", 
      equipment: "Refrigerated", 
      status: "Active",
      maxWeight: 25000,
      rating: 4.1,
      availability: "Limited",
      contactPerson: "Jessica Brown",
      contactPhone: "(555) 789-0123",
      address: "404 Cold Rd, Springfield, MO 65801"
    },
    { 
      name: "Transport", 
      city: "Jackson, MS", 
      dot: "—", 
      equipment: "Flatbed", 
      status: "Active",
      maxWeight: 32000,
      rating: 4.4,
      availability: "Available",
      contactPerson: "Michael Davis",
      contactPhone: "(555) 890-1234",
      address: "505 Flat St, Jackson, MS 39201"
    }
  ];

  // Get unique equipment types for filter
  const equipmentTypes = [...new Set(carriers.map(carrier => carrier.equipment))];
  
  // Filter carriers based on search, max weight and equipment type
  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = carrier.name.toLowerCase().includes(search.toLowerCase()) || 
                          carrier.city.toLowerCase().includes(search.toLowerCase());
    const matchesWeight = carrier.maxWeight <= maxWeightFilter;
    const matchesEquipment = !equipmentFilter || carrier.equipment === equipmentFilter;
    
    return matchesSearch && matchesWeight && matchesEquipment;
  });

  // Sort carriers
  const sortedCarriers = [...filteredCarriers].sort((a, b) => {
    if (!sortOption) return 0;
    
    let comparison = 0;
    if (sortOption === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortOption === "weight") {
      comparison = a.maxWeight - b.maxWeight;
    } else if (sortOption === "rating") {
      comparison = a.rating - b.rating;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleViewCarrier = (carrier: any) => {
    setSelectedCarrier(carrier);
    setShowCarrierModal(true);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Determine availability badge color
  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "Available":
        return <Badge className="bg-green-500">Available</Badge>;
      case "Limited":
        return <Badge className="bg-yellow-500">Limited</Badge>;
      case "Unavailable":
        return <Badge className="bg-red-500">Unavailable</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-[#132947] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Carrier Network</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by Carrier or City"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#1a2334] border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-blue-500 w-full"
          />
        </div>
        
        <Button 
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="flex items-center gap-2 border-gray-600 text-gray-300"
        >
          <Filter size={16} />
          Filters
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
        
        {sortOption && (
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-600 text-gray-300"
            onClick={toggleSortDirection}
          >
            {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Sort: {sortOption}
          </Button>
        )}
      </div>
      
      {showFilters && (
        <div className="mb-6 p-4 bg-[#1a2334] rounded-lg border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Weight size={16} className="mr-2" />
                Max Weight Capacity: {maxWeightFilter.toLocaleString()} lbs
              </h3>
              <Slider
                defaultValue={[maxWeightFilter]}
                max={40000}
                min={10000}
                step={1000}
                onValueChange={(value) => setMaxWeightFilter(value[0])}
                className="mt-2"
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Truck size={16} className="mr-2" />
                Equipment Type
              </h3>
              <RadioGroup
                value={equipmentFilter || ""}
                onValueChange={(value) => setEquipmentFilter(value === "" ? null : value)}
                className="grid grid-cols-1 gap-2"
              >
                <div className="flex items-center">
                  <RadioGroupItem value="" id="all" className="mr-2" />
                  <label htmlFor="all" className="text-sm">All Types</label>
                </div>
                {equipmentTypes.map((type) => (
                  <div key={type} className="flex items-center">
                    <RadioGroupItem value={type} id={type} className="mr-2" />
                    <label htmlFor={type} className="text-sm">{type}</label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Sort By</h3>
              <RadioGroup
                value={sortOption || ""}
                onValueChange={(value) => setSortOption(value === "" ? null : value)}
                className="grid grid-cols-1 gap-2"
              >
                <div className="flex items-center">
                  <RadioGroupItem value="" id="none" className="mr-2" />
                  <label htmlFor="none" className="text-sm">No Sorting</label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="name" id="name" className="mr-2" />
                  <label htmlFor="name" className="text-sm">Carrier Name</label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="weight" id="weight" className="mr-2" />
                  <label htmlFor="weight" className="text-sm">Weight Capacity</label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="rating" id="rating" className="mr-2" />
                  <label htmlFor="rating" className="text-sm">Rating</label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCarriers.length > 0 ? (
          sortedCarriers.map((carrier, index) => (
            <Card key={index} className="bg-[#1B3252] border-gray-700 hover:border-blue-500 transition-all overflow-hidden">
              <CardContent className="p-0">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="p-5 cursor-pointer" onClick={() => handleViewCarrier(carrier)}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-white">{carrier.name}</h3>
                          <p className="text-gray-300 text-sm">{carrier.city}</p>
                        </div>
                        <div>
                          {getAvailabilityBadge(carrier.availability)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-x-4 text-sm mb-3">
                        <div className="flex items-center">
                          <Truck size={16} className="mr-1 text-blue-400" />
                          <span>{carrier.equipment}</span>
                        </div>
                        <div className="flex items-center">
                          <Weight size={16} className="mr-1 text-blue-400" />
                          <span>{carrier.maxWeight.toLocaleString()} lbs</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star}
                            className={`text-lg ${
                              star <= Math.round(carrier.rating) ? "text-yellow-400" : "text-gray-600"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-1 text-sm text-gray-300">({carrier.rating})</span>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  
                  <HoverCardContent className="w-80 bg-[#263B59] border-gray-700 text-white">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-400">{carrier.name}</h4>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium text-gray-300">Address:</span> {carrier.address}
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">DOT:</span> {carrier.dot}
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">Contact:</span> {carrier.contactPerson}
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-2" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCarrier(carrier);
                        }}
                      >
                        View Full Details
                      </Button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                
                <div className="bg-[#132947] p-3 border-t border-gray-700">
                  <Button 
                    onClick={() => handleViewCarrier(carrier)} 
                    variant="default" 
                    className="w-full"
                  >
                    View Carrier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10 bg-[#1B3252] rounded-lg border border-gray-700">
            <p className="text-gray-300">No carriers found matching your filters.</p>
            <Button 
              variant="outline" 
              className="mt-4 border-gray-600"
              onClick={() => {
                setSearch("");
                setMaxWeightFilter(30000);
                setEquipmentFilter(null);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      <CarrierDetailModal
        isOpen={showCarrierModal}
        onClose={() => setShowCarrierModal(false)}
        carrier={selectedCarrier}
      />
      
      <CreateAccountModal
        isOpen={showRequestAccessModal}
        onClose={() => setShowRequestAccessModal(false)}
      />
    </div>
  );
};

export default CarrierList;
