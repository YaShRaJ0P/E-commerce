import { Navbar } from "@/components/Navbar";
import { Main } from "@/components/Main";
import { Filter } from "@/components/Filter";
import { Route, Routes } from "react-router-dom";
import Admin from "./components/Admin";
import CartPage from "./components/CartPage";
const App = () => {
  return (
    <main className="bg-gray-900">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="flex flex-row">
                <Filter />
                <Main />
              </div>
            </>
          }
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </main>
  );
};
export default App;
