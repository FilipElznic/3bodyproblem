import { useState } from "react";
import { ClassicPage } from "./components/ClassicPage";
import { HierarchicalPage } from "./components/HierarchicalPage";
import { SolarSystemPage } from "./components/SolarSystemPage";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "classic" | "hierarchical" | "solar"
  >("classic");

  return (
    <>
      {currentPage === "classic" && <ClassicPage onNavigate={setCurrentPage} />}
      {currentPage === "hierarchical" && (
        <HierarchicalPage onNavigate={setCurrentPage} />
      )}
      {currentPage === "solar" && (
        <SolarSystemPage onNavigate={setCurrentPage} />
      )}
    </>
  );
}

export default App;
