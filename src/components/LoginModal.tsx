import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

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
    
    // Simulate API call to send login code
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setStep("verify");
    toast({
      title: "Login code sent",
      description: "Check your email for the 6-digit login code",
    });
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit login code");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // Simulate API call to verify login code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate backend validation - for demo, codes starting with "1" are wrong
      if (verificationCode.startsWith("1")) {
        setError("Invalid login code. Please check your email and try again.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Reset modal state
      setEmail("");
      setVerificationCode("");
      setStep("email");
      setError("");
      
      onLoginSuccess();
      onClose();
    } catch (error) {
      setIsLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    setEmail("");
    setVerificationCode("");
    setStep("email");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Log In
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {step === "email" ? (
            <>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Welcome Back</h3>
                <p className="text-muted-foreground">
                  Enter your email to receive a login code
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-email">Email Address</Label>
                <Input
                  id="login-email"
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
                {isLoading ? "Sending..." : "Send Login Code"}
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
                  We sent a 6-digit login code to{" "}
                  <span className="font-medium">{email}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-code">Login Code</Label>
                <Input
                  id="login-code"
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
                {isLoading ? "Logging in..." : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Log In
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
        </div>
      </DialogContent>
    </Dialog>
  );
};