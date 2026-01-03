import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import MachineryMarketplace from "./MachineryMarketplace";
import TrackBookings from "./TrackBookings";

export interface Machinery {
  id: string;
  name: string;
  pricePerDay: number;
}

export interface Transaction {
  id: string;
  serviceName: string;
  amount: number;
  status: "BOOKED" | "COMPLETED";
  date: string;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const machinery: Machinery[] = [
    { id: "1", name: "Tractor", pricePerDay: 1500 },
    { id: "2", name: "Harvester", pricePerDay: 3000 },
  ];

  const handleBook = (machine: Machinery) => {
    const booking: Transaction = {
      id: Date.now().toString(),
      serviceName: machine.name,
      amount: machine.pricePerDay,
      status: "BOOKED",
      date: new Date().toLocaleString(),
    };

    setTransactions((prev) => [...prev, booking]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MachineryMarketplace
              machinery={machinery}
              onBook={handleBook}
            />
          }
        />
        <Route
          path="/track"
          element={<TrackBookings transactions={transactions} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
