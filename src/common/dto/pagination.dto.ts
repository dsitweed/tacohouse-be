export class PaginationDto {
  constructor(
    public count: number,
    public items: any[],
    public message?: string,
  ) {}
}
