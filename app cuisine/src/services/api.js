const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getAllRecipes = async () => {
  try {
    const response = await fetch(`${API_URL}/recipes`);
    if (!response.ok) throw new Error("Error fetching recipes");
    return await response.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

export const getRecipeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/recipes/${id}`);
    if (!response.ok) throw new Error("Error fetching recipe");
    return await response.json();
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
};

export const createRecipe = async (data) => {
  try {
    const response = await fetch(`${API_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error creating recipe");
    return await response.json();
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
};

export const updateRecipe = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error updating recipe");
    return await response.json();
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

export const deleteRecipe = async (id) => {
  try {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error deleting recipe");
    return true;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};