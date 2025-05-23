import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import SignIn from './views/SignIn';
import TransactionForm from './views/TransactionForm';
import TransactionHistory from './views/TransactionHistory';
import SignUp from './views/SignUp';
import ReportPage from './views/ReportPage';
import ResetPassword from './views/ResetPassword';
import AccountGroupsView from './views/AccountGroupsView';
import ManageUsers from './views/ManageUsers';
import { useNavigate } from 'react-router-dom';
import ChartOfAccountsContainer from './components/ChartOfAccountsContainer';

function ChartPageWrapper() {
    const navigate = useNavigate();
    return (
        <ChartOfAccountsContainer
            onExit={() => navigate('/')}
        />
    );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/transactions/new" element={<TransactionForm />} />
        <Route path="/transactions/history" element={<TransactionHistory />} />
        <Route path="/report" element={<ReportPage transactions={[]} accounts={[]} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account-groups" element={<AccountGroupsView />} />
        <Route
            path="/chart-of-accounts"
            element={<ChartPageWrapper />}
        />
        <Route path="/manage-users" element={<ManageUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
