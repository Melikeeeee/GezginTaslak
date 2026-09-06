-- ==============================================================================
-- GEZGIN DATABASE INITIAL SCHEMA MIGRATION
-- ==============================================================================

-- 1. EXTENSIONS & TYPES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE public.place_category AS ENUM (
        'historical',
        'museum',
        'restaurant',
        'cafe',
        'nature',
        'shopping',
        'activity',
        'viewpoint',
        'culture'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.trip_type AS ENUM ('day_trip', 'multi_day');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.trip_pace AS ENUM ('relaxed', 'balanced', 'intense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.trip_budget AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Automatic Profile Creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url, bio)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', 'Traveler'),
        NEW.raw_user_meta_data->>'avatar_url',
        NULL
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. DESTINATIONS TABLE
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER set_destinations_updated_at
    BEFORE UPDATE ON public.destinations
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 5. PLACES TABLE
CREATE TABLE IF NOT EXISTS public.places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    category public.place_category NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    opening_hours TEXT NOT NULL,
    price_level SMALLINT NOT NULL CHECK (price_level BETWEEN 1 AND 4),
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 0.0 AND rating <= 5.0),
    image_url TEXT NOT NULL,
    estimated_visit_minutes INTEGER NOT NULL CHECK (estimated_visit_minutes > 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT places_destination_slug_unique UNIQUE (destination_id, slug)
);

CREATE TRIGGER set_places_updated_at
    BEFORE UPDATE ON public.places
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_places_destination_active ON public.places(destination_id, is_active);
CREATE INDEX IF NOT EXISTS idx_places_category ON public.places(category);

-- 6. TRIPS TABLE
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    trip_type public.trip_type NOT NULL DEFAULT 'day_trip',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME WITHOUT TIME ZONE,
    end_time TIME WITHOUT TIME ZONE,
    pace public.trip_pace NOT NULL DEFAULT 'balanced',
    budget_level public.trip_budget NOT NULL DEFAULT 'medium',
    transport_mode TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT trips_date_check CHECK (end_date >= start_date)
);

CREATE TRIGGER set_trips_updated_at
    BEFORE UPDATE ON public.trips
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);

-- 7. TRIP_DAYS TABLE
CREATE TABLE IF NOT EXISTS public.trip_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    trip_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT trip_days_trip_date_unique UNIQUE (trip_id, trip_date)
);

CREATE TRIGGER set_trip_days_updated_at
    BEFORE UPDATE ON public.trip_days
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_trip_days_trip_id ON public.trip_days(trip_id);

-- 8. TRIP_STOPS TABLE
CREATE TABLE IF NOT EXISTS public.trip_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_day_id UUID NOT NULL REFERENCES public.trip_days(id) ON DELETE CASCADE,
    place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    start_time TIME WITHOUT TIME ZONE,
    duration_minutes INTEGER CHECK (duration_minutes IS NULL OR duration_minutes > 0),
    position INTEGER NOT NULL CHECK (position >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT trip_stops_day_position_unique UNIQUE (trip_day_id, position) DEFERRABLE INITIALLY DEFERRED
);

CREATE TRIGGER set_trip_stops_updated_at
    BEFORE UPDATE ON public.trip_stops
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_trip_stops_day_pos ON public.trip_stops(trip_day_id, position);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Destinations Policies (Read-only for public, admin write)
DROP POLICY IF EXISTS "Destinations are viewable by everyone" ON public.destinations;
CREATE POLICY "Destinations are viewable by everyone"
    ON public.destinations FOR SELECT USING (true);

-- Places Policies (Only active places are publicly viewable)
DROP POLICY IF EXISTS "Active places are viewable by everyone" ON public.places;
CREATE POLICY "Active places are viewable by everyone"
    ON public.places FOR SELECT USING (is_active = true);

-- Trips Policies (Strict User Isolation)
DROP POLICY IF EXISTS "Users can view their own trips" ON public.trips;
CREATE POLICY "Users can view their own trips"
    ON public.trips FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own trips" ON public.trips;
CREATE POLICY "Users can create their own trips"
    ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own trips" ON public.trips;
CREATE POLICY "Users can update their own trips"
    ON public.trips FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own trips" ON public.trips;
CREATE POLICY "Users can delete their own trips"
    ON public.trips FOR DELETE USING (auth.uid() = user_id);

-- Trip Days Policies
DROP POLICY IF EXISTS "Users can view trip days of their trips" ON public.trip_days;
CREATE POLICY "Users can view trip days of their trips"
    ON public.trip_days FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = trip_days.trip_id AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert trip days into their trips" ON public.trip_days;
CREATE POLICY "Users can insert trip days into their trips"
    ON public.trip_days FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = trip_days.trip_id AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update trip days of their trips" ON public.trip_days;
CREATE POLICY "Users can update trip days of their trips"
    ON public.trip_days FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = trip_days.trip_id AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete trip days of their trips" ON public.trip_days;
CREATE POLICY "Users can delete trip days of their trips"
    ON public.trip_days FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = trip_days.trip_id AND trips.user_id = auth.uid()
        )
    );

-- Trip Stops Policies
DROP POLICY IF EXISTS "Users can view trip stops of their trips" ON public.trip_stops;
CREATE POLICY "Users can view trip stops of their trips"
    ON public.trip_stops FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.trip_days
            JOIN public.trips ON trips.id = trip_days.trip_id
            WHERE trip_days.id = trip_stops.trip_day_id AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert trip stops into their trips" ON public.trip_stops;
CREATE POLICY "Users can insert trip stops into their trips"
    ON public.trip_stops FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trip_days
            JOIN public.trips ON trips.id = trip_days.trip_id
            WHERE trip_days.id = trip_stops.trip_day_id AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update trip stops of their trips" ON public.trip_stops;
CREATE POLICY "Users can update trip stops of their trips"
    ON public.trip_stops FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.trip_days
            JOIN public.trips ON trips.id = trip_days.trip_id
            WHERE trip_days.id = trip_stops.trip_day_id AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete trip stops of their trips" ON public.trip_stops;
CREATE POLICY "Users can delete trip stops of their trips"
    ON public.trip_stops FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.trip_days
            JOIN public.trips ON trips.id = trip_days.trip_id
            WHERE trip_days.id = trip_stops.trip_day_id AND trips.user_id = auth.uid()
        )
    );
