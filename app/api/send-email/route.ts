import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      to,
      subject,
      message,
    } = body;

    const data =
      await resend.emails.send({

        from:
          "LoadOps AI <onboarding@resend.dev>",

        to,

        subject,

        html: `
          <div style="font-family:sans-serif;padding:20px;">
            <h2>LoadOps AI</h2>
            <p>${message}</p>
          </div>
        `,
      });

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      error,
    });
  }
}