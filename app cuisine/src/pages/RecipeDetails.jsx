import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRecipeById, deleteRecipe, updateRecipe, addComment, deleteComment, updateComment } from "../services/recipeService";
import { Clock, User, ArrowLeft, PenTool, Trash2, Save, X, Heart, MessageCircle } from "lucide-react";
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
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
        setFormData(data);
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
        ingredients: [...prev.ingredients, currentIngredient.trim()],
      }));
      setCurrentIngredient("");
    }
  };

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
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
    if (!formData.instructions) newErrors.instructions = "Les instructions sont requises";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Mettre à jour la recette
      const updatedRecipe = await updateRecipe(id, formData);
      setRecipe(updatedRecipe);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur update:", error);
    }
  };

  // Fonctions pour les commentaires
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const commentData = {
          text: newComment,
          author: user.username,
          recipeId: id,
          date: new Date().toISOString()
        };
        
        const updatedRecipe = await addComment(id, commentData);
        setRecipe(updatedRecipe);
        setNewComment("");
        setShowCommentForm(false);
      } catch (error) {
        console.error("Erreur ajout commentaire:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
      try {
        const updatedRecipe = await deleteComment(id, commentId);
        setRecipe(updatedRecipe);
      } catch (error) {
        console.error("Erreur suppression commentaire:", error);
      }
    }
  };

  const startEditComment = (comment) => {
    setEditingComment({
      id: comment.id,
      text: comment.text
    });
  };

  const saveEditedComment = async () => {
    if (editingComment && editingComment.text.trim()) {
      try {
        const updatedRecipe = await updateComment(id, editingComment.id, editingComment.text);
        setRecipe(updatedRecipe);
        setEditingComment(null);
      } catch (error) {
        console.error("Erreur mise à jour commentaire:", error);
      }
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
              <div className="flex items-center mr-4">
                <User size={14} className="mr-1" /> {recipe.author}
              </div>
              <div className="flex items-center mr-4">
                <Clock size={14} className="ml-1 mr-1" /> {recipe.cookingTime} min
              </div>
              <div className="flex items-center mr-4">
                <Heart size={14} className="mr-1" /> {recipe.likes || 0}
              </div>
              <div className="flex items-center">
                <MessageCircle size={14} className="mr-1" /> {recipe.comments?.length || 0}
              </div>
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
            
            {/* Section Commentaires */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Commentaires ({recipe.comments?.length || 0})</h2>
                <button 
                  className="btn-primary flex items-center"
                  onClick={() => setShowCommentForm(true)}
                >
                  Ajouter un commentaire
                </button>
              </div>
              
              {showCommentForm && (
                <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <textarea
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 mb-2"
                    rows="3"
                    placeholder="Votre commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end gap-2">
                    <button 
                      className="btn-secondary"
                      onClick={() => setShowCommentForm(false)}
                    >
                      Annuler
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={handleAddComment}
                    >
                      Publier
                    </button>
                  </div>
                </div>
              )}
              
              {recipe.comments && recipe.comments.length > 0 ? (
                <div className="space-y-4">
                  {recipe.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">{comment.author}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {comment.author === user?.username && (
                          <div className="flex gap-2">
                            <button 
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => startEditComment(comment)}
                            >
                              Modifier
                            </button>
                            <button 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {editingComment && editingComment.id === comment.id ? (
                        <div>
                          <textarea
                            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 mb-2"
                            rows="2"
                            value={editingComment.text}
                            onChange={(e) => setEditingComment({...editingComment, text: e.target.value})}
                          ></textarea>
                          <div className="flex justify-end gap-2">
                            <button 
                              className="btn-secondary text-sm"
                              onClick={() => setEditingComment(null)}
                            >
                              Annuler
                            </button>
                            <button 
                              className="btn-primary text-sm"
                              onClick={saveEditedComment}
                            >
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p>{comment.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-500">Pas encore de commentaires. Soyez le premier à commenter!</p>
                </div>
              )}
            </div>
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
            className="input w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="input w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          <div>
            <div className="flex">
              <input
                type="text"
                placeholder="Nouvel ingrédient"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                className="input w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 mr-2"
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
            className="input w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            rows="5"
          />
          {errors.instructions && <p className="text-red-500 text-sm">{errors.instructions}</p>}
          
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

          <div className="flex space-x-4">
            <button type="submit" className="btn-primary flex items-center">
              <Save size={18} className="mr-2" /> Enregistrer
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary flex items-center">
              <X size={18} className="mr-2" /> Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RecipeDetails;