import { LoginForm } from '../../features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <div className="container">
      <div className="card">
        <h1>Entrar</h1>
        <LoginForm />
      </div>
    </div>
  );
}
