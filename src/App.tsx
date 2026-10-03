/**
 * App – root layout with router.
 * Wraps all pages in Navbar + Footer.
 */
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Results from "./pages/Results";
import PropertyDetail from "./pages/PropertyDetail";
import Saved from "./pages/Saved";
import Compare from "./pages/Compare";
import Styleguide from "./pages/Styleguide";
import { useAiStore } from "./store/useAiStore";

export default function App() {
  const checkHealthAndWarmup = useAiStore((s) => s.checkHealthAndWarmup);

  useEffect(() => {
    checkHealthAndWarmup();
  }, [checkHealthAndWarmup]);

  return (
    <BrowserRouter>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/styleguide" element={<Styleguide />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
