// ============================================================================
// FILE: src/App.jsx
// ============================================================================
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import DarkModeProvider from "./providers/DarkModeProvider";
import Layout from "./components/Layout";
import Hero from "./pages/Hero";
import About from "./pages/About";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <Router>
            <DarkModeProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Hero />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            </DarkModeProvider>
        </Router>
    );
}

export default App;
