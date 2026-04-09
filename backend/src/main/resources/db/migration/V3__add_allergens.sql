CREATE TABLE allergens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE menu_item_allergens (
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    allergen_id UUID NOT NULL REFERENCES allergens(id) ON DELETE CASCADE,
    PRIMARY KEY (menu_item_id, allergen_id)
);

CREATE INDEX idx_menu_item_allergens_menu_item_id ON menu_item_allergens(menu_item_id);
CREATE INDEX idx_menu_item_allergens_allergen_id ON menu_item_allergens(allergen_id);

INSERT INTO allergens (name) VALUES
('dairy'),
('gluten'),
('nuts'),
('soy'),
('eggs');

-- Tag dairy drinks: Cappuccino, Latte, Caramel Macchiato, Flat White, Matcha Latte, Chai Latte
INSERT INTO menu_item_allergens (menu_item_id, allergen_id)
SELECT mi.id, a.id
FROM menu_items mi
CROSS JOIN allergens a
WHERE a.name = 'dairy'
  AND mi.name IN ('Cappuccino', 'Latte', 'Caramel Macchiato', 'Flat White', 'Matcha Latte', 'Chai Latte');

-- Tag pastries with dairy and gluten: Croissant, Blueberry Muffin, Chocolate Chip Cookie, Scone, Bagel with Cream Cheese, Brownie
INSERT INTO menu_item_allergens (menu_item_id, allergen_id)
SELECT mi.id, a.id
FROM menu_items mi
CROSS JOIN allergens a
WHERE a.name IN ('dairy', 'gluten')
  AND mi.name IN ('Croissant', 'Blueberry Muffin', 'Chocolate Chip Cookie', 'Scone', 'Bagel with Cream Cheese', 'Brownie');

-- Tag pastries with eggs (NOT Bagel with Cream Cheese): Croissant, Blueberry Muffin, Chocolate Chip Cookie, Scone, Brownie
INSERT INTO menu_item_allergens (menu_item_id, allergen_id)
SELECT mi.id, a.id
FROM menu_items mi
CROSS JOIN allergens a
WHERE a.name = 'eggs'
  AND mi.name IN ('Croissant', 'Blueberry Muffin', 'Chocolate Chip Cookie', 'Scone', 'Brownie');
