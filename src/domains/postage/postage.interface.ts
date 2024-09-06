export interface IRajaOngkirResponse<Response = any> {
  rajaongkir: {
    query: Record<string, any>;
    status: {
      code: number;
      description: string;
    };
    results: Response;
  };
}
