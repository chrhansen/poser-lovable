import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send } from "lucide-react";

interface ContactFormProps {
  children?: React.ReactNode;
}

export const ContactForm = ({ children }: ContactFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with your actual backend endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject.trim() || "User Feedback",
          message: message.trim(),
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for your feedback. We'll get back to you soon.",
        });
        setMessage("");
        setSubject("");
        setIsOpen(false);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Contact Us
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Contact Poser Team
          </DialogTitle>
          <DialogDescription>
            Have a question, suggestion, or issue? We'd love to hear from you!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject (optional)</Label>
            <Input
              id="subject"
              placeholder="Brief description of your message"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your issue, suggestion, or question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/1000 characters
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="flex-1 gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};