// photoRoomApi.ts
import { create, ApiResponse } from 'apisauce';

// Define the base URL for the PhotoRoom API
const api = create({
  baseURL: 'https://image-api.photoroom.com/v2',
});

const editImage = (imageUrl: string, apiKey: string): Promise<ApiResponse<Blob>> => {
  // Define the parameters for the API call
  const params = {
    'shadow.mode': 'ai.floating',
    imageUrl,
    padding: 0.1,
  };

  // Make the API call and return the promise
  return api.get<Blob>('/edit', params, {
    headers: {
      Accept: 'image/png, application/json',
      'x-api-key': apiKey,
    },
    responseType: 'blob', // Ensure the response is in Blob format for the image
  });
};

// Export the function for use in other files
export default editImage;

