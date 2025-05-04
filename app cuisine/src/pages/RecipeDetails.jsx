import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const foundRecipe = storedRecipes.find((r) => r.id === id);
    setRecipe(foundRecipe);
  }, [id]);

  const handleDeleteRecipe = () => {
    if (!window.confirm("Confirmer la suppression ?")) return;

    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const updatedRecipes = storedRecipes.filter((r) => r.id !== id);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    navigate("/");
  };

  const handleEditRecipe = () => {
    navigate(`/edit-recipe/${id}`);
  };

  if (!recipe) {
    return <div>Recette non trouvée.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      <p className="text-xl">{recipe.description}</p>
      <p className="text-sm text-gray-500">Catégorie: {recipe.category}</p>
      <p className="text-sm text-gray-400">Ajoutée le: {new Date(recipe.createdAt).toLocaleDateString()}</p>

      <div className="mt-4">
        <button
          onClick={handleEditRecipe}
          className="btn-primary text-lg px-8 py-3"
        >
          Modifier
        </button>
        <button
          onClick={handleDeleteRecipe}
          className="btn-danger text-lg px-8 py-3 ml-4"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default RecipeDetails;
