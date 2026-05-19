// app/perfil/actions/collection.action.ts

import { apiClient } from '@/app/config/apiClient';

export interface CollectionItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
}

//necesita la url para la peticion
export async function addToCollectionAction(productId: string) {
  return apiClient<{ message: string }>(`/collection/add/${productId}`, {
    method: 'PATCH',
  });
}

export async function getCollectionAction() {
  return apiClient<CollectionItem[]>('/collection', {
    method: 'GET',
  });
}

export async function removeFromCollectionAction(productId: string) {
  return apiClient<{ message: string }>(`/collection/remove/${productId}`, {
    method: 'DELETE',
  });
}