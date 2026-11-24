import { MovieProps } from './movie.interface';

export interface HomeSection {
  key: string;
  title: string;
  movies: MovieProps[];
  variant?: 'poster' | 'backdrop';
  cardWidth?: number;
  ranked?: boolean;
  /** Lazy rail whose data hasn't loaded yet — rendered as a skeleton until it does. */
  isPending?: boolean;
  seeAll?: {
    genreId?: number;
    providerId?: number;
    networkId?: number;
    originalLanguage?: string;
    yearFrom?: number;
    yearTo?: number;
    showType?: number;
    minVotes?: number;
  };
}
