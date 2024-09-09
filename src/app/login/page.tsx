import { cookies } from 'next/headers'
import React from 'react'
import CompleteLogin from '@/components/CompleteLogin'
import { COOKIES, STRAVA_AUTHORIZATION_URL } from '@/lib/constants'
import { redirect } from 'next/navigation'
import { ExternalLink } from '@/components/ui/external-link'
import Image from 'next/image'
import ConnectWithStrava from '@/images/btn_strava_connectwith_light.svg'

interface Props {
  searchParams?: {
    code?: string
    scope?: string
  }
}

export default function LoginPage(props: Props) {
  const { searchParams } = props
  const athleteId = cookies().get(COOKIES.STRAVA_ATHLETE_ID)?.value

  if (athleteId) {
    redirect('/')
  }

  return (
    <div className="flex items-center justify-center flex-1">
      {searchParams?.code ? (
        <CompleteLogin code={searchParams.code} />
      ) : (
        <ExternalLink href={STRAVA_AUTHORIZATION_URL} variant={null}>
          <Image
            src={ConnectWithStrava}
            alt="Connect with Strava"
            height={48}
          />
        </ExternalLink>
      )}
    </div>
  )
}
