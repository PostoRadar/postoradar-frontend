export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="banner-error" role="alert">
      {message}
    </div>
  );
}
