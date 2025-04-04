
import React from "react";
import ShipperForm from "@/components/shipper/ShipperForm";

const ShipperPage = () => {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Post a Load</h1>
      <p className="text-gray-600 mb-6">
        Fill out the form below to post your load to our network of carriers
      </p>
      <ShipperForm />
    </div>
  );
};

export default ShipperPage;
