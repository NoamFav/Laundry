// ============================================================================
// FILE: src/App.jsx
// ============================================================================
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./pages/Hero";

function App() {
    return (
        <Router>
            <DarkModeProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Hero />} />
                    </Routes>
                </Layout>
            </DarkModeProvider>
        </Router>
    );
}

export default App;
