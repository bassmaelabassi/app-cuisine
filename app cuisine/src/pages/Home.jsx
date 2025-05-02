import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";
import { Loader } from "lucide-react";

const HomePage = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await getAllRecipes();
        setRecipes(data);
        setFilteredRecipes(data);
        setCategories([...new Set(data.map((r) => r.category))]);
      } catch (error) {
        console.error("Erreur lors du chargement des recettes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    let result = [...recipes];

    if (selectedCategory) {
      result = result.filter((r) => r.category === selectedCategory);
    }

    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredRecipes(result);
  }, [recipes, selectedCategory]);

  const clearFilters = () => {
    setSelectedCategory("");
  };

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <section className="text-center py-12 px-4 rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400">
          Partagez vos recettes préférées
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Bienvenue sur 404.js Cuisine, l'endroit idéal pour découvrir et partager vos recettes de cuisine.
        </p>
        {user && (
          <Link to="/add-recipe" className="btn-primary text-lg px-8 py-3">
            Ajouter une recette
          </Link>
        )}
      </section>

      {/* CATEGORY FILTER */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold">Recettes récentes</h2>

          <div className="w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCategory && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Filtre actif :</span>
            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full text-sm">
              {selectedCategory}
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              Effacer
            </button>
          </div>
        )}
      </section>

      {/* RECIPES DISPLAY */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">
              {recipes.length > 0
                ? "Aucune recette dans cette catégorie"
                : "Aucune recette disponible"}
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              {recipes.length > 0
                ? "Essayez de sélectionner une autre catégorie"
                : "Ajoutez la première recette !"}
            </p>
            {user && (
              <div className="mt-4">
                <Link to="/add-recipe" className="btn-primary">
                  Ajouter une recette
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;