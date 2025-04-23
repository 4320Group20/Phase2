import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import SignIn from './views/SignIn';
import TransactionForm from './views/TransactionForm';
import TransactionHistory from './views/TransactionHistory';
import SignUp from './views/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-transaction" element={<TransactionForm />} />
        <Route path="/transactions/history" element={<TransactionHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
