import { cookies } from 'next/headers'
import React from 'react'
import FinishLoginButton from '../components/FinishLoginButton'
import { COOKIES, STRAVA_AUTHORIZATION_URL } from '../lib/constants'
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
    <div>
      <div className="flex items-center justify-center min-h-screen">
        {searchParams?.code ? (
          <FinishLoginButton code={searchParams.code} />
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
    </div>
  )
}
