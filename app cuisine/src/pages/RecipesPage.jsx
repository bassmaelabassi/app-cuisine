import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllRecipes, getRecipeById } from "../services/recipeService";
import { Clock, User, ArrowLeft } from "lucide-react";

const RecipesPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (id) {
          const data = await getRecipeById(id);
          setRecipe(data);

          const allRecipes = await getAllRecipes();
          setRelatedRecipes(allRecipes.filter(r => r.id !== id).slice(0, 3));
        } else {
          const data = await getAllRecipes();
          setRelatedRecipes(data);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderRecipeCard = (recipe) => (
    <Link
      to={`/recipes/${recipe.id}`}
      key={recipe.id}
      className="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
    >
      <img
        src={recipe.image || "/placeholder-recipe.jpg"}
        alt={recipe.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{recipe.title}</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center mb-1">
            <User size={14} className="mr-1" />
            {recipe.author || "Auteur inconnu"}
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            {recipe.cookingTime} min
          </div>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {id ? (
        recipe && (
          <div className="max-w-4xl mx-auto">
            <Link to="/recipes" className="flex items-center text-rose-600 dark:text-rose-400 mb-4">
              <ArrowLeft size={18} className="mr-1" />
              Retour aux recettes
            </Link>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="relative h-64 md:h-96 overflow-hidden">
                <img
                  src={recipe.image || "/placeholder-recipe.jpg"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{recipe.title}</h1>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center mr-4">
                    <User size={14} className="mr-1" />
                    {recipe.author || "Auteur inconnu"}
                  </span>
                  <span className="flex items-center mr-4">
                    <Clock size={14} className="mr-1" />
                    {recipe.cookingTime} min
                  </span>
                  <span className="flex items-center">
                    {recipe.category || "Sans catégorie"}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6">{recipe.description}</p>

                {recipe.ingredients && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-3">Ingrédients</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-2"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recipe.instructions && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-3">Instructions</h2>
                    <div className="prose dark:prose-invert max-w-none">
                      {recipe.instructions.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {relatedRecipes.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Recettes similaires</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedRecipes.map(renderRecipeCard)}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">Toutes les recettes</h1>

          {relatedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedRecipes.map(renderRecipeCard)}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">
                Aucune recette disponible
              </h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
