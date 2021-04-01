export class PaginationResult<T> {
  constructor(
    public count: number,
    public items: T[],
  ) {}
}
