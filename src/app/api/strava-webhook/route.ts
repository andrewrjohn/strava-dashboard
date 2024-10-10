export const POST = async (req: Request) => {
  const body = await req.json()
  console.log(body)

  return Response.json({ success: true }, { status: 200 })
}

export const GET = async (req: Request) => {
  const query = new URLSearchParams(req.url)
  const challenge = query.get('hub.challenge')
  const verifyToken = query.get('hub.verify_token')

  console.log({ verifyToken, env: process.env.STRAVA_WEBHOOK_SECRET })
  if (verifyToken !== process.env.STRAVA_WEBHOOK_SECRET) {
    return Response.json({ success: false }, { status: 401 })
  }

  return Response.json({ 'hub.challenge': challenge }, { status: 200 })
}
