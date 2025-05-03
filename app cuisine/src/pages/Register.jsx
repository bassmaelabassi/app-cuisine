import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Nom requis";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Min 6 caractères";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      setSuccessMessage("Inscription réussie !");
      setIsLoading(false);
      setTimeout(() => navigate("/login"), 1500);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Créer un compte</h2>

        {successMessage && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" placeholder="Nom" value={formData.username} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.username ? "border-red-500" : ""}`} />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : ""}`} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <div className="relative">
            <input name="password" placeholder="Mot de passe" type={showPassword ? "text" : "password"}
              value={formData.password} onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.password ? "border-red-500" : ""}`} />
            <button type="button" className="absolute right-2 top-2" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <div className="relative">
            <input name="confirmPassword" placeholder="Confirmer le mot de passe" type={showPasswordConfirm ? "text" : "password"}
              value={formData.confirmPassword} onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.confirmPassword ? "border-red-500" : ""}`} />
            <button type="button" className="absolute right-2 top-2" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
              {showPasswordConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

          <button disabled={isLoading} type="submit" className="w-full bg-rose-600 text-white py-2 rounded">
            {isLoading ? "Enregistrement..." : <><UserPlus className="inline mr-2" size={16} /> S'inscrire</>}
          </button>
        </form>

        <p className="mt-4 text-center">
          Déjà inscrit ?{" "}
          <Link to="/login" className="text-rose-600 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
