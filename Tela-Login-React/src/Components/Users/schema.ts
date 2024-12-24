import * as yup from "yup";
import { InferType } from "yup";

export const cadastroSchema = yup.object({
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
  
export  const loginSchema = yup.object({
    email: yup
      .string()
      .email('O formato do e-mail está incorreto')
      .required('Por favor, preencha o seu email.'),
    senha: yup.string().required('Por favor, escolha a sua senha.'),
  });

export type CadastroData = InferType<typeof cadastroSchema>;
export type LoginData = InferType<typeof loginSchema>;