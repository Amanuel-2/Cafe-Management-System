import { ChefHat, List, UtensilsCrossed } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { menuService } from '../../services/menuService';
import { recipeService } from '../../services/recipeService';
import { useMemo } from 'react';

export function RecipesPage() {
  const recipes = recipeService.list();
  const menuItems = menuService.list();
  const menuItemMap = useMemo(() => new Map(menuItems.map((m) => [m.id, m])), [menuItems]);
  const totalRecipes = recipes.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">Recipes</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Connect menu items to preparation notes and ingredient usage.</p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Recipes" value={String(totalRecipes)} change="Menu items documented" Icon={ChefHat} />
        <StatCard label="Ingredients" value={String(new Set(recipes.flatMap((recipe) => recipe.ingredients)).size)} change="Unique ingredients" Icon={List} />
        <StatCard label="Prep steps" value={String(recipes.reduce((total, recipe) => total + recipe.ingredients.length, 0))} change="Recipe components" Icon={UtensilsCrossed} />
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe) => {
          const menuItem = menuItemMap.get(recipe.menuItemId);
          return (
            <Card key={recipe.id} className="overflow-hidden">
              {menuItem && <img src={menuItem.image} alt={recipe.name} className="h-36 w-full object-cover" />}
              <div className="space-y-4 p-4">
                <div>
                  <h3 className="font-semibold text-stone-950 dark:text-stone-50">{recipe.name}</h3>
                  <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{menuItem?.name || 'Unlinked'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <Badge key={idx} variant="neutral">{ingredient}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
