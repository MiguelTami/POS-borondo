import React, { useState, useEffect } from "react";
import {
  type Product,
  type Category,
  type CreateProductDTO,
  productService,
  
} from "../services/product.service";
import {
  inventoryService,
  type Ingredient,
} from "../../inventory/services/inventory.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { IngredientPickerModal } from "./IngredientPickerModal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Trash2, Plus, ArrowRight } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  productToEdit?: Product;
  categories: Category[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  productToEdit,
  categories,
}) => {
  const [formData, setFormData] = useState<CreateProductDTO>({
    name: "",
    price: 0,
    categoryId: 0,
  });

  const [recipes, setRecipes] = useState<
    Array<{
      id?: number;
      ingredientId: number;
      quantityRequired: number;
      ingredientName?: string;
      unit?: string;
    }>
  >([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [isIngredientPickerOpen, setIsIngredientPickerOpen] = useState(false);
  const [quantity, setQuantity] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const data = await inventoryService.getAllIngredients();
      setIngredients(data.filter((i) => i.isActive));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: Number(productToEdit.price),
        categoryId: Number(productToEdit.categoryId),
      });
      // Siempre cargar recetas desde el backend para garantizar que traen IDs y datos completos.
      productService
        .getRecipes(productToEdit.id)
        .then((fetchedRecipes) => {
          setRecipes(
            fetchedRecipes.map((r) => ({
              id: r.id,
              ingredientId: r.ingredientId,
              quantityRequired: Number(r.quantityRequired),
              ingredientName: r.ingredient?.name,
              unit: r.ingredient?.unit,
            })),
          );
        })
        .catch((err) => console.error("Error fetching recipes", err));
    } else {
      setFormData({
        name: "",
        price: 0,
        categoryId: categories.length > 0 ? categories[0].id : 0,
      });
      setRecipes([]);
    }
  }, [productToEdit, categories]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "categoryId" ? Number(value) : value,
    }));
  };

  const handleAddRecipe = () => {
    if (!selectedIngredient || !quantity || Number(quantity) <= 0) return;

    const ingredientId = Number(selectedIngredient);
    const existing = recipes.find((r) => r.ingredientId === ingredientId);
    if (existing) {
      setError("Este ingrediente ya está agregado a la receta.");
      return;
    }

    const ingDetails = ingredients.find((i) => i.id === ingredientId);

    setRecipes([
      ...recipes,
      {
        ingredientId,
        quantityRequired: Number(quantity),
        ingredientName: ingDetails?.name,
        unit: ingDetails?.unit,
      },
    ]);

    setSelectedIngredient("");
    setQuantity("");
    setError(null);
  };

  const handleRemoveRecipe = (index: number) => {
    const newRecipes = [...recipes];
    newRecipes.splice(index, 1);
    setRecipes(newRecipes);
  };

  const handleUpdateRecipeQuantity = (index: number, newQuantity: string) => {
    const newRecipes = [...recipes];
    newRecipes[index].quantityRequired = Number(newQuantity);
    setRecipes(newRecipes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price < 0 || formData.categoryId === 0) {
      setError("Por favor completa todos los campos del producto.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let productId = productToEdit?.id;

      if (productToEdit) {
        await productService.updateProduct(productId!, formData);
      } else {
        const created = await productService.createProduct(formData);
        productId = created.id;
      }

      // Sync recipes
      if (productToEdit && productId) {
        const oldRecipes = await productService.getRecipes(productId);
        const toDelete = oldRecipes.filter(
          (oldR) => !recipes.find((newR) => newR.id === oldR.id),
        );

        for (const delR of toDelete) {
          await productService.deleteRecipe(delR.id);
        }

        const toUpdate = recipes.filter(
          (newR) =>
            newR.id &&
            oldRecipes.find(
              (oldR) =>
                oldR.id === newR.id &&
                Number(oldR.quantityRequired) !== Number(newR.quantityRequired),
            ),
        );

        for (const updR of toUpdate) {
          await productService.updateRecipe(updR.id!, {
            quantityRequired: updR.quantityRequired,
          });
        }

        const toCreate = recipes.filter((r) => !r.id);
        for (const mkR of toCreate) {
          await productService.createRecipe(productId, {
            ingredientId: mkR.ingredientId,
            quantityRequired: mkR.quantityRequired,
          });
        }
      } else if (productId) {
        for (const r of recipes) {
          await productService.createRecipe(productId, {
            ingredientId: r.ingredientId,
            quantityRequired: r.quantityRequired,
          });
        }
      }

      onSaved();
    } catch (err: any) {
      console.error(err);

      const responseData = err?.response?.data;
      let errorMsg =
        responseData?.message ||
        responseData?.error ||
        err.message ||
        "Error desconocido al guardar el producto.";

      if (responseData?.errors && Array.isArray(responseData.errors)) {
        const validationDetails = responseData.errors
          .map((e: any) => `[${e.path}]: ${e.message}`)
          .join(", ");
        errorMsg += ` - Detalles: ${validationDetails}`;
      }

      setError(`Error del servidor: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-[90vw] md:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {productToEdit ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio Venta</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                disabled={loading}
                required
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoría</Label>
              <select
                id="categoryId"
                name="categoryId"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value={0} disabled>
                  Selecciona una categoría
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t pt-2">
            <div className="mb-2">
              <h3 className="font-semibold text-lg text-gray-800 mb-0">
                Ingredientes (Receta)
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Agrega los ingredientes que se descontarán cuando se venda este
                producto.
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200 flex flex-col md:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <Label className="mb-2 block text-xs font-bold text-gray-500">
                  Ingrediente
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 justify-start bg-white text-left font-normal"
                    onClick={() => setIsIngredientPickerOpen(true)}
                  >
                    {selectedIngredient
                      ? ingredients.find(
                          (i) => i.id === Number(selectedIngredient),
                        )?.name
                      : "Buscar Ingrediente..."}
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-32">
                <Label className="mb-2 block text-xs font-bold text-gray-500">
                  Cantidad req.
                </Label>
                <Input
                  type="number"
                  step="0.001"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Ej. 0.5"
                  className="bg-white border-gray-200"
                />
              </div>
              <Button
                type="button"
                onClick={handleAddRecipe}
                className="w-full md:w-auto bg-gray-800 hover:bg-gray-900 text-white shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" /> Agregar
              </Button>
            </div>

            {recipes.length > 0 ? (
              <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="h-[25vh] min-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#f8f9fc] text-xs uppercase text-gray-500 font-bold border-b border-gray-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3">Ingrediente</th>
                        <th className="px-4 py-3">Cantidad</th>
                        <th className="px-4 py-3">Unidad</th>
                        <th className="px-4 py-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recipes.map((r, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 transition-colors odd:bg-white even:bg-gray-50/70"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {r.ingredientName}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            <Input
                              type="number"
                              step="0.001"
                              value={r.quantityRequired}
                              onChange={(e) =>
                                handleUpdateRecipeQuantity(i, e.target.value)
                              }
                              className="w-24 h-8 bg-white border-gray-200"
                            />
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {r.unit || "-"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveRecipe(i)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-400 py-6 bg-white border border-dashed rounded-xl">
                Aún no se han agregado ingredientes.
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="text-gray-600 font-medium bg-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center shadow-sm"
            >
              {loading ? (
                "Guardando..."
              ) : (
                <React.Fragment>
                  Guardar Producto <ArrowRight className="h-4 w-4 ml-2" />
                </React.Fragment>
              )}
            </Button>
          </DialogFooter>
        </form>

        {isIngredientPickerOpen && (
          <IngredientPickerModal
            isOpen={isIngredientPickerOpen}
            onClose={() => setIsIngredientPickerOpen(false)}
            availableIngredients={ingredients}
            onSelectIngredient={(ingredient) => {
              setSelectedIngredient(ingredient.id.toString());
              setIsIngredientPickerOpen(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
