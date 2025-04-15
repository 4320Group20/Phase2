import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import SignIn from './views/SignIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} /> {/* add this route */}
      </Routes>
    </Router>
  );
}

export default App;
