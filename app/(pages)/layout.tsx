import { CornerNav } from "@/components/pages/corner-nav";
import { PageMotion } from "@/components/pages/motion";
import "./pages.css";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page" id="top">
      <CornerNav />
      {children}
      <PageMotion />
    </div>
  );
}
