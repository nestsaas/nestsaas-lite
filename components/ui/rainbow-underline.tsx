import { ReactNode } from "react"

export function RainbowUnderline({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-center font-semibold text-gray-950 sm:gap-1 dark:text-white">
      <div className="block">
        <div className="block pb-2">{children}</div>
        <div className="-mt-5 grow overflow-hidden">
          <svg
            aria-hidden="true"
            className="w-16"
            height="22"
            viewBox="0 0 283 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.24715 19.3744C72.4051 10.3594 228.122 -4.71194 281.724 7.12332"
              stroke="url(#paint0_linear_pl)"
              stroke-width="4"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear_pl"
                x1="282"
                y1="5.49999"
                x2="40"
                y2="13"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#facc15"></stop>
                <stop offset="1" stop-color="#a855f7"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}
