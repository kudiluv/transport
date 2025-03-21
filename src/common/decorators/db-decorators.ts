import { Column, ColumnOptions } from 'typeorm';

/**
 * Decorator for describe field type string.
 * @param comment Comment for column.
 * @param length  Length of string (default 255).
 */
export const StringColumn = (
  comment?: string,
  length = 255,
  options?: Omit<ColumnOptions, 'comment' | 'length'>,
) => {
  return Column({
    comment: comment,
    type: 'varchar',
    length: length,
    ...options,
  });
};

/**
 * Decorator for describe field type integer.
 * @param comment Comment for column.
 */
export const IntColumn = (
  comment?: string,
  options?: Omit<ColumnOptions, 'comment'>,
) => {
  return Column({
    comment: comment,
    type: 'integer',
    ...options,
  });
};

/**
 * Decorator for describe field type geometry.
 * @param comment Comment for column.
 */
export const GeometryColumn = (
  comment?: string,
  options?: Omit<ColumnOptions, 'comment'>,
) => {
  return Column({
    comment: comment,
    type: 'geometry',
    ...options,
  });
};
