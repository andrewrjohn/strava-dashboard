import Image from 'next/image'
import PoweredByStrava from '@/images/api_logo_pwrdBy_strava_horiz_gray.svg'

export function FooterImage() {
  return <Image src={PoweredByStrava} alt="Powered by Strava" height={30} />
}
