import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const recipeToEdit = storedRecipes.find((recipe) => recipe.id === id);
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setDescription(recipeToEdit.description);
      setCategory(recipeToEdit.category);
    } else {
      navigate("/");
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const updatedRecipe = {
      id,
      title,
      description,
      category,
      createdAt: new Date().toISOString(), // يمكن تعديل الـ createdAt حسب الحاجة
    };

    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const updatedRecipes = storedRecipes.map((recipe) =>
      recipe.id === id ? updatedRecipe : recipe
    );
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));

    setLoading(false);
    navigate("/"); // العودة إلى الصفحة الرئيسية بعد التعديل
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold">Modifier la recette</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Titre</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium">Catégorie</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="Maroc">Maroc</option>
            <option value="Italie">Italie</option>
            <option value="Espagne">Espagne</option>
            <option value="Allemagne">Allemagne</option>
            <option value="Asie">Asie</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn-primary text-lg px-8 py-3"
          disabled={loading}
        >
          {loading ? "Modification en cours..." : "Modifier la recette"}
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
