import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserSubscription from "./components/UserSubscription";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <nav style={{ marginBottom: '20px', padding: '10px', borderBottom: '1px solid #eee' }}>
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>Home</Link>
          <Link to="/admin" style={{ textDecoration: 'none', color: '#007bff' }}>Admin</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<UserSubscription />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
