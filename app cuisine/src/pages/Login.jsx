import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, LogIn, UserCog, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format d'email invalide";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 6) newErrors.password = "Le mot de passe doit avoir au moins 6 caractères";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    setTimeout(() => {
      const userData = {
        id: "user123",
        email: formData.email,
        username: formData.email.split("@")[0],
        role: formData.role
      };

      login(userData);
      navigate(formData.role === "admin" ? "/admin-dashboard" : "/");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-center mb-4">Bienvenue</h1>

        {errors.form && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{errors.form}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <input name="email" value={formData.email} onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : ""}`}
              type="email" placeholder="email@example.com" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label>Mot de passe</label>
            <div className="relative">
              <input name="password" value={formData.password} onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.password ? "border-red-500" : ""}`}
                type={showPassword ? "text" : "password"} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-gray-500">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, role: "user" }))}
              className={`p-2 border rounded-md flex-1 ${formData.role === "user" ? "bg-rose-100" : ""}`}>
              <User className="inline mr-1" size={16} /> Utilisateur
            </button>
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, role: "admin" }))}
              className={`p-2 border rounded-md flex-1 ${formData.role === "admin" ? "bg-rose-100" : ""}`}>
              <UserCog className="inline mr-1" size={16} /> Admin
            </button>
          </div>

          <button disabled={isLoading} type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md">
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-rose-600 hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
