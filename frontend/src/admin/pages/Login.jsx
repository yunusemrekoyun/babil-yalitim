// src/admin/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Basit sabit kullanıcı kontrolü
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/dashboard");
    } else {
      alert("Kullanıcı adı veya şifre yanlış");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-[350px]"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Admin Giriş</h2>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          className="w-full mb-4 p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          className="w-full mb-6 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;