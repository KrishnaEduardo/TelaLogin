import './BoasVindas.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsCookie from 'js-cookie';
import { BaseUser } from '../Users/types';

export const BoasVindas = () => {
  const [user, setUser] = useState<BaseUser | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    jsCookie.remove("user"); // Remove o usuário do cookie
    navigate("/"); // Redireciona para a página de login
  };

  useEffect(() => {
    // faz a verificação do cookie user
    const userFromCookie = jsCookie.get('user');
    
    if (userFromCookie) {
      try {
        const parsedUser = JSON.parse(userFromCookie);

        if (parsedUser && parsedUser.usuario && parsedUser.usuario.nome) {
          setUser(parsedUser.usuario); // se o nome existe, seta o user
        } else {
          navigate('/'); // manda pra pagina principal se não tiver logado
        }
      } catch (error) {
        console.error('Erro ao analisar o cookie:', error);
        navigate('/'); // manda pra pagina principal se tiver algum erro
      }
    } else {
      navigate('/'); // manda pra pagina principal se não existir o cookie do user
    }
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <div className='containerlogout'>
      <h1>Olá, {user.nome}!</h1> 
      <button className="logout" onClick={handleLogout}>
        Logout</button>
    </div>
  );
};