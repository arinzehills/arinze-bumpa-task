const steps = [
  {
    step: 1,
    title: "Shop from Our Partners",
    description:
      "Browse and purchase products from Bumpa, Jumia, Konga, and Aliexpress",
    icon: "ph:shopping-cart-fill",
  },
  {
    step: 2,
    title: "Earn Loyalty Points",
    description:
      "Every purchase automatically awards you 10% loyalty points on the amount spent",
    icon: "ph:coins-fill",
  },
  {
    step: 3,
    title: "Unlock Rewards & Badges",
    description:
      "Accumulate points to unlock badges and achievements, and claim exclusive rewards",
    icon: "ph:trophy-fill",
  },
];

export const HowItWorks = () => {
  return (
    <div className="h-full bg-bg-secondary border border-border-color rounded-lg p-8 flex flex-col">
      <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
        How It Works
      </h2>

      <div className="space-y-6">
        {steps.map((item) => (
          <div key={item.step} className="flex gap-4">
            {/* Step Number */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary text-white font-bold text-lg">
                {item.step}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
