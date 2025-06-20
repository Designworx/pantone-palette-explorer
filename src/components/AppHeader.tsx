
import { ThemeToggle } from "./ThemeToggle";

export const AppHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center mb-6">
        <ThemeToggle />
      </div>
      <h1 className="text-5xl font-semibold mb-6 text-foreground tracking-tight">
        Professional Pantone Search
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Advanced Pantone Solid Coated color tool with ΔE matching, palette management, and professional export options
      </p>
    </div>
  );
};
