import { useState } from 'react';
import { API_ENDPOINTS } from '../services/api'; // Importa os links
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useAuth = () => {
    const { login } = useAuthContext();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '', telefone: '', email: '', senha: '', confirmarSenha: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ nome: '', telefone: '', email: '', senha: '', confirmarSenha: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const url = isLogin ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.REGISTER;

        const payload = isLogin
            ? {
                Email: formData.email,
                Password: formData.senha
            }
            : {
                Name: formData.nome,
                Email: formData.email,
                Password: formData.senha,
                ContirmPassword: formData.confirmarSenha, // Note: Backend typo "ContirmPassword"
                Phone: formData.telefone
            };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'bypass-tunnel-reminder': 'true' ,
                    },
                body: JSON.stringify(payload),
            });

            // Handle non-JSON responses (like 401 plaintext)
            const contentType = response.headers.get("content-type");
            let data;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (response.ok) {
                const token = typeof data === 'string' ? data : data.token;

                const user = login(token); // login now returns user data
                toast.success(isLogin ? "Sucesso no Login!" : "Registo concluído!");

                // Check GameMake property (handling case sensitivity and string/boolean types)
                const gameMake = user.GameMake === 'true' || user.gamemake === 'true' || user.GameMake === true || user.gamemake === true;

                if (gameMake) {
                    navigate('/');
                } else {
                    navigate('/gamemake');
                }
            } else {
                console.error("Login/Register Error Response:", data);

                let errorMessage = "Erro na operação.";

                if (typeof data === 'string') {
                    errorMessage = data; // Plain text error
                } else if (typeof data === 'object') {
                    if (data.message) {
                        errorMessage = data.message;
                    } else if (data.errors) {
                        // ASP.NET Validation errors
                        errorMessage = Object.values(data.errors).flat().join('\n');
                    } else if (data.title) {
                        // ProblemDetails title
                        errorMessage = data.title;
                    } else {
                        // Fallback
                        errorMessage = JSON.stringify(data);
                    }
                }

                toast.error(errorMessage || "Erro desconhecido.");
            }
        } catch (err) {
            console.error("Auth Exception:", err);

            toast.error("Erro ao conectar ao servidor. Verifique se o backend está ligado.");
        } finally {
            setLoading(false);
        }
    };

    return { isLogin, formData, loading, handleChange, toggleMode, handleSubmit };
};