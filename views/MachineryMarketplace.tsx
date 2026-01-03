import { useNavigate } from "react-router-dom";
import { Machinery } from "./App";

interface Props {
  machinery: Machinery[];
  onBook: (machine: Machinery) => void;
}

const MachineryMarketplace: React.FC<Props> = ({ machinery, onBook }) => {
  const navigate = useNavigate();

  const handleBookNow = (machine: Machinery) => {
    onBook(machine);     // ✅ create booking
    navigate("/track");  // ✅ go to tracking page
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Machinery Marketplace</h1>

      {machinery.map((machine) => (
        <div
          key={machine.id}
          className="border p-4 rounded mb-3 flex justify-between items-center"
        >
          <div>
            <h2 className="font-bold">{machine.name}</h2>
            <p>₹{machine.pricePerDay} / day</p>
          </div>

          <button
            onClick={() => handleBookNow(machine)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default MachineryMarketplace;
