import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";
import { GoogleAuth } from "google-auth-library";

const auth = new GoogleAuth({
  projectId: process.env.GCP_PROJECT_ID,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY,
  },
});

const client = new vision.ImageAnnotatorClient({ auth });

export async function POST(request) {
  const { imageBase64 } = await request.json();

  try {
    const [result] = await client.textDetection({
      image: { content: imageBase64 },
    });
    const detectedText = result.textAnnotations[0]?.description || "";
    return NextResponse.json({ text: detectedText });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
