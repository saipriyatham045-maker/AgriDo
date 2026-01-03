import React, { useMemo, useState } from "react";

interface Crop {
  id: string;
  cropName?: string;
  variety?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface Props {
  crops?: Crop[];
}

const cropPlaceholders: Record<string, string> = {
  wheat: "/images/wheat.jpg",
  rice: "/images/rice.jpg",
  maize: "/images/maize.jpg",
};

const CropMarketplace: React.FC<Props> = ({ crops = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ SAFE FILTERING (NO CRASH)
  const filteredCrops = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return (crops ?? []).filter((c) => {
      const cropName = (c.cropName ?? "").toLowerCase();
      const variety = (c.variety ?? "").toLowerCase();

      return (
        cropName.includes(search) ||
        variety.includes(search)
      );
    });
  }, [crops, searchTerm]);

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search crops..."
        className="border p-2 w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredCrops.map((crop) => (
          <div
            key={crop.id}
            className="border rounded-lg p-4 shadow"
          >
            <img
              src={
                crop.imageUrl ||
                cropPlaceholders[(crop.cropName ?? "").toLowerCase()] ||
                cropPlaceholders["wheat"]
              }
              alt={crop.cropName ?? "Crop"}
              className="h-40 w-full object-cover mb-2"
            />

            <h3 className="font-bold text-lg">
              {crop.cropName ?? "Unknown Crop"}
            </h3>

            <p className="text-gray-600">
              Variety: {crop.variety ?? "N/A"}
            </p>

            <p>Price: ₹{crop.price}</p>
            <p>Quantity: {crop.quantity} kg</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropMarketplace;
