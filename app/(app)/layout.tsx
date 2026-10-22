import { AppBar } from "@/components/app/app-bar";
import "./app.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <AppBar />
      <main className="canvas">{children}</main>
    </div>
  );
}
