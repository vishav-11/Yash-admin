export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

export type ID = string | number;

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}