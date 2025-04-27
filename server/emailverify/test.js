// const EmailService = require("./EmailService");

// async function testEmail() {
//   try {
//     const result = await EmailService.sendVerificationEmail("manjori1@students.towson.edu");
//     console.log("Test email result:", result);
//   } catch (error) {
//     console.error("Test failed:", error);
//   }
// }

// testEmail();


// Testing Email Service and Password reset Setup

const EmailService = require("./EmailService");

async function testEmailService() {
  try {
    // Test email verification
    console.log("Testing email verification...");
    const verificationResult = await EmailService.sendVerificationEmail(
      "manjori1@students.towson.edu"
    );
    console.log("Verification result:", verificationResult);

    // Test password reset
    console.log("\nTesting password reset...");
    const resetResult = await EmailService.sendPasswordResetEmail(
      "manjori1@students.towson.edu",
      "RESET123"
    );
    console.log("Reset result:", resetResult);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run tests if executed directly
if (require.main === module) {
  testEmailService();
}