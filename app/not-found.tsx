import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <Image
        src="/images/illustrations/cute-dog-with-a-bone.svg"
        alt="404"
        width={400}
        height={400}
        className="pointer-events-none mt-6 mb-5 dark:invert"
      />
      <p className="px-4 text-center text-2xl font-medium text-balance">
        Page not found. Back to{" "}
        <Link
          href="/"
          className="text-muted-foreground underline underline-offset-4 hover:text-purple-500"
        >
          Homepage
        </Link>
        .
      </p>
    </div>
  )
}
