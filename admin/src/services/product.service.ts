import { APIRequest } from './api-request';

export class ProductService extends APIRequest {
  createProduct(
    files: [{ fieldname: string; file: File }],
    payload: any,
    onProgress?: Function
  ) {
    return this.upload('/admin/performer-assets/products', files, {
      onProgress,
      customData: payload
    });
  }

  update(
    id: string,
    files: [{ fieldname: string; file: File }],
    payload: any,
    onProgress?: Function
  ) {
    return this.upload(`/admin/performer-assets/products/${id}`, files, {
      onProgress,
      customData: payload,
      method: 'PUT'
    });
  }

  search(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/admin/performer-assets/products/search', query)
    );
  }

  searchEndpoint() {
    return '/admin/performer-assets/products/search';
  }

  findById(id: string, headers?: any) {
    return this.get(`/admin/performer-assets/products/${id}/view`, headers);
  }

  delete(id: string) {
    return this.del(`/admin/performer-assets/products/${id}`);
  }
}

export const productService = new ProductService();
