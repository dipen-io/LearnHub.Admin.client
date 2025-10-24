import HomePage from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import InstructorPage from "./pages/Instructor";
import SidebarComponent from "./components/Sidebar";
import CoursePage from "./pages/Course";
import { useState } from "react";
import { TextAlignJustify } from "lucide-react";
import LoginPage from "./pages/Login";

function App() {
  const [showSidebar, setShowSidber] = useState(true);

  return (
   <>
    <Router>
     <div className="flex bg-theme text-theme relative">
     {/* Sidebar */}
     <SidebarComponent visible={showSidebar} onClose={() => setShowSidber(false)}/>

       {/* Hamburger menu for mobile */}
          {!showSidebar && (
            <button
              className="md:hidden text-2xl mb-4 absolute left-4 top-4"
              onClick={() => setShowSidber(true)}
            >
              <TextAlignJustify />
            </button>
          )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Instructor" element={<InstructorPage />} />
        <Route path="/Course" element={<CoursePage />} />
        <Route path="/Login" element={<LoginPage />} />
      </Routes>
     </div>
    </Router>
   </>
  );
}

export default App;

