import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import BlogGenerator from "./pages/BlogGenerator";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                

                <Route
                    path="/blog"
                    element={<BlogGenerator />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;