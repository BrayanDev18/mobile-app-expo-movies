CREATE TABLE `cast_credits` (
	`id` integer PRIMARY KEY NOT NULL,
	`adult` integer DEFAULT false,
	`backdrop_path` text,
	`poster_path` text,
	`title` text,
	`original_title` text,
	`original_language` text,
	`overview` text,
	`release_date` text,
	`video` integer DEFAULT false,
	`popularity` real DEFAULT 0,
	`vote_average` real DEFAULT 0,
	`vote_count` integer DEFAULT 0,
	`character` text,
	`credit_id` text,
	`order` integer DEFAULT 0,
	`cast_id` integer NOT NULL,
	`genre_ids` text,
	FOREIGN KEY (`cast_id`) REFERENCES `movie_cast`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cast_details` (
	`id` integer PRIMARY KEY DEFAULT 0 NOT NULL,
	`adult` integer DEFAULT true,
	`also_known_as` text,
	`biography` text,
	`birthday` text,
	`deathday` text,
	`gender` integer DEFAULT 0,
	`homepage` text,
	`imdb_id` text,
	`known_for_department` text,
	`name` text,
	`place_of_birth` text,
	`popularity` real DEFAULT 0,
	`profile_path` text,
	`cast_id` integer NOT NULL,
	FOREIGN KEY (`cast_id`) REFERENCES `movie_cast`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cast_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profiles` text,
	`cast_id` integer NOT NULL,
	FOREIGN KEY (`cast_id`) REFERENCES `movie_cast`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `movie_cast` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`character` text,
	`profile_path` text,
	`movie_id` integer NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `movie_details` (
	`id` integer PRIMARY KEY NOT NULL,
	`adult` integer DEFAULT false NOT NULL,
	`backdrop_path` text,
	`budget` integer DEFAULT 0,
	`genres` text,
	`homepage` text,
	`imdb_id` text,
	`original_language` text,
	`original_title` text,
	`overview` text,
	`popularity` real DEFAULT 0,
	`poster_path` text,
	`production_companies` text,
	`production_countries` text,
	`release_date` text,
	`revenue` integer DEFAULT 0,
	`runtime` integer DEFAULT 0,
	`spoken_languages` text,
	`status` text,
	`tagline` text,
	`title` text NOT NULL,
	`video` integer DEFAULT false,
	`vote_average` real DEFAULT 0,
	`vote_count` integer DEFAULT 0,
	`last_updated` integer DEFAULT 1763592848 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `movie_images` (
	`aspect_ratio` integer,
	`file_path` text,
	`movie_id` integer NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `movie_providers` (
	`provider_id` integer,
	`logo_path` text,
	`provider_name` text
);
--> statement-breakpoint
CREATE TABLE `movie_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`author` text,
	`author_details` text,
	`content` text,
	`created_at` integer,
	`url` text,
	`movie_id` integer NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `movie_videos` (
	`key` text PRIMARY KEY NOT NULL,
	`name` text,
	`site` text,
	`type` text,
	`size` integer DEFAULT 0,
	`movie_id` integer NOT NULL,
	`official` integer DEFAULT false,
	`published_at` integer,
	`last_updated` integer DEFAULT 1763592848 NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `movie_watch_providers` (
	`results` text,
	`movie_id` integer NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `movies` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`overview` text,
	`adult` integer DEFAULT false NOT NULL,
	`poster_path` text,
	`release_date` text,
	`vote_average` real DEFAULT 0 NOT NULL,
	`original_language` text,
	`backdrop_path` text,
	`category` text NOT NULL,
	`last_updated` integer DEFAULT 1763592848 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `similar_movies` (
	`id` integer PRIMARY KEY NOT NULL,
	`text` text,
	`poster_path` text,
	`release_date` integer,
	`movie_id` integer NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
