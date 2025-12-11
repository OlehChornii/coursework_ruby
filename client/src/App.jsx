// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Reviews from './pages/Reviews';
import DogsList from './pages/Dogs/DogsList';
import DogsBreeds from './pages/Dogs/DogsBreeds';
import DogsArticles from './pages/Dogs/DogsArticles';
import DogDetail from './pages/Dogs/DogDetail';
import CatsList from './pages/Cats/CatsList';
import CatsBreeds from './pages/Cats/CatsBreeds';
import CatsArticles from './pages/Cats/CatsArticles';
import CatDetail from './pages/Cats/CatDetail';
import OthersList from './pages/Others/OthersList';
import OthersBreeds from './pages/Others/OthersBreeds';
import OthersArticles from './pages/Others/OthersArticles';
import OtherDetail from './pages/Others/OtherDetail';
import AdoptSearch from './pages/Adopt/AdoptSearch';
import AdoptDetail from './pages/Adopt/AdoptDetail';
import ShelterDetail from './pages/Adopt/ShelterDetail';
import BreederDetail from './pages/Breeder/BreederDetail';
import ArticleDetail from './pages/ArticleDetail';
import Cart from './pages/Payment/Cart';
import Checkout from './pages/Payment/Checkout';
import CheckoutSuccess from './pages/Payment/CheckoutSuccess';
import CheckoutCancel from './pages/Payment/CheckoutCancel';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/User/Profile';
import Orders from './pages/User/Orders';
import OrderDetail from './pages/User/OrderDetail';
import Adoptions from './pages/User/Adoptions';
import AdoptionDetail from './pages/User/AdoptionDetail';
import AdminPanel from './pages/Admin/AdminPanel';
import Dashboard from './pages/Admin/Dashboard';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const readUserFromStorage = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Помилка парсування користувача:', error);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    readUserFromStorage();

    const onAuthChanged = () => readUserFromStorage();

    const onStorage = (e) => {
      if (e.key === 'token' || e.key === 'user') readUserFromStorage();
    };

    window.addEventListener('authChanged', onAuthChanged);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('authChanged', onAuthChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <ScrollToTop />

        <Header />
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/reviews" element={<Reviews />} />

            <Route path="/dogs" element={<DogsList />} />
            <Route path="/dogs/list" element={<DogsList />} />
            <Route path="/dogs/breeds" element={<DogsBreeds />} />
            <Route path="/dogs/articles" element={<DogsArticles />} />
            <Route path="/dogs/:id" element={<DogDetail />} />

            <Route path="/cats" element={<CatsList />} />
            <Route path="/cats/list" element={<CatsList />} />
            <Route path="/cats/breeds" element={<CatsBreeds />} />
            <Route path="/cats/articles" element={<CatsArticles />} />
            <Route path="/cats/:id" element={<CatDetail />} />

            <Route path="/others" element={<OthersList />} />
            <Route path="/others/list" element={<OthersList />} />
            <Route path="/others/breeds" element={<OthersBreeds />} />
            <Route path="/others/articles" element={<OthersArticles />} />
            <Route path="/others/:id" element={<OtherDetail />} />

            <Route path="/adopt" element={<AdoptSearch />} />
            <Route path="/adopt/search" element={<AdoptSearch />} />
            <Route path="/adopt/:id" element={<AdoptDetail />} />
            <Route path="/adoptions/:id" element={<AdoptionDetail />} />
            <Route path="/shelters/:id" element={<ShelterDetail />} />

            <Route path="/breeders/:id" element={<BreederDetail />} />

            <Route path="/articles/:id" element={<ArticleDetail />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/orders" element={<Orders />} />
            <Route path="/user/adoptions" element={<Adoptions />} />
            <Route path="/orders/:id" element={<OrderDetail />} />

            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>       
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;