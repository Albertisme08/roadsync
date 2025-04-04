
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Truck, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type UserType = "shipper" | "driver";

interface CTASectionProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
}

const CTASection: React.FC<CTASectionProps> = ({ userType, setUserType }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleExploreClick = () => {
    if (userType === "shipper") {
      navigate("/post-load");
    } else {
      navigate("/shipments");
    }
  };

  return (
    <section className="py-16 bg-brand-blue text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Simplify Your Freight Transport?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join RoadSync today and experience the future of logistics and freight management.
        </p>
        <div className="flex flex-col items-center gap-6">
          <div className="bg-white/10 p-1 rounded-lg inline-flex">
            <Button 
              variant={userType === "shipper" ? "default" : "ghost"} 
              className={userType === "shipper" ? "bg-white text-brand-blue" : "text-white hover:bg-white/20"}
              onClick={() => setUserType("shipper")}
            >
              <Package className="mr-2 h-5 w-5" />
              I'm a Shipper
            </Button>
            <Button 
              variant={userType === "driver" ? "default" : "ghost"} 
              className={userType === "driver" ? "bg-white text-brand-blue" : "text-white hover:bg-white/20"}
              onClick={() => setUserType("driver")}
            >
              <Truck className="mr-2 h-5 w-5" />
              I'm a Carrier
            </Button>
          </div>
          <Button 
            size="lg" 
            variant="default"
            className="bg-white text-brand-blue hover:bg-gray-100"
            onClick={isAuthenticated ? () => navigate("/dashboard") : () => navigate("/auth?mode=register")}
          >
            {isAuthenticated ? "Go to Dashboard" : userType === "shipper" ? "Post a Load" : "Sign Up"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
