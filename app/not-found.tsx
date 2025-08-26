import Link from "next/link"
import { Button } from "@/core/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center">
      <h1 className="mb-4 text-9xl font-bold text-primary">404</h1>
      <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl">Page Not Found</h2>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        {"Oops! The page you are looking for does not exist. It might have been moved or deleted."}
      </p>
      <Link href="/" passHref>
        <Button className="px-6 py-3 text-lg">Go to Homepage</Button>
      </Link>
    </div>
  )
}
