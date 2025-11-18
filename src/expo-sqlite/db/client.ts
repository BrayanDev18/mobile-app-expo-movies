import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

export const expoDb = openDatabaseSync('movies.db');

export const moviesDb = drizzle(expoDb, { schema });

export const resetDatabase = () => {
  try {
    expoDb.execSync('DROP TABLE IF EXISTS movie_details;');
    expoDb.execSync('DROP TABLE IF EXISTS movies;');
    expoDb.execSync('DROP TABLE IF EXISTS movie_videos;');
    expoDb.execSync('DROP TABLE IF EXISTS similar_movies;');
    expoDb.execSync('DROP TABLE IF EXISTS movie_cast;');
    expoDb.execSync('DROP TABLE IF EXISTS movie_images;');
    expoDb.execSync('DROP TABLE IF EXISTS movie_reviews;');
    expoDb.execSync('DROP TABLE IF EXISTS __drizzle_migrations;');
    console.log('✅ Database reset complete');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  }
};

export const clearDatabase = () => {
  try {
    // 1. Obtener listado de todas las tablas
    const result = expoDb.getAllSync<{
      name: string;
    }>(
      `SELECT name FROM sqlite_master 
       WHERE type='table' 
       AND name NOT LIKE 'sqlite_%';`
    );

    const tables = result.map((row) => row.name);

    console.log('🔍 Tablas encontradas:', tables);

    // 2. Limpiar cada tabla
    tables.forEach((table) => {
      expoDb.execSync(`DELETE FROM ${table};`);
      expoDb.execSync(`DELETE FROM sqlite_sequence WHERE name='${table}';`);
    });

    console.log('✅ Todas las tablas fueron limpiadas');
  } catch (error) {
    console.error('❌ Error al limpiar base de datos:', error);
  }
};
