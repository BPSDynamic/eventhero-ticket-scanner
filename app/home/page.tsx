"use client"
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/signin')
  }

  return (
    <div onClick={handleClick} className="relative min-h-screen cursor-pointer overflow-hidden flex items-center justify-center bg-white">
      <img src="/assets/images/rectangle-7.png" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute opacity-50 -left-32 top-24 w-[700px] h-[500px]">
        <img src="/assets/images/EventHero Logo - Icon_Black.png" alt="EventHero Icon" className="w-full h-full object-contain" />
      </div>
      <div className="relative z-10 flex items-center justify-center">
        <img src="/assets/images/EventHero Logo - Verti_Black.png" alt="EventHero Logo" className="w-[160px] h-[86px] object-contain" />
      </div>
    </div>
  )
}


