import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const moviesTable = sqliteTable('movies', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  overview: text('overview'),
  adult: integer('adult', { mode: 'boolean' }).notNull().default(false),
  poster_path: text('poster_path'),
  release_date: text('release_date'),
  vote_average: real('vote_average').notNull().default(0),
  original_language: text('original_language'),
  backdrop_path: text('backdrop_path'),
  category: text('category').notNull(),
  last_updated: integer('last_updated')
    .notNull()
    .default(Math.floor(Date.now() / 1000)),
});

export const movieDetailsTable = sqliteTable('movie_details', {
  id: integer('id').primaryKey(),
  adult: integer('adult', { mode: 'boolean' }).notNull().default(false),
  backdrop_path: text('backdrop_path'),
  budget: integer('budget').default(0),
  genres: text('genres'),
  homepage: text('homepage'),
  imdb_id: text('imdb_id'),
  original_language: text('original_language'),
  original_title: text('original_title'),
  overview: text('overview'),
  popularity: real('popularity').default(0),
  poster_path: text('poster_path'),
  production_companies: text('production_companies'),
  production_countries: text('production_countries'),
  release_date: text('release_date'),
  revenue: integer('revenue').default(0),
  runtime: integer('runtime').default(0),
  spoken_languages: text('spoken_languages'),
  status: text('status'),
  tagline: text('tagline'),
  title: text('title').notNull(),
  video: integer('video', { mode: 'boolean' }).default(false),
  vote_average: real('vote_average').default(0),
  vote_count: integer('vote_count').default(0),
  last_updated: integer('last_updated')
    .notNull()
    .default(Math.floor(Date.now() / 1000)),
});

export const movieVideosTable = sqliteTable('movie_videos', {
  key: text('key').primaryKey(),
  name: text('name'),
  site: text('site'), // "YouTube", "Vimeo", etc.
  type: text('type'), // "Trailer", "Teaser", etc.
  size: integer('size').default(0),
  movie_id: integer('movie_id')
    .references(() => moviesTable.id)
    .notNull(),
  official: integer('official', { mode: 'boolean' }).default(false),
  published_at: integer('published_at'),
  last_updated: integer('last_updated')
    .notNull()
    .default(Math.floor(Date.now() / 1000)),
});

export const similarMoviesTable = sqliteTable('similar_movies', {
  id: integer('id').primaryKey(),
  title: text('text'),
  poster_path: text('poster_path'),
  release_date: integer('release_date'),
  movie_id: integer('movie_id')
    .references(() => moviesTable.id)
    .notNull(),
});

export const movieCastTable = sqliteTable('movie_cast', {
  id: integer('id').primaryKey(),
  name: text('name'),
  character: text('character'),
  profile_path: text('profile_path'),
  movie_id: integer('movie_id')
    .references(() => moviesTable.id)
    .notNull(),
});

export const movieImagesTable = sqliteTable('movie_images', {
  aspect_ratio: integer('aspect_ratio'),
  file_path: text('file_path'),
  movie_id: integer('movie_id')
    .references(() => moviesTable.id)
    .notNull(),
});

export const movieReviewsTable = sqliteTable('movie_reviews', {
  id: text('id').primaryKey(),
  author: text('author'),
  author_details: text('author_details'),
  content: text('content'),
  created_at: integer('created_at'),
  url: text('url'),
  movie_id: integer('movie_id')
    .references(() => moviesTable.id)
    .notNull(),
});
