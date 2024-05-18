
DROP TABLE IF EXISTS public.inventory;
DROP TABLE IF EXISTS public.size;
DROP TABLE IF EXISTS public.product;
DROP TABLE IF EXISTS public.category;

CREATE TABLE public.category (
    "CategoryID" SERIAL PRIMARY KEY,
    "CategoryLabel" VARCHAR(255) NOT NULL,
    "SubCategoryLabel" VARCHAR(255) NOT NULL,
    "CreatedDt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastModifiedDt" TIMESTAMPTZ  NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.product (
    "ProductID" SERIAL PRIMARY KEY,
    "CategoryID" INT NOT NULL,
    "ProductName" VARCHAR(255) NOT NULL,
    "ProductBrand" VARCHAR(255) NOT NULL,
    "ProductDescription" TEXT NOT NULL,
    "ProductPrice" NUMERIC(10, 2) NOT NULL,
    "ImageFolder" VARCHAR(255) NOT NULL,
    "ImageLink" VARCHAR(255) NOT NULL,
    "CreatedDt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastModifiedDt" TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_product_CategoryID" FOREIGN KEY ("CategoryID") REFERENCES public.category ("CategoryID")
);

CREATE TABLE public.size (
    "SizeID" SERIAL PRIMARY KEY,
    "SizeLabel" VARCHAR(50) NOT NULL,
    "SizeDescription" TEXT NOT NULL,
    "CreatedDt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastModifiedDt" TIMESTAMPTZ  NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.inventory (
    "InventoryID" SERIAL PRIMARY KEY,
    "ProductID" INT NOT NULL,
    "SizeID" INT NOT NULL,
    "Quantity" INT NOT NULL,
    CONSTRAINT "fk_inventory_ProductID" FOREIGN KEY ("ProductID") REFERENCES public.product ("ProductID"),
    CONSTRAINT "fk_inventory_SizeID" FOREIGN KEY ("SizeID") REFERENCES public.size ("SizeID")
);


