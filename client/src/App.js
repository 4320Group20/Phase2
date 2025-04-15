import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import SignIn from './views/SignIn';
import TransactionForm from './views/TransactionForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} /> {/* add this route */}
              <Route path="/create-transaction" element={<TransactionForm />} />
      </Routes>
    </Router>
  );
}

export default App;
