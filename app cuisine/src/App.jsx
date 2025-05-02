import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recipes from "./pages/Recipes";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:id" element={<Recipes />} />
                
                {/* Routes protégées */}
                <Route 
                  path="/add-recipe" 
                  element={
                    <ProtectedRoute>
                      <AddRecipe />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/edit-recipe/:id" 
                  element={
                    <ProtectedRoute>
                      <EditRecipe />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Route admin protégée */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <div className="text-center py-12">
                        <h1 className="text-3xl font-bold mb-4">Espace Admin</h1>
                        <p>Bienvenue dans l'espace d'administration</p>
                      </div>
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;