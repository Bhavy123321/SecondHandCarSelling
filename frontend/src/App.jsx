import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AddCar from './pages/AddCar';
import CarDetails from './pages/CarDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCars from './pages/AdminCars';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import MyListings from './pages/MyListings';
import MyPurchases from './pages/MyPurchases';
import BuyCar from './pages/BuyCar';
import EditCar from './pages/EditCar';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'Admin') return <Navigate to="/" />;
  return children;
};

const RoleBasedHome = () => {
  const { user } = useAuth();

  if (user?.role === 'Admin') return <Home />;
  if (user?.role === 'Seller') return <SellerDashboard />;
  if (user?.role === 'Buyer') return <BuyerDashboard />;

  return <Home />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Role-based home dashboard */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <RoleBasedHome />
              </Layout>
            </PrivateRoute>
          } />

          {/* Seller Routes */}
          <Route path="/sell" element={
            <PrivateRoute>
              <Layout>
                <AddCar />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/my-listings" element={
            <PrivateRoute>
              <Layout>
                <MyListings />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/edit-car/:id" element={
            <PrivateRoute>
              <Layout>
                <EditCar />
              </Layout>
            </PrivateRoute>
          } />

          {/* Buyer Routes */}
          <Route path="/my-purchases" element={
            <PrivateRoute>
              <Layout>
                <MyPurchases />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/buy/:id" element={
            <PrivateRoute>
              <Layout>
                <BuyCar />
              </Layout>
            </PrivateRoute>
          } />

          {/* Shared Routes */}
          <Route path="/cars/:id" element={
            <PrivateRoute>
              <Layout>
                <CarDetails />
              </Layout>
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <Layout>
                <AdminUsers />
              </Layout>
            </AdminRoute>
          } />
          <Route path="/admin/cars" element={
            <AdminRoute>
              <Layout>
                <AdminCars />
              </Layout>
            </AdminRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
