
export interface FreightTypeData {
  value: string;
  label: string;
  descriptionEn: string;
  descriptionEs: string;
}

export const freightTypes: FreightTypeData[] = [
  {
    value: "dry_goods",
    label: "Dry Goods",
    descriptionEn: "Freight that includes items like non-perishable goods, packaged products, and general consumer items.",
    descriptionEs: "Carga que incluye artículos como productos no perecederos, productos envasados y artículos generales de consumo."
  },
  {
    value: "refrigerated",
    label: "Refrigerated",
    descriptionEn: "Freight that requires temperature control, such as food, pharmaceuticals, or sensitive products.",
    descriptionEs: "Carga que requiere control de temperatura, como alimentos, productos farmacéuticos o productos sensibles."
  },
  {
    value: "construction",
    label: "Construction",
    descriptionEn: "Freight that includes construction materials such as cement, steel, and heavy machinery.",
    descriptionEs: "Carga que incluye materiales de construcción como cemento, acero y maquinaria pesada."
  },
  {
    value: "hazardous",
    label: "Hazardous Materials",
    descriptionEn: "Freight that includes dangerous goods requiring special handling, permits, and transportation procedures.",
    descriptionEs: "Carga que incluye mercancías peligrosas que requieren manejo especial, permisos y procedimientos de transporte."
  },
  {
    value: "automotive",
    label: "Automotive",
    descriptionEn: "Freight related to vehicles, auto parts, engines, and automotive components.",
    descriptionEs: "Carga relacionada con vehículos, autopartes, motores y componentes automotrices."
  },
  {
    value: "electronics",
    label: "Electronics",
    descriptionEn: "Freight consisting of electronic devices, computers, appliances, and related components.",
    descriptionEs: "Carga que consiste en dispositivos electrónicos, computadoras, electrodomésticos y componentes relacionados."
  },
  {
    value: "furniture",
    label: "Furniture",
    descriptionEn: "Freight that includes household or commercial furniture, fixtures, and related items.",
    descriptionEs: "Carga que incluye muebles para el hogar o comerciales, accesorios y artículos relacionados."
  },
  {
    value: "medical_supplies",
    label: "Medical Supplies",
    descriptionEn: "Freight consisting of medical equipment, supplies, and healthcare-related items.",
    descriptionEs: "Carga que consiste en equipos médicos, suministros y artículos relacionados con la atención médica."
  },
  {
    value: "textiles",
    label: "Textiles",
    descriptionEn: "Freight including fabrics, clothing, raw materials for textile manufacturing, and related products.",
    descriptionEs: "Carga que incluye telas, ropa, materias primas para la fabricación de textiles y productos relacionados."
  },
  {
    value: "agricultural",
    label: "Agricultural",
    descriptionEn: "Freight consisting of crops, farm products, seeds, fertilizers, and agricultural equipment.",
    descriptionEs: "Carga que consiste en cultivos, productos agrícolas, semillas, fertilizantes y equipos agrícolas."
  },
  {
    value: "livestock",
    label: "Livestock",
    descriptionEn: "Freight involving the transportation of live animals for various purposes.",
    descriptionEs: "Carga que implica el transporte de animales vivos para diversos fines."
  },
  {
    value: "bulk_commodities",
    label: "Bulk Commodities",
    descriptionEn: "Freight consisting of unpackaged bulk materials like grains, minerals, or liquids.",
    descriptionEs: "Carga que consiste en materiales a granel sin empaquetar como granos, minerales o líquidos."
  }
];

export const filterFreightTypes = (query: string): FreightTypeData[] => {
  const lowerCaseQuery = query.toLowerCase().trim();
  
  if (!lowerCaseQuery) {
    return [];
  }
  
  // First, find exact matches at the beginning of the label
  const exactMatches = freightTypes.filter(type => 
    type.label.toLowerCase().startsWith(lowerCaseQuery)
  );
  
  // Then find partial matches anywhere in the label
  const partialMatches = freightTypes.filter(type => 
    !type.label.toLowerCase().startsWith(lowerCaseQuery) && 
    type.label.toLowerCase().includes(lowerCaseQuery)
  );
  
  // Combine and return limited results
  return [...exactMatches, ...partialMatches].slice(0, 5);
};
