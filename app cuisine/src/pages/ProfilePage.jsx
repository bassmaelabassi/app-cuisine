import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getUserRecipes } from "../services/recipeService"
import { updateUserProfile } from "../services/authService"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import RecipeCard from "../components/RecipeCard"
import { Edit, Save, User, Loader, ChefHat, Star } from "lucide-react"

const ProfilePage = ({ user, setUser }) => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  })

  useEffect(() => {
    if (user?.id) {
      setLoading(true)
      getUserRecipes(user.id)
        .then((data) => {
          setRecipes(data || [])
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching user recipes:", error)
          setRecipes([])
          setLoading(false)
        })
    }
  }, [user])

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
      })
    }
  }, [user, editMode, reset])

  const onSubmit = async (data) => {
    setSavingProfile(true)
    try {
      const updatedUser = await updateUserProfile(user.id, {
        ...user,
        ...data,
      })
      setUser(updatedUser)
      setEditMode(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setSavingProfile(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">User not found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
        <Link to="/login" className="btn-primary mt-4 inline-block">
          Log In
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Profile Card */}
      <div className="card p-6 md:p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="flex items-center btn-outline">
              <Edit size={16} className="mr-1" />
              Edit Profile
            </button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                type="text"
                className={`form-input ${errors.username ? "border-red-500" : ""}`}
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
              />
              {errors.username && <p className="form-error">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? "border-red-500" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea
                id="bio"
                rows="4"
                className="form-input"
                placeholder="Tell us about yourself..."
                {...register("bio")}
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4 pt-2">
              <button type="button" className="btn-outline" onClick={() => setEditMode(false)} disabled={savingProfile}>Cancel</button>
              <button type="submit" className="btn-primary flex items-center" disabled={savingProfile}>
                {savingProfile ? (
                  <span className="flex items-center">
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 text-3xl font-bold mr-4">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Bio</h3>
              <p className="text-gray-700 dark:text-gray-300">{user.bio || "No bio provided yet."}</p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex space-x-8">
              <div className="flex items-center">
                <ChefHat size={18} className="mr-2 text-yellow-500 dark:text-yellow-400" />
                <span><strong>{recipes.length}</strong> Recipes</span>
              </div>
              <div className="flex items-center">
                <Star size={18} className="mr-2 text-pink-500 dark:text-pink-400" />
                <span>
                  <strong>{recipes.reduce((total, recipe) => total + (recipe.reviews?.length || 0), 0)}</strong> Reviews
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Recipes */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Recipes</h2>
          <Link to="/recipes/new" className="btn-primary flex items-center">
            <ChefHat size={16} className="mr-1" />
            New Recipe
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">You haven't added any recipes yet</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-500 mb-4">
              Start sharing your best dishes with the community!
            </p>
            <Link to="/recipes/new" className="btn-primary inline-flex items-center">
              <ChefHat size={16} className="mr-1" />
              Create Your First Recipe
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
