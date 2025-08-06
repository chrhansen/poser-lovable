import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface EmailVerificationProps {
  onVerified: () => void;
  onBack: () => void;
}

export const EmailVerification = ({ onVerified, onBack }: EmailVerificationProps) => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to send verification code
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setStep("verify");
    toast({
      title: "Verification code sent",
      description: "Check your email for the verification code",
    });
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // Simulate API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate backend validation - for demo, codes starting with "1" are wrong
      if (verificationCode.startsWith("1")) {
        setError("Invalid verification code. Please check your email and try again.");
        setIsLoading(false);
        return;
      }
      
      // Simulate successful verification with analysis ID
      const analysisId = `analysis_${Date.now()}`;
      
      setIsLoading(false);
      toast({
        title: "Email verified successfully",
        description: "Redirecting to your video analysis...",
      });
      
      // Redirect to results page with analysis ID
      navigate(`/results?id=${analysisId}`);
      onVerified();
    } catch (error) {
      setIsLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Verification
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === "email" ? (
          <>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Verify Your Email</h3>
              <p className="text-muted-foreground">
                We'll send you a verification code to ensure you can receive your analysis results
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
              />
            </div>

            <Button 
              onClick={handleSendCode}
              disabled={isLoading || !email}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>
          </>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Check Your Email</h3>
              <p className="text-muted-foreground">
                We sent a 6-digit verification code to{" "}
                <span className="font-medium">{email}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setError(""); // Clear error when user types
                }}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                className={`text-center text-lg tracking-widest ${error ? "border-destructive" : ""}`}
                maxLength={6}
              />
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleVerifyCode}
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Verifying..." : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Verify & Process
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleSendCode}
              className="w-full text-sm"
              disabled={isLoading}
            >
              Didn't receive the code? Resend
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};