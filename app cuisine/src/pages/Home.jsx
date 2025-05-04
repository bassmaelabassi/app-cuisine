import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchRecipes = () => {
      const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
      setRecipes(storedRecipes);
      setLoading(false);
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
      <section className="text-center py-12 px-4 rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400">
          Partagez vos recettes préférées
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Bienvenue sur 404.js Cuisine, l'endroit idéal pour découvrir et partager vos recettes de cuisine.
        </p>
        {user?.role === "admin" && (
          <Link to="/add-recipe" className="btn-primary text-lg px-8 py-3">
            Ajouter une recette
          </Link>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold">Recettes récentes</h2>

          <div className="w-full md:w-auto md:ml-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            >
              <option value="">Toutes les catégories</option>
              <option value="Maroc">Maroc</option>
              <option value="Italie">Italie</option>
              <option value="Espagne">Espagne</option>
              <option value="Allemagne">Allemagne</option>
              <option value="Asie">Asie</option>
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

      <section>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm space-y-2 hover:shadow-md transition duration-300"
              >
                <h3 className="text-xl font-bold text-orange-700 dark:text-orange-400">
                  {recipe.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                  {recipe.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Catégorie : {recipe.category || "Non catégorisé"}
                </p>
                <p className="text-xs text-gray-400">
                  Ajoutée le : {new Date(recipe.createdAt).toLocaleDateString()}
                </p>

                {user?.role === "admin" && (
                  <div className="flex space-x-2 mt-4">
                    <Link to={`/recipe-details/${recipe.id}`} className="text-blue-600 dark:text-blue-400">
                      Voir plus
                    </Link>
                  </div>
                )}
              </div>
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
                : "Ajoutez la première recette !" }
            </p>
            {user?.role === "admin" && (
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

export default Home;
