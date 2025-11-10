import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { SellPage } from "./pages/SellPage";
import { BrowserRouter, Route, Routes } from "react-router";
import { ListingsPage } from "./pages/ListingsPage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { MyGaragePage } from "./pages/MyGaragePage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/garage" element={<MyGaragePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
