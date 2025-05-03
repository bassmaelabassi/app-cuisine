// RecipeService.js (sans backend)
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
  }
];

export const getAllRecipes = async () => {
  return mockRecipes;
};

export const getRecipeById = async (id) => {
  return mockRecipes.find(recipe => recipe.id === id) || null;
};

export const createRecipe = async (recipeData) => {
  const newRecipe = {
    ...recipeData,
    id: `recipe_${Date.now()}`,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: []
  };
  mockRecipes.push(newRecipe);
  return newRecipe;
};

export const deleteRecipe = async (id) => {
  return true;
};
