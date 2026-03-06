BEGIN;

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Add temporary UUID columns
ALTER TABLE trips ADD COLUMN uuid_id UUID DEFAULT uuid_generate_v4();

ALTER TABLE itinerary_items ADD COLUMN trip_uuid UUID;
ALTER TABLE reservations ADD COLUMN trip_uuid UUID;
ALTER TABLE expense ADD COLUMN trip_uuid UUID;
ALTER TABLE trip_collaborators ADD COLUMN trip_uuid UUID;

-- 3. Backfill UUIDs into related tables
UPDATE itinerary_items set trip_uuid = t.uuid_id FROM trips t WHERE itinerary_items.trip_id = t.id;
UPDATE reservations set trip_uuid = t.uuid_id FROM trips t WHERE reservations.trip_id = t.id;
UPDATE expense set trip_uuid = t.uuid_id FROM trips t WHERE expense.trip_id = t.id;
UPDATE trip_collaborators set trip_uuid = t.uuid_id FROM trips t WHERE trip_collaborators.trip_id = t.id;

-- Clean up orphans before dropping
DELETE FROM itinerary_items WHERE trip_uuid IS NULL;
DELETE FROM reservations WHERE trip_uuid IS NULL;
DELETE FROM expense WHERE trip_uuid IS NULL;
DELETE FROM trip_collaborators WHERE trip_uuid IS NULL;

-- 4. Drop the id column of trips with CASCADE to drop all dependent foreign key constraints
ALTER TABLE trips DROP COLUMN id CASCADE;

-- 5. Drop old foreign key columns
ALTER TABLE itinerary_items DROP COLUMN trip_id;
ALTER TABLE reservations DROP COLUMN trip_id;
ALTER TABLE expense DROP COLUMN trip_id;
ALTER TABLE trip_collaborators DROP COLUMN trip_id;

-- 6. Rename UUID columns to id / trip_id
ALTER TABLE trips RENAME COLUMN uuid_id TO id;
ALTER TABLE itinerary_items RENAME COLUMN trip_uuid TO trip_id;
ALTER TABLE reservations RENAME COLUMN trip_uuid TO trip_id;
ALTER TABLE expense RENAME COLUMN trip_uuid TO trip_id;
ALTER TABLE trip_collaborators RENAME COLUMN trip_uuid TO trip_id;

-- 7. Add Primary Key to trips(id)
ALTER TABLE trips ADD PRIMARY KEY (id);

-- 8. Add Foreign Keys referencing trips(id)
ALTER TABLE itinerary_items ADD CONSTRAINT fk_itinerary_items_trip_id FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE;
ALTER TABLE reservations ADD CONSTRAINT fk_reservations_trip_id FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE;
ALTER TABLE expense ADD CONSTRAINT fk_expense_trip_id FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE;
ALTER TABLE trip_collaborators ADD CONSTRAINT fk_trip_collaborators_trip_id FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE;

-- 9. Enforce Note Null mapping where needed
ALTER TABLE trip_collaborators ALTER COLUMN trip_id SET NOT NULL;

COMMIT;
