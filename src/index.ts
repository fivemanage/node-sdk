import axios, { type AxiosInstance } from "axios";

export class FivemanageClient {
  private apiKey: string;
  private client: AxiosInstance;

  /**
   * Creates an instance of FivemanageClient.
   *
   * @param apiKey - The API key required to authenticate requests to the Fivemanage API.
   *
   * @throws {Error} If the API key is not provided.
   *
   * Initializes an Axios instance with default settings, including the base URL and headers.
   */
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required to initialize FivemanageClient");
    }
    this.apiKey = apiKey;

    // Initialize the Axios instance with default settings
    this.client = axios.create({
      baseURL: "https://api.fivemanage.com",
      headers: {
        Authorization: `${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Retrieves a presigned URL for uploading a file of the specified type.
   *
   * @param fileType - The type of the file for which to get a presigned URL.
   *                   It can be "image", "audio", or "video".
   * @returns A promise that resolves to the presigned URL as a string.
   * @throws An error if the request to get the presigned URL fails.
   */
  async getPresignedUrl(
    fileType: "image" | "audio" | "video"
  ): Promise<string> {
    try {
      const response = await this.client.get(
        `/api/presigned-url?$fileType=${fileType}`
      );

      return response.data.presignedUrl;
    } catch (error) {
      throw new Error(`Failed to get presigned URL: ${error}`);
    }
  }
}
