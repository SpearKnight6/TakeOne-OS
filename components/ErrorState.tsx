export function ErrorState({ message }: { message: string }) {
  return <p className="badge red">{message}</p>;
}
