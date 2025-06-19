
import { ThemeToggle } from "./ThemeToggle";

export const AppHeader = () => {
  return (
    <div className="relative text-center mb-8">
      <div className="absolute top-0 right-0">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Professional Pantone Search
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        Advanced Pantone Solid Coated color tool with ΔE matching, palette management, and professional export options
      </p>
    </div>
  );
};
