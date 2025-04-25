import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import SignIn from './views/SignIn';
import TransactionForm from './views/TransactionForm';
import TransactionHistory from './views/TransactionHistory';
import SignUp from './views/SignUp';
import ReportPage from './views/ReportPage';
import ResetPassword from './views/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-transaction" element={<TransactionForm />} />
        <Route path="/transactions/history" element={<TransactionHistory />} />
        <Route path="/report" element={<ReportPage transactions={[]} accounts={[]} />} />
        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
    </Router>
  );
}

export default App;
