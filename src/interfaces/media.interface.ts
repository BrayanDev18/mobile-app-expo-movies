import { MovieProps } from './movie.interface';

export interface HomeSection {
  key: string;
  title: string;
  movies: MovieProps[];
  variant?: 'poster' | 'backdrop';
  cardWidth?: number;
  ranked?: boolean;
  seeAll?: {
    genreId?: number;
    providerId?: number;
    networkId?: number;
    originalLanguage?: string;
    showType?: number;
    minVotes?: number;
  };
}
