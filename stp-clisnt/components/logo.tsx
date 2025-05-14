import Image from "next/image"
import Link from "next/link"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={className}>
      <div className="flex items-center gap-2">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6617EC5B-C5E3-47D2-B490-5A5CC90BB13F_1_201_a-7feKXKQMU84oXmO2iwnRHZ4bGFr9yj.jpeg"
          alt="Sustainable Pathfinders Logo"
          width={180}
          height={60}
          className="h-auto w-auto"
        />
      </div>
    </Link>
  )
}
