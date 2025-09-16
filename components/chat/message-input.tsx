"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Brain, Target } from "lucide-react";
import { MessageInputProps } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ValidationError } from "@/components/error/error-states";
import { useToast } from "@/components/error/toast-provider";
import { classifyError } from "@/lib/error-utils";
import { generateId, getValidationAttributes } from "@/lib/utils/accessibility";

const MAX_MESSAGE_LENGTH = 4000;
const MIN_MESSAGE_LENGTH = 1;

interface ValidationErrors {
  message?: string;
}

// Career counseling quick prompts
const CAREER_PROMPTS = [
  {
    icon: Target,
    text: "Help me set career goals",
    prompt: "I need help setting clear and achievable career goals. Can you guide me through the process?"
  },
  {
    icon: Brain,
    text: "Improve my resume",
    prompt: "I want to improve my resume to better showcase my skills and experience. What are the key areas I should focus on?"
  },
  {
    icon: Sparkles,
    text: "Interview preparation",
    prompt: "I have an upcoming job interview and need help preparing. Can you provide tips and practice questions?"
  }
];

export function MessageInput({ 
  onSend, 
  disabled = false, 
  placeholder = "Message AI Career Counselor...",
  isLoading = false,
  ...props
}: MessageInputProps & React.HTMLAttributes<HTMLDivElement>) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [sendError, setSendError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { showError } = useToast();
  
  // Generate unique IDs for ARIA relationships
  const textareaId = generateId('message-input');
  const errorId = generateId('input-error');
  const helpTextId = generateId('input-help');
  const statusId = generateId('input-status');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const validateMessage = (text: string): ValidationErrors => {
    const errors: ValidationErrors = {};
    const trimmed = text.trim();

    if (trimmed.length === 0) {
      errors.message = "Message cannot be empty";
    } else if (trimmed.length < MIN_MESSAGE_LENGTH) {
      errors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} character`;
    } else if (trimmed.length > MAX_MESSAGE_LENGTH) {
      errors.message = `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
    }

    return errors;
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    
    // Clear previous errors
    setValidationErrors({});
    setSendError(null);
    
    // Validate message
    const errors = validateMessage(trimmedMessage);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSend(trimmedMessage);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      // Use error classification utility
      const classified = classifyError(error);
      
      setSendError(classified.userMessage);
      showError(classified.userMessage, {
        action: classified.retryable ? {
          label: "Retry",
          onClick: () => handleSend()
        } : undefined
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSendError(null);
    handleSend();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // On mobile, always allow Enter for new line, require send button
    if (isMobile) {
      return; // Let default behavior handle new lines
    }
    
    // On desktop: Enter to send (without Shift), Shift+Enter for new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (value: string) => {
    // Clear validation errors when user starts typing
    if (validationErrors.message) {
      setValidationErrors({});
    }
    
    // Clear send error when user modifies message
    if (sendError) {
      setSendError(null);
    }
    
    // Always allow typing, but show validation errors
    setMessage(value);
  };

  const isDisabled = disabled || isSubmitting || isLoading;
  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const canSend = message.trim().length > 0 && !isDisabled && !hasValidationErrors;
  const showLoading = isSubmitting || isLoading;
  
  // Get validation attributes for accessibility
  const ariaDescribedBy = [
    helpTextId,
    statusId,
    hasValidationErrors ? errorId : null
  ].filter(Boolean).join(' ');

  const handlePromptSelect = (prompt: string) => {
    setMessage(prompt);
    setShowPrompts(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };



  return (
    <div 
      className="bg-background border-t border-border/50 theme-transition"
      role="region"
      aria-label="Message composition area"
      {...props}
    >
      {/* Send error display */}
      {sendError && (
        <div 
          className="px-4 pt-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-300"
          role="alert"
          aria-live="assertive"
        >
          <ValidationError 
            message={sendError}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="mt-2 h-7 text-xs focus-visible-enhanced"
            aria-label="Retry sending message"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Career prompts suggestions */}
      {showPrompts && message.length === 0 && (
        <div className="px-4 pt-4 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {CAREER_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptSelect(prompt.prompt)}
                className="flex items-center gap-2 p-3 text-left text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors duration-200 focus-visible-enhanced"
                aria-label={`Use prompt: ${prompt.text}`}
              >
                <prompt.icon className="h-4 w-4 text-primary shrink-0" />
                <span className="text-muted-foreground">{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Main input container - ChatGPT style */}
      <div className="p-4">
        <div className="relative bg-background border border-border/50 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:shadow-md focus-within:border-primary/50">
          {/* Input area */}
          <div className="flex items-end gap-2 p-3">


            {/* Text input */}
            <div className="flex-1 relative">
              <label htmlFor={textareaId} className="sr-only">
                Type your message to the AI career counselor
              </label>
              <Textarea
                id={textareaId}
                ref={textareaRef}
                value={message}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowPrompts(message.length === 0)}
                onBlur={() => setTimeout(() => setShowPrompts(false), 150)}
                placeholder={isLoading ? "AI is responding..." : placeholder}
                disabled={isDisabled}
                className={`
                  resize-none border-0 bg-transparent px-0 py-1 text-base leading-6 placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 theme-transition touch-manipulation focus-visible-enhanced
                  ${isMobile ? "min-h-[24px]" : "min-h-[24px]"} 
                  max-h-32 overflow-y-auto
                  ${hasValidationErrors ? "text-destructive" : ""}
                `}
                rows={1}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                spellCheck="true"
                aria-label="Message input"
                aria-describedby={ariaDescribedBy}
                aria-invalid={hasValidationErrors}
                style={{
                  resize: 'none'
                } as React.CSSProperties}
              />
            </div>


            
            {/* Send button - ChatGPT style */}
            <Button
              onClick={handleSend}
              disabled={!canSend}
              size="icon"
              className={`h-8 w-8 shrink-0 rounded-full transition-all duration-200 touch-manipulation focus-visible-enhanced ${
                canSend 
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
              aria-label={showLoading ? "Sending message" : "Send message"}
              aria-describedby={showLoading ? statusId : undefined}
            >
              {showLoading ? (
                <LoadingSpinner size="sm" className="text-current" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>

          {/* Character count and status */}
          {(message.length > MAX_MESSAGE_LENGTH * 0.8 || showLoading) && (
            <div className="flex items-center justify-between px-4 pb-2 text-xs">
              {message.length > MAX_MESSAGE_LENGTH * 0.8 && (
                <div 
                  className={`transition-colors duration-200 ${
                    message.length > MAX_MESSAGE_LENGTH ? "text-destructive" : "text-muted-foreground"
                  }`}
                  aria-label={`${message.length} of ${MAX_MESSAGE_LENGTH} characters used`}
                  role="status"
                >
                  {message.length}/{MAX_MESSAGE_LENGTH}
                </div>
              )}
              
              {showLoading && (
                <div 
                  className="flex items-center gap-2 text-muted-foreground ml-auto"
                  role="status"
                  aria-label="AI is processing your message"
                >
                  <LoadingSpinner size="sm" aria-hidden="true" />
                  <span>AI is thinking...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Help text */}
        <div className="mt-2 text-xs text-muted-foreground/70 text-center">
          {isMobile 
            ? "Tap send to submit"
            : "Press Enter to send • Shift+Enter for new line"
          }
        </div>
      </div>
      
      {/* Hidden accessibility elements */}
      <div id={helpTextId} className="sr-only">
        {isMobile 
          ? "Type your message and tap the send button to send"
          : "Type your message and press Enter to send, or Shift+Enter for a new line"
        }
      </div>
      
      <div 
        id={statusId}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {isLoading && "Processing your message"}
        {isSubmitting && "Sending message"}
        {canSend && "Ready to send"}
      </div>
      
      {/* Validation error display */}
      {validationErrors.message && (
        <div 
          className="px-4 pb-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-300"
          role="alert"
          aria-live="assertive"
        >
          <ValidationError 
            message={validationErrors.message}
            id={errorId}
          />
        </div>
      )}
    </div>
  );
}