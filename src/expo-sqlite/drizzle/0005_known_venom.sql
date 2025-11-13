CREATE TABLE `cast_credits` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`character` text,
	`profile_path` text,
	`movie_id` integer NOT NULL,
	`adult` integer DEFAULT false,
	`credit_id` text,
	`order` integer DEFAULT 0,
	`original_title` text,
	`original_language` text,
	`popularity` real DEFAULT 0,
	`vote_average` real DEFAULT 0,
	`vote_count` integer DEFAULT 0,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
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
	`profile_path` text
);
--> statement-breakpoint
CREATE TABLE `cast_images` (
	`id` integer PRIMARY KEY DEFAULT 0 NOT NULL,
	`profiles` text
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_movie_details` (
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
	`last_updated` integer DEFAULT 1763045508 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_movie_details`("id", "adult", "backdrop_path", "budget", "genres", "homepage", "imdb_id", "original_language", "original_title", "overview", "popularity", "poster_path", "production_companies", "production_countries", "release_date", "revenue", "runtime", "spoken_languages", "status", "tagline", "title", "video", "vote_average", "vote_count", "last_updated") SELECT "id", "adult", "backdrop_path", "budget", "genres", "homepage", "imdb_id", "original_language", "original_title", "overview", "popularity", "poster_path", "production_companies", "production_countries", "release_date", "revenue", "runtime", "spoken_languages", "status", "tagline", "title", "video", "vote_average", "vote_count", "last_updated" FROM `movie_details`;--> statement-breakpoint
DROP TABLE `movie_details`;--> statement-breakpoint
ALTER TABLE `__new_movie_details` RENAME TO `movie_details`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_movie_videos` (
	`key` text PRIMARY KEY NOT NULL,
	`name` text,
	`site` text,
	`type` text,
	`size` integer DEFAULT 0,
	`movie_id` integer NOT NULL,
	`official` integer DEFAULT false,
	`published_at` integer,
	`last_updated` integer DEFAULT 1763045508 NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_movie_videos`("key", "name", "site", "type", "size", "movie_id", "official", "published_at", "last_updated") SELECT "key", "name", "site", "type", "size", "movie_id", "official", "published_at", "last_updated" FROM `movie_videos`;--> statement-breakpoint
DROP TABLE `movie_videos`;--> statement-breakpoint
ALTER TABLE `__new_movie_videos` RENAME TO `movie_videos`;--> statement-breakpoint
CREATE TABLE `__new_movies` (
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
	`last_updated` integer DEFAULT 1763045508 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_movies`("id", "title", "overview", "adult", "poster_path", "release_date", "vote_average", "original_language", "backdrop_path", "category", "last_updated") SELECT "id", "title", "overview", "adult", "poster_path", "release_date", "vote_average", "original_language", "backdrop_path", "category", "last_updated" FROM `movies`;--> statement-breakpoint
DROP TABLE `movies`;--> statement-breakpoint
ALTER TABLE `__new_movies` RENAME TO `movies`;