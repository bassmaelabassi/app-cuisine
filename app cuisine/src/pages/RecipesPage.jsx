import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, User, Heart, MessageCircle, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await getAllRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="recipes-page">
      <h1 className="text-3xl font-bold mb-4">Recettes</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="recipes-list">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{recipe.name}</h2>
                <Link to={`/recipe/${recipe.id}`}>
                  <PlusCircle className="w-6 h-6" />
                </Link>
              </div>
              <p>{recipe.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{recipe.time} min</span>
                </div>
                <div className="flex items-center mr-4">
                  <User className="w-4 h-4 mr-1" />
                  <span>{recipe.author}</span>
                </div>
                <div className="flex items-center mr-4">
                  <Heart className="w-4 h-4 mr-1" />
                  <span>{recipe.likes}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span>{recipe.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
