export const dynamic = "force-static"; // ✨ теж примусово статична

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Page not found 😕</h1>
    </div>
  );
}
