export interface DecodedToken {
  id: string;
  email: string;
}

export interface IReview {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
}

export interface IReviewsDto {
  reviews: IReview[];
  rating: number;
}

export interface ILoginRequest {
  email: string;
  password: string;
}