-- Tony Stark Insert

INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES 
  ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Tony Stark Update

UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Tony Stark Delete

DELETE FROM public.account WHERE account_id = 1;

-- Description Update

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Select with Join

SELECT inv_make, inv_model, classification_name
FROM public.inventory
INNER JOIN public.classification
  ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';

-- Image Update

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

SELECT * FROM public.account;

SELECT * FROM public.inventory;

SELECT * FROM public.classification;