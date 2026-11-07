import { z } from "zod";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { admin } from "../middleware/admin";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});
export const upload = {
  presign: admin
    .input(
      z.object({
        filename: z.string().max(200),
        contentType: z.enum([
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/avif",
          "video/mp4",
          "video/webm",
        ]),
        size: z
          .number()
          .positive()
          .max(100 * 1024 * 1024),
      }),
    )
    .handler(async ({ input }) => {
      const ext = input.contentType.split("/")[1];
      const key = `portfolio/${crypto.randomUUID()}.${ext}`;
      const signed = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
          ContentType: input.contentType,
          ContentLength: input.size,
          ACL: "public-read",
        }),
        { expiresIn: 600, signableHeaders: new Set(["x-amz-acl"]) },
      );
      return {
        url: signed,
        publicUrl: `https://${process.env.S3_BUCKET}.t3.tigrisfiles.io/${key}`,
      };
    }),
};
