import { useState } from 'react';
import './TelaLogin.css';
import { useForm } from 'react-hook-form';
import user_icon from '../../assets/user.png'
import email_icon from '../../assets/email.png';
import senha_icon from '../../assets/senha.png'
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import jsCookie from 'js-cookie';
import { toast } from 'react-hot-toast';
import { cadastroSchema, loginSchema, CadastroData, LoginData } from '../Users/schema';

export const TelaLogin = () => {
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`
  const [action, setAction] = useState<'Login' | 'Cadastre-se'>('Login');
  const navigate = useNavigate(); 

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CadastroData | LoginData>({
    resolver: yupResolver(action === 'Login' ? loginSchema : cadastroSchema),
    mode: 'onBlur',
  });


  const onSubmit = async (data: CadastroData | LoginData) => {
    if (action === 'Login') {
      try {
        const response = await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          jsCookie.set('user', JSON.stringify(result)); // guarda os dados do user no cookie
          toast.success(`Bem-vindo, ${result.usuario.nome}`);
          navigate('/welcome'); // manda pra /welcome
          reset();
        } else {
          toast.error(`Erro no login: ${result.message}`);
        }
      } catch (error) {
        toast.error('Erro ao fazer login. Tente novamente mais tarde.');
      }
    } else {
      // caso seja cadastro
      try {
        const response = await fetch(`${BASE_URL}/cadastro`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          jsCookie.set('user', JSON.stringify(result)); // guarda os dados do user no cookie
          toast.success("Cadastro bem-sucedido!");
          reset();
          setAction('Login')
        } else {
          toast.error(`Erro no cadastro: ${result.message}`);
        }
      } catch (error) {
        toast.error('Erro ao cadastrar. Tente novamente mais tarde.');
      }
    }
  };

  const handleActionChange = (newAction: 'Login' | 'Cadastre-se') => {
    if (newAction !== action) {
      setAction(newAction);
      reset(); 
    }
  };

  const ifCadastro = () => {
  if (action === 'Cadastre-se') {
    handleSubmit(onSubmit)(); // envia o formulário se a ação for = 'Cadastre-se'
  } else {
    handleActionChange('Cadastre-se');
  }
};

const ifLogin = () => {
  if (action === 'Login') {
    handleSubmit(onSubmit)(); // envia o formulário se a ação for = 'Cadastre-se'
  } else {
    handleActionChange('Login');
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='container'>
        <div className='header'>
          <div className='text'>{action}</div>
          <div className='underline'></div>
        </div>
        <div className='inputs'>
          {action === 'Login' ? (
            <div></div>
          ) : (
            <div className='input'>
              <img src={user_icon} alt='' />
              <input type='text' placeholder='Nome' {...register('nome')} />
              {(errors as any)?.nome && <p>{(errors as any)?.nome.message}</p>}
            </div>
          )}
          <div className='input'>
            <img src={email_icon} alt='' />
            <input type='email' placeholder='Email' {...register('email')} />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className='input'>
            <img src={senha_icon} alt='' />
            <input type='password' placeholder='Senha' {...register('senha')} />
            {errors.senha && <p>{errors.senha.message}</p>}
          </div>
        </div>
        {action === 'Cadastre-se' ? (
          <div></div>
        ) : (
          <div className='esqueceu-senha'>
            Esqueceu a senha? <span>Clique Aqui!</span>
          </div>
        )}
        <div className='submit-container'>
          <div
            className={action === 'Login' ? 'submit gray' : 'submit'}
            onClick={ifCadastro}
          >
            Cadastre-se
          </div>
          <div
            className={action === 'Cadastre-se' ? 'submit gray' : 'submit'}
            onClick={ifLogin}
          >
            Login
          </div>
        </div>
      </div>
    </form>
  );
};
