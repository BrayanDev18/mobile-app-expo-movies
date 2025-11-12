CREATE TABLE `movie_cast` (
	`id` text PRIMARY KEY NOT NULL,
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
	`last_updated` integer DEFAULT 1759866590 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `movie_images` (
	`aspect_ratio` integer,
	`file_path` text,
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
	`last_updated` integer DEFAULT 1759866590 NOT NULL,
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
	`last_updated` integer DEFAULT 1759866590 NOT NULL
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
