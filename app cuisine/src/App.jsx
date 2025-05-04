// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe-details/:id" element={<RecipeDetails />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/edit-recipe/:id" element={<EditRecipe />} />
      </Routes>
    </Router>
  );
}

export default App;