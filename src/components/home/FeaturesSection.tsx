
import React from "react";
import { Package, Truck, Map, MessageSquare, CreditCard, ShieldCheck } from "lucide-react";

const FeaturesSection: React.FC = () => {
  return (
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
          <FeatureCard
            icon={<Package className="h-6 w-6 text-white" />}
            title="Post Shipments"
            description="Shippers can easily post detailed load information including origin, destination, weight, type, and price."
            bgColor="bg-brand-lightBlue"
            iconBgColor="bg-brand-blue"
          />

          <FeatureCard
            icon={<Truck className="h-6 w-6 text-white" />}
            title="Find Loads"
            description="Drivers can browse and filter available loads based on location, pay, and other preferences."
            bgColor="bg-brand-lightGreen"
            iconBgColor="bg-brand-green"
          />

          <FeatureCard
            icon={<Map className="h-6 w-6 text-white" />}
            title="Real-Time Tracking"
            description="Track shipments in real-time with our advanced GPS integration for complete visibility."
            bgColor="bg-gray-100"
            iconBgColor="bg-gray-700"
          />

          <FeatureCard
            icon={<MessageSquare className="h-6 w-6 text-white" />}
            title="In-App Messaging"
            description="Communicate directly with drivers or shippers through our secure in-app messaging system."
            bgColor="bg-gray-100"
            iconBgColor="bg-gray-700"
          />

          <FeatureCard
            icon={<CreditCard className="h-6 w-6 text-white" />}
            title="Secure Payments"
            description="Process payments securely with our integrated payment system, including broker fee management."
            bgColor="bg-brand-lightBlue"
            iconBgColor="bg-brand-blue"
          />

          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6 text-white" />}
            title="Vetted Network"
            description="All drivers and shippers are verified to ensure reliability and trustworthiness."
            bgColor="bg-brand-lightGreen"
            iconBgColor="bg-brand-green"
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconBgColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, bgColor, iconBgColor }) => (
  <div className={`${bgColor} p-8 rounded-lg`}>
    <div className={`p-3 ${iconBgColor} rounded-full w-fit mb-6`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-700">
      {description}
    </p>
  </div>
);

export default FeaturesSection;
