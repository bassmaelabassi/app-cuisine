const API_URL = process.env.REACT_APP_API_URL || "";

export const getAllRecipes = async () => {
  try {
    const response = await fetch(`${API_URL}/recipes`);
    if (!response.ok) {
      throw new Error(`Error fetching recipes: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Unable to fetch recipes.");
  }
};

export const getRecipeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/recipes/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching recipe by ID: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw new Error(`Unable to fetch recipe with ID ${id}`);
  }
};

export const createRecipe = async (recipeData) => {
  try {
    const newRecipe = {
      ...recipeData,
      id: `recipe_${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };
    return newRecipe;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw new Error("Unable to create recipe.");
  }
};

export const updateRecipe = async (id, recipeData) => {
  try {
    return { ...recipeData, id };
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw new Error(`Unable to update recipe with ID ${id}`);
  }
};

export const deleteRecipe = async (id) => {
  try {
    return true;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw new Error(`Unable to delete recipe with ID ${id}`);
  }
};
