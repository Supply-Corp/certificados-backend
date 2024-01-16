export class PaginationService {

  constructor(
    public page: number,
    public limit: number,
    public total: number,
    public next: string | null,
    public prev: string | null
  ) {}


  static get( page: number, limit: number, total: number, api: string) {

    const next = (limit * page >= total) ? null : `${api}?page=${ (page + 1 ) }&limit=${ limit }`;
    const prev = (page -1 > 0) ? `${api}?page=${ (page - 1 ) }&limit=${ limit }` : null;

    return new PaginationService(
        page,
        limit,
        total,
        next,
        prev
    )
  }

}
