import clsx from "clsx"
import type { IconType } from "react-icons"

interface IntroCardProps {
  icon: IconType
  title: string
  description: string
  bgColor: string
}

function IntroCard({ icon, title, description, bgColor }: IntroCardProps) {
  const Icon = icon
  return (
    <div
      className={clsx(
        "p-4 text-white max-w-[300px] relative hover:-translate-y-4 transition-transform duration-300",
        bgColor
      )}>
      <Icon size={40} />
      <h3 className="mt-3">{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default IntroCard
