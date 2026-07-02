import { PostoForm } from '../../features/postos/components/PostoForm';

export function PostoNewPage() {
  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="card">
        <h1>Cadastrar posto</h1>
        <PostoForm />
      </div>
    </div>
  );
}
