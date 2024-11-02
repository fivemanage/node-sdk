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
        `/api/presigned-url?fileType=${fileType}`
      );

      return response.data.presignedUrl;
    } catch (error) {
      throw new Error(`Failed to get presigned URL: ${error}`);
    }
  }

  /**
   * Logs to the Fivemanage API.
   *
   * @param level - The log level (e.g., "info", "error").
   * @param message - The log message.
   * @param metadata - Additional metadata for the log.
   * @returns A promise that resolves to the response data.
   * @throws An error if the request to log the message fails.
   */
  async log(
    level: string,
    message: string,
    metadata: Record<string, unknown>
  ): Promise<unknown> {
    try {
      const response = await this.client.post("/api/logs", {
        level,
        message,
        metadata,
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to log message: ${error}`);
    }
  }

  /**
   * Uploads a file to the Fivemanage API.
   *
   * @param fileType - The type of the file ("image", "audio", "video").
   * @param file - The file to be uploaded.
   * @param metadata - Optional metadata for the file.
   * @returns A promise that resolves to the response data.
   * @throws An error if the request to upload the file fails.
   */
  async uploadFile(
    fileType: "image" | "audio" | "video",
    file: Blob | File,
    metadata?: Record<string, unknown>
  ): Promise<{ url: string; id: string }> {
    const url = `/api/${fileType}`;
    const formData = new FormData();
    formData.append("file", file);

    if (metadata) {
      formData.append("metadata", JSON.stringify(metadata));
    }

    try {
      const response = await this.client.post(url, formData, {
        headers: {
          Authorization: this.apiKey,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to upload ${fileType}: ${error}`);
    }
  }

  /**
   * Deletes a file from the Fivemanage API.
   *
   * @param fileType - The type of the file ("image", "audio", "video").
   * @param id - The ID of the file to be deleted.
   * @returns A promise that resolves to the response data.
   * @throws An error if the request to delete the file fails.
   */
  async deleteFile(
    fileType: "image" | "audio" | "video",
    id: string
  ): Promise<unknown> {
    const url = `/api/${fileType}/delete/${id}`;

    try {
      const response = await this.client.delete(url, {
        headers: {
          Authorization: this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete ${fileType} with ID ${id}: ${error}`);
    }
  }
}
