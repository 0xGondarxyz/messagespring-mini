import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserSubscription from "./components/UserSubscription";
import AdminPage from "./components/AdminPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-yellow-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="mb-8 p-4 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/"
                className="px-6 py-2 bg-blue-400 text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Home
              </Link>
              <Link
                to="/admin"
                className="px-6 py-2 bg-green-400 text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Admin
              </Link>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<UserSubscription />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
