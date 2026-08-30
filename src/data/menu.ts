/**
 * Datos del menú de BOB'S.
 *
 * Editá este archivo para actualizar nombres, descripciones, precios e
 * imágenes sin tocar la estructura de la web. Los precios son
 * PLACEHOLDERS ("$ —") ya que no se proveyeron precios reales: reemplazá
 * `price` en cada item por el valor real.
 *
 * `image` es opcional: si no se define, la web muestra un placeholder
 * elegante en su lugar. Cuando tengas la foto real, agregala en
 * /public/images/ y completá la ruta acá (ej: "/images/latte.jpg").
 */

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  tag?: string;
};

export type MenuCategoryId =
  | "coffee"
  | "breakfast"
  | "waffles"
  | "brunch"
  | "drinks"
  | "bakery";

export type MenuCategory = {
  id: MenuCategoryId;
  label: string;
  shortLabel: string;
  description: string;
  items: MenuItem[];
  image?: string;
};

const PLACEHOLDER_PRICE = "$ —";

export const menu: Record<MenuCategoryId, MenuCategory> = {
  coffee: {
    id: "coffee",
    label: "Café",
    shortLabel: "Café",
    description: "Café de especialidad, tostado en pequeños lotes.",
    items: [
      { id: "espresso", name: "Espresso", description: "Café intenso y aromático, base de nuestra carta.", price: PLACEHOLDER_PRICE },
      { id: "cortado", name: "Cortado", description: "Espresso cortado con un toque de leche texturizada.", price: PLACEHOLDER_PRICE },
      { id: "americano", name: "Americano", description: "Espresso alargado con agua caliente, cuerpo suave.", price: PLACEHOLDER_PRICE },
      { id: "cappuccino", name: "Cappuccino", description: "Espresso, leche texturizada y una fina capa de espuma.", price: PLACEHOLDER_PRICE },
      { id: "latte", name: "Latte", description: "Espresso con leche vaporizada, suave y cremoso.", price: PLACEHOLDER_PRICE },
      { id: "flat-white", name: "Flat White", description: "Doble espresso con microespuma de leche aterciopelada.", price: PLACEHOLDER_PRICE, tag: "Favorito" },
    ],
  },
  breakfast: {
    id: "breakfast",
    label: "Desayunos",
    shortLabel: "Desayunos",
    description: "Para arrancar el día con calma.",
    items: [
      { id: "clasico", name: "Desayuno Clásico", description: "Café + jugo de naranja + medialunas + manteca y mermelada.", price: PLACEHOLDER_PRICE },
      { id: "tostado-avocado", name: "Tostado de Palta", description: "Pan de masa madre, palta, huevo poché y semillas.", price: PLACEHOLDER_PRICE },
      { id: "bowl-yogur", name: "Bowl de Yogur", description: "Yogur natural, granola casera, frutos rojos y miel.", price: PLACEHOLDER_PRICE },
      { id: "huevos-revueltos", name: "Huevos Revueltos", description: "Huevos cremosos, ciboulette y pan de campo tostado.", price: PLACEHOLDER_PRICE },
    ],
  },
  waffles: {
    id: "waffles",
    label: "Waffles",
    shortLabel: "Waffles",
    description: "La firma de la casa, dulces y salados.",
    items: [
      { id: "waffle-clasico", name: "Waffle Clásico", description: "Con manteca, miel y azúcar impalpable.", price: PLACEHOLDER_PRICE },
      { id: "waffle-frutos-rojos", name: "Waffle de Frutos Rojos", description: "Crema chantilly, frutos rojos frescos y almíbar.", price: PLACEHOLDER_PRICE, tag: "Favorito" },
      { id: "waffle-banana-dulce-leche", name: "Waffle Banana & Dulce de Leche", description: "Banana caramelizada, dulce de leche y nueces.", price: PLACEHOLDER_PRICE },
      { id: "waffle-salado", name: "Waffle Salado", description: "Panceta crocante, huevo y almíbar de arce.", price: PLACEHOLDER_PRICE },
      { id: "waffle-nutella", name: "Waffle Nutella & Frutillas", description: "Nutella, frutillas frescas y almendras tostadas.", price: PLACEHOLDER_PRICE },
    ],
  },
  brunch: {
    id: "brunch",
    label: "Brunch",
    shortLabel: "Brunch",
    description: "Opciones dulces y saladas para compartir.",
    items: [
      { id: "avocado-toast", name: "Avocado Toast Completo", description: "Palta, tomates cherry, huevo, rúcula y semillas.", price: PLACEHOLDER_PRICE },
      { id: "sandwich-pollo", name: "Sándwich de Pollo Grillado", description: "Pollo grillado, queso brie, rúcula y mostaza miel.", price: PLACEHOLDER_PRICE },
      { id: "tabla-brunch", name: "Tabla BOB'S", description: "Selección de fiambres, quesos, frutas y pan casero.", price: PLACEHOLDER_PRICE, tag: "Para compartir" },
      { id: "omelette", name: "Omelette de Estación", description: "Vegetales de estación, queso y hierbas frescas.", price: PLACEHOLDER_PRICE },
    ],
  },
  drinks: {
    id: "drinks",
    label: "Bebidas",
    shortLabel: "Bebidas",
    description: "Frías, frescas y de estación.",
    items: [
      { id: "limonada", name: "Limonada de la Casa", description: "Limón, menta fresca y un toque de jengibre.", price: PLACEHOLDER_PRICE },
      { id: "jugo-naranja", name: "Jugo de Naranja Exprimido", description: "100% natural, exprimido al momento.", price: PLACEHOLDER_PRICE },
      { id: "iced-latte", name: "Iced Latte", description: "Espresso, leche fría y hielo.", price: PLACEHOLDER_PRICE },
      { id: "matcha-latte", name: "Matcha Latte", description: "Matcha ceremonial con leche a elección.", price: PLACEHOLDER_PRICE },
      { id: "smoothie-frutos-rojos", name: "Smoothie de Frutos Rojos", description: "Frutos rojos, banana y yogur.", price: PLACEHOLDER_PRICE },
    ],
  },
  bakery: {
    id: "bakery",
    label: "Pastelería",
    shortLabel: "Pastelería",
    description: "Pastelería de autor, horneada todos los días.",
    items: [
      { id: "medialunas", name: "Medialunas de Manteca", description: "Receta clásica, horneadas todas las mañanas.", price: PLACEHOLDER_PRICE },
      { id: "cookie", name: "Cookie de Chocolate", description: "Chocolate semiamargo y un centro bien tierno.", price: PLACEHOLDER_PRICE },
      { id: "cheesecake", name: "Cheesecake de Frutos Rojos", description: "Base de galleta, queso crema y coulis casero.", price: PLACEHOLDER_PRICE, tag: "Favorito" },
      { id: "carrot-cake", name: "Carrot Cake", description: "Bizcochuelo de zanahoria, frosting de queso crema.", price: PLACEHOLDER_PRICE },
      { id: "budin-limon", name: "Budín de Limón", description: "Húmedo, con glaseado de limón.", price: PLACEHOLDER_PRICE },
    ],
  },
};

export const menuCategoryOrder: MenuCategoryId[] = [
  "coffee",
  "breakfast",
  "waffles",
  "brunch",
  "drinks",
  "bakery",
];
