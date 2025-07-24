import React from "react";

const PrivacyPolicy = () => (
  <div className="max-w-2xl mx-auto py-16 px-4 mt-24">
    <h1 className="text-3xl font-bold mb-4 text-primary">Privacy Policy</h1>
    <p className="mb-4 text-lg">
      <strong>AI Love Calculator</strong> values your privacy. We do <span className="font-bold">not</span> store, share, or sell any personal information.
    </p>
    <ul className="list-disc ml-6 mb-4 text-base">
      <li>All compatibility calculations are performed in your browser.</li>
      <li>No names, birth dates, or results are ever sent to a server.</li>
      <li>We do not use cookies or trackers for personal data.</li>
      <li>This app is for entertainment purposes only.</li>
    </ul>
    <p className="mb-2">
      If you have any questions about privacy, feel free to contact us via the project repository.
    </p>
    <p className="text-muted-foreground text-sm">
      By using AI Love Calculator, you agree to this privacy policy.
    </p>
  </div>
);

export default PrivacyPolicy; 