import { Link } from "react-router-dom";
import { Clock, Heart, MessageSquare } from "lucide-react";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/recipes/${recipe.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={recipe.image || "/placeholder-recipe.jpg"} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/recipes/${recipe.id}`} className="hover:underline">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
              {recipe.title}
            </h3>
          </Link>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
          <span className="flex items-center">
            <Clock size={14} className="mr-1" />
            {recipe.cookingTime} min
          </span>
          <span className="flex items-center">
            <Heart size={14} className="mr-1" />
            {recipe.likes || 0}
          </span>
          <span className="flex items-center">
            <MessageSquare size={14} className="mr-1" />
            {recipe.comments?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;