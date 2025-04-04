
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const HowItWorksSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How RoadSync Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform makes shipping and transportation simple, with a straightforward process for both shippers and drivers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              <Step 
                number={1} 
                title="Browse Loads or Carriers" 
                description="Explore available shipments or carriers without signing up first."
              />
              <Step 
                number={2} 
                title="Find What You Need" 
                description="Discover the perfect load or carrier for your needs with our easy filters."
              />
              <Step 
                number={3} 
                title="Quick Sign Up When Ready" 
                description="Create an account only when you're ready to book a load or carrier."
              />
              <Step 
                number={4} 
                title="Track and Complete" 
                description="Track shipments in real-time and process secure payments upon successful delivery."
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-gray-100 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Logistics shipping" 
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth?mode=register")}
              >
                {isAuthenticated ? "Go to Dashboard" : "Sign Up"}
              </Button>
              <p className="mt-3 text-sm text-gray-500">
                No account required to start browsing
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xl">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default HowItWorksSection;
