import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PenTool, PlusCircle } from "lucide-react";

const AddRecipe = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [],
    instructions: "",
    cookingTime: "",
    category: "",
    image: ""
  });
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleAddIngredient = () => {
    if (currentIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, currentIngredient.trim()]
      }));
      setCurrentIngredient("");
    }
  };

  const handleRemoveIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title) newErrors.title = "Le titre est requis";
    if (!formData.description) newErrors.description = "La description est requise";
    if (formData.ingredients.length === 0) newErrors.ingredients = "Ajoutez au moins un ingrédient";
    if (!formData.category) newErrors.category = "Veuillez choisir une catégorie";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const newRecipe = {
        ...formData,
        id: `recipe_${Date.now()}`,
        author: user.username,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: []
      };

      console.log("Nouvelle recette:", newRecipe);

      navigate(`/recipes`);
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
        <div className="flex items-center mb-6">
          <PenTool className="text-rose-600 dark:text-rose-400 mr-2" size={24} />
          <h1 className="text-2xl font-bold">Ajouter une recette</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">Titre de la recette</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 ${
                errors.title ? "border-red-500" : ""
              }`}
              placeholder="Ex: Tarte aux pommes"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="Décrivez brièvement votre recette..."
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="ingredients" className="block mb-1 font-medium">Ingrédients</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                className="flex-1 p-2 border rounded-l-md dark:bg-gray-800 dark:border-gray-700"
                placeholder="Ajouter un ingrédient"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="bg-rose-600 text-white px-4 rounded-r-md hover:bg-rose-700"
              >
                <PlusCircle size={18} />
              </button>
            </div>
            
            {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
            
            <div className="space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  <span>{ingredient}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="instructions" className="block mb-1 font-medium">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="5"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder="Détaillez les étapes de préparation..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="cookingTime" className="block mb-1 font-medium">Temps de préparation (min)</label>
              <input
                id="cookingTime"
                type="number"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                min="1"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block mb-1 font-medium">Catégorie</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">Sélectionner</option>
                <option value="Entrée">Entrée</option>
                <option value="Plat principal">Plat principal</option>
                <option value="Dessert">Dessert</option>
                <option value="Boisson">Boisson</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            
            <div>
              <label htmlFor="image" className="block mb-1 font-medium">Image (URL)</label>
              <input
                id="image"
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Publier la recette
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
