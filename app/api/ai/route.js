import { NextResponse } from "next/server";
import Gemini from "gemini-ai";

const gemini = new Gemini(process.env.GEMINI_API_KEY);

//FIX LATER THIS PROMPT SUCKS!!!
const SYSTEM_INSTRUCTION = `Extract structured data from seed box OCR text into JSON with fields: Construct Name, Background, Generations, Description. Use provided examples to guide extraction.
  Don't fill in fields you dont have to. Background is usually col, ap, sec/spy, 9D3TPR, lag6, acpro are for sure. Generations is usually missing as well but it will be F1/T2/T3/T4 or anything else. Description is any additional information
  Ignore newlines, dashes, semicolons, when it comes to categories(don't think of them as spacers) but not as names. When in doubt put in description, especially for background. HO is homozygous he is heterozygous. Expect spelling mistakes.
  Set missing fields to null. Output valid JSON. Examples:
- "col-0 Bulk" → {"Construct Name": "col-0", "Background": null, "Generations": "null", "Description": Bulk}
- "TCP14-TD SPY3TPR (K/M) T2 10B, 1, 10 packets" → {"Construct Name": "TCP14-TD", "Background": "SPY3TPR", "Generations": "T2", "Description": "10B, 1, 10 packets"}
- "ACpro: no RSB-TD col-0 5-1, 25-1 25-3, 25-4 (3 packets), 25-5 (2 packets), 25-7, 25-8 (4 packets), basta" -> {"Construct Name": "ACpro: no RSB-TD", "Background": "col-0", "Generations": "null", "Description": "5-1, 25-1 25-3, 25-4 (3 packets), 25-5 (2 packets), 25-7, 25-8 (4 packets), basta"}

`;
export async function POST(request) {
  const { ocrText } = await request.json();
  if (!ocrText) {
    console.log("notest");
    return NextResponse.json({ error: "Missing ocrText" }, { status: 400 });
  }

  const res = await gemini.ask(ocrText, {
    systemInstruction: SYSTEM_INSTRUCTION,
    temperature: 0.8,
    topP: 1,
    jsonSchema: {
      type: "object",
      properties: {
        "Construct Name": { type: "string" },
        Background: { type: ["string", "null"] },
        Generations: { type: ["string", "null"] },
        Description: { type: ["string", "null"] },
      },
      required: ["Construct Name", "Background", "Generations", "Description"],
    },
  });
  console.log(res);
  const parsed = JSON.parse(res);

  return NextResponse.json(parsed);
}
