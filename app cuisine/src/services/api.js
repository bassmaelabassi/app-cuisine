// Service pour les appels API
const API_URL = "https://votre-api.com";

// Simulation de données pour le développement
const mockRecipes = [
  {
    id: "1",
    title: "Pâtes carbonara",
    description: "Un classique italien simple et délicieux",
    ingredients: ["Pâtes", "Lardons", "Crème fraîche", "Oeufs", "Parmesan"],
    instructions: "1. Cuire les pâtes...",
    cookingTime: 20,
    category: "Plat principal",
    image: "",
    author: "chef123",
    createdAt: "2023-01-15T10:00:00Z",
    likes: 24,
    comments: []
  },
  // Ajoutez d'autres recettes mockées si nécessaire
];

export const getAllRecipes = async () => {
  try {
    // En production: const response = await fetch(`${API_URL}/recipes`);
    // return await response.json();
    return mockRecipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

export const getRecipeById = async (id) => {
  try {
    // En production: const response = await fetch(`${API_URL}/recipes/${id}`);
    // return await response.json();
    return mockRecipes.find(recipe => recipe.id === id) || null;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw error;
  }
};

export const createRecipe = async (recipeData) => {
  try {
    // En production:
    // const response = await fetch(`${API_URL}/recipes`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(recipeData)
    // });
    // return await response.json();
    
    const newRecipe = {
      ...recipeData,
      id: `recipe_${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    return newRecipe;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
};

export const updateRecipe = async (id, recipeData) => {
  try {
    // En production:
    // const response = await fetch(`${API_URL}/recipes/${id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(recipeData)
    // });
    // return await response.json();
    
    return { ...recipeData, id };
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

export const deleteRecipe = async (id) => {
  try {
    // En production: await fetch(`${API_URL}/recipes/${id}`, { method: "DELETE" });
    return true;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};