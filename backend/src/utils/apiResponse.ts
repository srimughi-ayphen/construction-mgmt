import { Response } from 'express';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const ApiResponse = {

  success(res: Response, data: unknown, statusCode = 200) {
    res.status(statusCode).json({ success: true, data });
  },

  paginated(res: Response, data: unknown[], meta: PaginationMeta) {
    res.status(200).json({ success: true, data, meta });
  },

  created(res: Response, data: unknown) {
    res.status(201).json({ success: true, data });
  },

  noContent(res: Response) {
    res.status(204).send();
  },

  error(res: Response, message: string, statusCode = 500) {
    res.status(statusCode).json({ success: false, error: message });
  },

};