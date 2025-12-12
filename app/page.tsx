import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { SectionContainer } from "../components/SectionContainer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <SectionContainer maxWidth="lg" className="py-16 sm:py-24 lg:py-32">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="font-poppins text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                Welcome to DZ Market
              </h1>
              <p className="font-poppins text-lg text-gray-600 dark:text-gray-400">
                Your trusted online marketplace for quality products delivered
                across Algeria. Fast shipping, secure payment, and excellent
                customer service.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg">Start Shopping</Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          {/* Featured Image Placeholder */}
          <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-dz-green via-dz-red to-dz-green-dark p-8 text-white">
            <div className="text-center">
              <div className="mb-4 inline-block rounded-full bg-white bg-opacity-20 p-6">
                <svg
                  className="h-20 w-20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="font-poppins text-2xl font-bold">
                Amazing Products
              </h3>
              <p className="mt-2 font-poppins text-white text-opacity-80">
                Curated selection for you
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Features Section */}
      <SectionContainer maxWidth="lg" className="py-12 sm:py-16">
        <h2 className="mb-12 font-poppins text-3xl font-bold text-gray-900 dark:text-white">
          Why Shop With Us
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "🚚",
              title: "Fast Delivery",
              description: "Quick shipping to all major cities in Algeria",
            },
            {
              icon: "🔒",
              title: "Secure Payment",
              description: "Multiple payment options with full security",
            },
            {
              icon: "💚",
              title: "Quality Guarantee",
              description: "All products are genuine and verified",
            },
          ].map((feature) => (
            <Card key={feature.title}>
              <div className="space-y-4">
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="font-poppins text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="font-poppins text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
