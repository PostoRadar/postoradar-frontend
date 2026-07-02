import { RegisterForm } from '../../features/auth/components/RegisterForm';

export function RegisterPage() {
  return (
    <div className="container">
      <div className="card">
        <h1>Criar conta</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
