import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRecipeById, deleteRecipe } from "../services/recipeService";
import { Clock, User, ArrowLeft, PenTool, Trash2, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
        setFormData(data); // prépare les champs pour l’édition
      } catch (error) {
        console.error("Erreur:", error);
        navigate("/recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddIngredient = () => {
    if (currentIngredient.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, currentIngredient.trim()]
      }));
      setCurrentIngredient("");
    }
  };

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = async () => {
    if (confirm("Voulez-vous vraiment supprimer cette recette ?")) {
      try {
        await deleteRecipe(id);
        navigate("/recipes");
      } catch (error) {
        console.error("Erreur suppression:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title) newErrors.title = "Le titre est requis";
    if (!formData.description) newErrors.description = "La description est requise";
    if (!formData.ingredients?.length) newErrors.ingredients = "Ajoutez au moins un ingrédient";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // À remplacer par un appel à updateRecipe(formData)
      console.log("Mise à jour avec:", formData);
      setRecipe(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur update:", error);
    }
  };

  if (loading || !recipe) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/recipes" className="flex items-center text-rose-600 dark:text-rose-400 mb-4">
        <ArrowLeft size={18} className="mr-1" />
        Retour aux recettes
      </Link>

      {!isEditing ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <img src={recipe.image || "/placeholder.jpg"} alt={recipe.title} className="w-full h-64 object-cover" />
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <User size={14} className="mr-1" /> {recipe.author} | 
              <Clock size={14} className="ml-4 mr-1" /> {recipe.cookingTime} min
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{recipe.description}</p>

            <h2 className="text-xl font-bold">Ingrédients</h2>
            <ul className="list-disc ml-5 mb-4">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>

            <h2 className="text-xl font-bold">Instructions</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{recipe.instructions}</p>

            {user?.username === recipe.author && (
              <div className="flex space-x-4 mt-6">
                <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center">
                  <PenTool size={18} className="mr-2" />
                  Modifier
                </button>
                <button onClick={handleDelete} className="btn-danger flex items-center">
                  <Trash2 size={18} className="mr-2" />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Modifier la recette</h2>

          <input
            type="text"
            name="title"
            placeholder="Titre"
            value={formData.title}
            onChange={handleChange}
            className="input"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="input"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          <div>
            <div className="flex">
              <input
                type="text"
                placeholder="Nouvel ingrédient"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                className="input mr-2"
              />
              <button type="button" onClick={handleAddIngredient} className="btn-secondary">Ajouter</button>
            </div>
            <ul className="mt-2 space-y-1">
              {formData.ingredients.map((ing, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  {ing}
                  <button type="button" onClick={() => handleRemoveIngredient(index)} className="text-red-500">x</button>
                </li>
              ))}
            </ul>
            {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients}</p>}
          </div>

          <textarea
            name="instructions"
            placeholder="Instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="input"
          />

          <input
            type="number"
            name="cookingTime"
            placeholder="Temps de cuisson (min)"
            value={formData.cookingTime}
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="category"
            placeholder="Catégorie"
            value={formData.category}
            onChange={handleChange}
            className="input"
          />

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={() => setIsEditing(false)} className="btn-outline">Annuler</button>
            <button type="submit" className="btn-primary flex items-center">
              <Save size={18} className="mr-2" />
              Enregistrer
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RecipeDetails;
