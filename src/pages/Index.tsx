
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Truck, Package, ArrowRight, ShieldCheck, CreditCard, Map, MessageSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [userType, setUserType] = useState<"shipper" | "driver">("shipper");

  const handleLoginClick = () => {
    navigate("/auth?mode=login");
  };

  const handleExploreClick = () => {
    // Just navigate to shipments - signup will happen when they try to book
    navigate("/shipments");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Connect Shippers with Drivers for Seamless Freight Transport
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                RoadSync is a modern platform that streamlines the logistics process, 
                helping shippers find reliable drivers and enabling drivers to find 
                consistent, well-paying loads.
              </p>
              <div className="flex flex-col space-y-4 pt-4">
                <div className="flex justify-center sm:justify-start">
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
                </div>
                <Button 
                  size="lg" 
                  className="bg-brand-blue text-white hover:bg-brand-blue/90 border border-white/20"
                  onClick={isAuthenticated ? () => navigate("/dashboard") : handleExploreClick}
                >
                  {isAuthenticated ? "Go to Dashboard" : `Explore Available ${userType === "shipper" ? "Carriers" : "Loads"}`}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-full h-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg p-8 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Truck className="h-32 w-32 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Easiest Way to Ship and Transport Freight
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform connects shippers with drivers, streamlining the entire freight process 
              from posting loads to payment processing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-brand-lightBlue p-8 rounded-lg">
              <div className="p-3 bg-brand-blue rounded-full w-fit mb-6">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Post Shipments</h3>
              <p className="text-gray-700">
                Shippers can easily post detailed load information including origin, destination, 
                weight, type, and price.
              </p>
            </div>

            <div className="bg-brand-lightGreen p-8 rounded-lg">
              <div className="p-3 bg-brand-green rounded-full w-fit mb-6">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Loads</h3>
              <p className="text-gray-700">
                Drivers can browse and filter available loads based on location, pay, and other preferences.
              </p>
            </div>

            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="p-3 bg-gray-700 rounded-full w-fit mb-6">
                <Map className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Tracking</h3>
              <p className="text-gray-700">
                Track shipments in real-time with our advanced GPS integration for complete visibility.
              </p>
            </div>

            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="p-3 bg-gray-700 rounded-full w-fit mb-6">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">In-App Messaging</h3>
              <p className="text-gray-700">
                Communicate directly with drivers or shippers through our secure in-app messaging system.
              </p>
            </div>

            <div className="bg-brand-lightBlue p-8 rounded-lg">
              <div className="p-3 bg-brand-blue rounded-full w-fit mb-6">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-gray-700">
                Process payments securely with our integrated payment system, including broker fee management.
              </p>
            </div>

            <div className="bg-brand-lightGreen p-8 rounded-lg">
              <div className="p-3 bg-brand-green rounded-full w-fit mb-6">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Vetted Network</h3>
              <p className="text-gray-700">
                All drivers and shippers are verified to ensure reliability and trustworthiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xl">1</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Browse Loads or Carriers</h3>
                    <p className="text-gray-600">
                      Explore available shipments or carriers without signing up first.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xl">2</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Find What You Need</h3>
                    <p className="text-gray-600">
                      Discover the perfect load or carrier for your needs with our easy filters.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xl">3</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Quick Sign Up When Ready</h3>
                    <p className="text-gray-600">
                      Create an account only when you're ready to book a load or carrier.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xl">4</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Track and Complete</h3>
                    <p className="text-gray-600">
                      Track shipments in real-time and process secure payments upon successful delivery.
                    </p>
                  </div>
                </div>
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
                  onClick={() => navigate(isAuthenticated ? "/dashboard" : "/shipments")}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Explore Available Loads"}
                </Button>
                <p className="mt-3 text-sm text-gray-500">
                  No account required to start browsing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              onClick={isAuthenticated ? () => navigate("/dashboard") : handleExploreClick}
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Exploring"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
