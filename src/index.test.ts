import fs from "node:fs";
import * as dotenv from "dotenv";
import { expect, test } from "vitest";
import { FivemanageClient } from ".";

dotenv.config();

const client = new FivemanageClient(process.env.TEST_MEDIA_TOKEN as string);

test("throws error when API key is not provided", () => {
  expect(() => new FivemanageClient("")).toThrow(
    "API key is required to initialize FivemanageClient"
  );
});

test("make sure presigned url is fetching for image", async () => {
  const presignedUrl = await client.getPresignedUrl("image");
  expect(presignedUrl).toMatch(
    /^https:\/\/api\.fivemanage\.com\/api\/presigned-url\/\w+$/
  );
});

test("make sure presigned url is fetching for audio", async () => {
  const presignedUrl = await client.getPresignedUrl("audio");
  expect(presignedUrl).toMatch(
    /^https:\/\/api\.fivemanage\.com\/api\/presigned-url\/\w+$/
  );
});

test("make sure presigned url is fetching for video", async () => {
  const presignedUrl = await client.getPresignedUrl("video");
  expect(presignedUrl).toMatch(
    /^https:\/\/api\.fivemanage\.com\/api\/presigned-url\/\w+$/
  );
});

test("logs an info message successfully", async () => {
  const logResponse = await client.log("info", "Test log message", {
    key: "value",
  });
  expect(logResponse).toHaveProperty("status", "ok");
});

test("upload and delete an image file", async () => {
  const file = new Blob([fs.readFileSync("test/image.png")], {
    type: "image/png",
  });
  const uploadResponse = await client.uploadFile("image", file, {
    name: "My image",
    description: "This is my image",
  });
  expect(uploadResponse).toHaveProperty("url");

  const deleteResponse = await client.deleteFile("image", uploadResponse.id);
  expect(deleteResponse).toHaveProperty("status", "ok");
});

/*
 * Temp disabled due to the upload response not passing an id
 */

// test("upload and delete an audio file", async () => {
//   const file = new Blob([fs.readFileSync("test/audio.mp3")], {
//     type: "audio/mpeg",
//   });
//   const uploadResponse = await client.uploadFile("audio", file, {
//     name: "My audio",
//     description: "This is a recording of something cool",
//   });
//   expect(uploadResponse).toHaveProperty("url");

//   const deleteResponse = await client.deleteFile("audio", uploadResponse.id);
//   expect(deleteResponse).toHaveProperty("status", "ok");
// });

test("upload and delete a video file", async () => {
  const file = new Blob([fs.readFileSync("test/video.mp4")], {
    type: "video/mp4",
  });
  const uploadResponse = await client.uploadFile("video", file, {
    name: "My video",
    description: "This is a video of something cool",
  });
  expect(uploadResponse).toHaveProperty("url");

  const deleteResponse = await client.deleteFile("video", uploadResponse.id);
  expect(deleteResponse).toHaveProperty("status", "ok");
});
