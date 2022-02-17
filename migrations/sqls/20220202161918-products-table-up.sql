CREATE TABLE products (
      id SERIAL PRIMARY KEY, 
      name VARCHAR NOT NULL, 
      price NUMERIC NOT NULL,
      cost NUMERIC, 
      boh INTEGER,
      for_sale BOOLEAN NOT NULL,
      category VARCHAR,
      description TEXT, 
      measurments VARCHAR, 
      owner VARCHAR, 
      sku VARCHAR(100), 
      size_family VARCHAR(64),
      size VARCHAR(64), 
      brand VARCHAR(100),
      condition VARCHAR, 
      instructions TEXT,
      country_origin VARCHAR(100), 
      rn_num VARCHAR(20), 
      weight_grams REAL,
      tags VARCHAR,
      location_id BIGINT REFERENCES locations(id)
);

INSERT INTO products (name, cost, price, for_sale)
    VALUES ('Leather Bag Red', 11, 19, FALSE),
            ('Silk Green/Blue Shirt', 7, 29.99, FALSE),
            ('Baseball Cap', 1, 7, FALSE),
            ('Winter gloves', 4, 15, FALSE);

INSERT INTO products (name, price, cost, boh, for_sale, category,
      description, 
      measurments, 
      owner, sku, size_family, size, 
      brand, condition, instructions, country_origin, tags, rn_num,location_id)
   VALUES ('Black Crossbody Purse', 19, 40, 4, TRUE, 'Women / Bags / Crossbody',
            'Black animal-free leather crossbody purse with a 20 inch strap, 4x6 inch outer zip pocket, 4x6 inch inner zip pocket, and a main bag size of 10.5x8x2.5 inches.',
            '10.5 x 8 x 2.5 in', 'Mona Parker', null, 'Women', 'OS', 
            null, 'Used', 'Hand wash only', null, null, null, (SELECT id FROM locations WHERE name='Home')),
          
          ('Women''s Medium (M) City Girl by Nancy Bolen Jacket and Vest Combination', 41, 78, 1, TRUE, 'Women / Jackets / Vests',
            'Women''s Medium (M) Black with Cheetah Print and Gold Embellishments City Girl by Nancy Bolen Jacket and Vest Combination Pre-Owned, Good Condition JACKET: (41" Bust ) x (25" tall) x (12.5" sleeve hole diameter) x (15.5" long sleeve with 1.5" cuff) | VEST: (40" Bust) x (16" long with 3" hem) x (11" sleeve hole) 10.5 x 8 x 2.5 in', 
            'JACKET: (41" Bust ) x (25" tall) x (12.5" sleeve hole diameter) x (15.5" long sleeve with 1.5" cuff) | VEST: (40" Bust) x (16" long with 3" hem) x (11" sleeve hole) 10.5 x 8 x 2.5 in,', 
            'CM', null, 'Women', 'M', 
            'City Girl by Nancy Bolen', 'Pre-Owned / Good ', null, null, 'Western, Animal Print, Gold', null,  (SELECT id FROM locations WHERE name='Home')),
          
          ('Vintage W 12P Teal Pleated P.C.F Petites by Hal Fernan Long Sleeved Dress', 58, 71, 1, TRUE, 'Women / Dresses / Long Sleeve',
            'Vintage Women''s Petites 12P Teal Aquamarine Blue Green Pressed Pleated P.C.F Petites styled by Hal Ferman Long Sleeved Dresss Pre-Owned, Good Condition | Hand Wash Separately. Use Mild Soap. in Lukewarm Water. Drip or Tumble Dry. Do Not Use BLeach. | 🇺🇸 MADE IN THE USA 🇺🇸 Int. Ladies Garment Workers Union Union Made ILGWU AFL CIO (14" shoulder - shoulder with pads) x (18" pit - pit) x (14" Sleeve with 2" cuff & 9.5" sleeve hole) x (41" Ht. with 1.5" collar & 6" slit from top of neck down fastened with buttons) with 2" wide detachable belt tie to tighten.',
            '(14" shoulder - shoulder with pads) x (18" pit - pit) x (14" Sleeve with 2" cuff & 9.5" sleeve hole) x (41" Ht. with 1.5" collar & 6" slit from top of neck down fastened with buttons) with 2" wide belt',
            'CM', null, 'Women', '12P', 
            'Hal Fernan', 'Pre-Owned / Good ', 'Use Mild Soap. in Lukewarm Water. Drip or Tumble Dry. Do Not Use Bleach', 'USA', 'Pleated, Vintage, Classic', null,  (SELECT id FROM locations WHERE name='Home')),

          ('Vintage Women''s Petite Red with Black Trim Sag Harbor Blazer', 26, 48, 1, TRUE, 'Women / Jackets / Blazers / Suits',
            'Vintage Women''s Petite Red with Black Trim Sag Harbor Blazer 100% Wool | Pre-Owned, OK Condition (45" Bust) x (27" Long with 3" collar) x (9.5" Sleeve Hole) x (17.5" Sleeve)',
            '(45" Bust) x (27" Long with 3" collar) x (9.5" Sleeve Hole) x (17.5" Sleeve)',
            'CM', null, 'Women', 'MP', 
            'Sag Harbor', 'Pre-Owned / OK ', null, null, 'Wool, Vintage, Classic',  null, (SELECT id FROM locations WHERE name='Home')),

          ('WM Black Christmas Red White Holiday Wine Shirt unbranded Long Sleeve Soft Top', 19, 27, 2, TRUE, 'Women / Tops / Tees / Long Sleeve',
            'Women''s M Black with Christmas Red and White Holiday Wine Shirt unbranded Long Sleeved Shirt Ultra Soft Top V-Neck Blouse Pre-Owned, Like New (16" shoulder - shoulder) x (20.5" pit - pit) x (17.5" Sleeve with .75" cuff & 8" sleeve hole) stretchy and soft!',
            '(16" shoulder - shoulder) x (20.5" pit - pit) x (17.5" Sleeve with .75" cuff & 8" sleeve hole)',
            'MGD', null, 'Women', 'M', 
            null, 'Pre-Owned / Like-New', null, null, 'Comfy / Stretchy / Christmas', null, (SELECT id FROM locations WHERE name='Home')),
      
          ('Vintage Women''s Petite 12P Red Pants Sag Harbor Trousers with pockets!', 16, 33, 3, TRUE, 'Women / Pants / Trousers ',
            'Vintage Women''s Petite 12P Red Pants Sag Harbor Trousers with two (2) pockets! SHELL: 100% Pure New Wool - Woolmark LINING: 100% Polyester | Pre-Owned, Good Condition | Dry Clean Only. | mexico | RN#51735 (15.5" Waist) x (21" Hip) x (37" Long + 1" elastic waistband) x (27" Inseam) with 7" sipper and single red button to close',
            '(15.5" Waist) x (21" Hip) x (37" Long + 1" elastic waistband) x (27" Inseam) with 7" zipper',
            'CM', null, 'Women', 'M', 
            null, 'Pre-Owned / Good', 'Dry Clean Only', 'Mexico', 'Vintage / Wool / Classic', 51735, (SELECT id FROM locations WHERE name='Home'));

