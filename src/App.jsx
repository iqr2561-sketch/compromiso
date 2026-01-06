import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Category from './pages/Category';
import Post from './pages/Post';
import Search from './pages/Search';
import Navbar from './components/Navbar';
import HeaderTop from './components/HeaderTop';
import TickerBar from './components/TickerBar';
import Footer from './components/Footer';

const AppLayout = ({ children }) => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    if (isAdmin) {
        return <div className="min-h-screen bg-[#0a0c10] text-white selection:bg-primary selection:text-white">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-300 selection:bg-primary selection:text-white">
            <Navbar />
            <HeaderTop />
            <TickerBar />
            <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
                {children}
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <NewsProvider>
            <Router>
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/categoria/:categoryName" element={<Category />} />
                        <Route path="/noticia/:id" element={<Post />} />
                        <Route path="/search" element={<Search />} />
                    </Routes>
                </AppLayout>
            </Router>
        </NewsProvider>
    );
}

export default App;
