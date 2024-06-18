import { Navbar } from "@/components/Navbar";
import { Main } from "@/components/Main";
import { Filter } from "@/components/Filter";
import { Route, Routes } from "react-router-dom";
import Admin from "./components/Admin";
import CartPage from "./components/CartPage";
import Auth from "./components/Auth";
const App = () => {
  return (
    <main className="bg-gray-900 min-h-screen max-w-screen">
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
        <Route path="/auth" element={<Auth />}></Route>
      </Routes>
    </main>
  );
};
export default App;
