import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";

type ConfirmationStatus = "loading" | "success" | "error";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ConfirmationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const token = searchParams.get("token");

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("No confirmation token provided.");
        return;
      }

      try {
        // Mock API call - replace with actual backend call
        // Example: const response = await fetch('/api/confirm-email', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ token })
        // });
        
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Mock response - simulate success or failure
        // For testing: tokens starting with "fail" will fail
        if (token.startsWith("fail")) {
          throw new Error("Token is invalid or has expired.");
        }
        
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error 
            ? error.message 
            : "The confirmation link is invalid, expired, or has already been used."
        );
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 px-8">
          {status === "loading" && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-semibold text-foreground">
                  Confirming your email...
                </h1>
                <p className="text-muted-foreground text-sm">
                  Please wait while we verify your confirmation link.
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-semibold text-foreground">
                  Email address updated!
                </h1>
                <p className="text-muted-foreground text-sm">
                  Your new email address has been confirmed and is now active on your account.
                </p>
              </div>
              <Button 
                onClick={() => navigate("/settings")}
                className="mt-4"
              >
                <Mail className="mr-2 h-4 w-4" />
                Go to Settings
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-semibold text-foreground">
                  Confirmation failed
                </h1>
                <p className="text-muted-foreground text-sm">
                  {errorMessage}
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Button 
                  onClick={() => navigate("/settings")}
                  variant="outline"
                >
                  Go to Settings
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmEmail;
