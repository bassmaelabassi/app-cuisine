import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const categoriesList = [
  "Marocaine",
  "Italienne",
  "Asiatique",
  "Indienne",
  "Française",
];

const AddRecipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [recipe, setRecipe] = useState({
    title: "",
    image: "",
    description: "",
    category: "",
    ingredients: [],
  });

  const [newIngredient, setNewIngredient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
      const found = recipes.find((r) => r.id === id);
      if (found) {
        setRecipe(found);
      } else {
        setError("Recette introuvable");
      }
    }
  }, [id]);

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-center text-red-500">Non autorisé</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setRecipe((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()],
      }));
      setNewIngredient("");
    }
  };

  const handleDeleteIngredient = (index) => {
    const updated = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe((prev) => ({ ...prev, ingredients: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

      if (isEditing) {
        const updatedRecipes = recipes.map((r) =>
          r.id === id ? { ...recipe, id } : r
        );
        localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
      } else {
        const newRecipe = {
          ...recipe,
          id: Date.now().toString(),
        };
        recipes.push(newRecipe);
        localStorage.setItem("recipes", JSON.stringify(recipes));
      }

      navigate("/");
    } catch (error) {
      console.error("Erreur:", error);
      setError("Échec de l'enregistrement. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Modifier la recette" : "Ajouter une recette"}
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input
            name="title"
            value={recipe.title}
            onChange={handleChange}
            required
            placeholder="Titre de la recette"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            name="image"
            value={recipe.image}
            onChange={handleChange}
            placeholder="Lien de l'image"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={recipe.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <select
            name="category"
            value={recipe.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">-- Choisir une catégorie --</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ingrédients</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Ajouter un ingrédient"
              className="flex-1 p-2 border rounded-md"
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="bg-green-600 text-white px-3 rounded-md"
            >
              Ajouter
            </button>
          </div>
          <ul className="mt-2 list-disc list-inside text-sm">
            {recipe.ingredients.map((ing, index) => (
              <li key={index} className="flex justify-between items-center">
                {ing}
                <button
                  type="button"
                  onClick={() => handleDeleteIngredient(index)}
                  className="text-red-500 text-xs ml-2"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md disabled:opacity-50"
        >
          {isLoading ? "Enregistrement..." : isEditing ? "Modifier" : "Ajouter"}
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
