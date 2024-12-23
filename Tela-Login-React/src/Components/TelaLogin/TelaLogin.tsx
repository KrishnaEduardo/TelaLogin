import { useState } from 'react';
import './TelaLogin.css';
import { useForm } from 'react-hook-form';
import user_icon from '../Assets/user.png';
import email_icon from '../Assets/email.png';
import senha_icon from '../Assets/senha.png';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InferType } from 'yup';
import { useNavigate } from 'react-router-dom';
import jsCookie from 'js-cookie';
import { toast } from 'react-hot-toast';

const cadastroSchema = yup.object({
  nome: yup.string().required('Por favor, preencha o seu nome.'),
  email: yup
    .string()
    .email('O formato do e-mail está incorreto')
    .required('Por favor, preencha o seu email.'),
  senha: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .required('Por favor, escolha a sua senha.'),
});

const loginSchema = yup.object({
  email: yup
    .string()
    .email('O formato do e-mail está incorreto')
    .required('Por favor, preencha o seu email.'),
  senha: yup.string().required('Por favor, escolha a sua senha.'),
});

type CadastroData = InferType<typeof cadastroSchema>;
type LoginData = InferType<typeof loginSchema>;

export const TelaLogin = () => {
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
        const response = await fetch('http://localhost:8001/login', {
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
        const response = await fetch('http://localhost:8001/cadastro', {
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
            onClick={() => {
              if (action === 'Cadastre-se') {
                handleSubmit(onSubmit)(); // envia o formulario se a ação for = cadastre-se
              }
              handleActionChange('Cadastre-se');
            }}
          >
            Cadastre-se
          </div>
          <div
            className={action === 'Cadastre-se' ? 'submit gray' : 'submit'}
            onClick={() => {
              if (action === 'Login') {
                handleSubmit(onSubmit)(); // envia o formulario se a ação for = login
              }
              handleActionChange('Login');
            }}
          >
            Login
          </div>
        </div>
      </div>
    </form>
  );
};
