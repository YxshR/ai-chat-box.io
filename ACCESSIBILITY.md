# Accessibility Implementation Guide

This document outlines the comprehensive accessibility features implemented in the AI Chat Frontend application to ensure WCAG 2.1 AA compliance and provide an inclusive user experience.

## 🎯 Accessibility Standards Compliance

### WCAG 2.1 Level AA
- ✅ **Perceivable**: All content is perceivable by users with disabilities
- ✅ **Operable**: All functionality is operable via keyboard and assistive technologies
- ✅ **Understandable**: Content and UI operation is understandable
- ✅ **Robust**: Content works with various assistive technologies

### WCAG 2.1 Level AAA (Partial)
- ✅ **Enhanced Color Contrast**: Utilities provided for 7:1 contrast ratios
- ✅ **Advanced Keyboard Navigation**: Comprehensive keyboard shortcuts
- ✅ **Detailed Screen Reader Support**: Rich ARIA descriptions

## 🔧 Implementation Details

### 1. ARIA Labels and Roles

#### Main Application Structure
```tsx
// Application container with proper roles
<div role="application" aria-label="Oration AI Career Counselor Chat Application">
  <main role="main" aria-label="Chat conversation area">
    <aside role="complementary" aria-label="Chat sessions sidebar">
```

#### Interactive Elements
- All buttons have descriptive `aria-label` attributes
- Form inputs have associated labels and descriptions
- Dynamic content uses `aria-live` regions
- Modal dialogs use proper `aria-modal` and focus management

#### Message Structure
```tsx
// Each message is properly structured for screen readers
<div role="article" aria-label="Message from AI assistant: Hello! How can I help you today?">
  <div role="region" aria-label="Message content">
```

### 2. Keyboard Navigation Support

#### Global Keyboard Shortcuts
- **Escape**: Close modals, sidebars, or cancel operations
- **Tab/Shift+Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and links
- **Arrow Keys**: Navigate through lists and menus

#### Message Input
- **Enter**: Send message (desktop)
- **Shift+Enter**: New line (desktop)
- **Tab**: Move to send button

#### Session Sidebar
- **Arrow Up/Down**: Navigate through sessions
- **Enter**: Select session
- **Delete**: Remove session (with confirmation)

### 3. Focus Management

#### Focus Trapping
```tsx
// Automatic focus trapping in modal states
const { containerRef, focusFirst } = useFocusManagement({
  trapFocus: isMobile,
  restoreFocus: true,
  autoFocus: true,
});
```

#### Focus Indicators
- Enhanced focus rings with 3px outline
- High contrast mode support
- Visible focus indicators on all interactive elements

### 4. Screen Reader Support

#### Live Regions
```tsx
// Status announcements for dynamic content
<div aria-live="polite" aria-atomic="true">
  {isLoading && "AI is processing your message"}
</div>
```

#### Screen Reader Announcements
```tsx
// Programmatic announcements for important events
announceToScreenReader("New chat session created", "polite");
announceToScreenReader("Error sending message", "assertive");
```

#### Hidden Content for Screen Readers
```tsx
// Additional context for screen readers
<span className="sr-only">
  Message 1 of 5 in conversation
</span>
```

### 5. Color Contrast Compliance

#### Automated Validation
```tsx
// Built-in color contrast checking
const contrastResult = checkContrast('#000000', '#ffffff');
// Returns: { ratio: 21, wcagAA: true, wcagAAA: true }
```

#### Theme Support
- Light theme: All text meets WCAG AA standards (4.5:1)
- Dark theme: Enhanced contrast for better readability
- High contrast mode detection and adaptation

### 6. Mobile Accessibility

#### Touch Targets
- Minimum 44px touch targets on mobile devices
- Adequate spacing between interactive elements
- Touch-friendly button sizes and padding

#### Mobile-Specific Features
```tsx
// Mobile-optimized interactions
<Button
  size={isMobile ? "touch" : "default"}
  className="min-h-[44px] min-w-[44px] touch-manipulation"
>
```

#### Gesture Alternatives
- Swipe gestures have keyboard alternatives
- All touch interactions work with assistive technologies

## 🛠️ Accessibility Utilities

### Custom Hooks

#### useKeyboardNavigation
```tsx
useKeyboardNavigation({
  onEscape: () => closeSidebar(),
  onEnter: () => selectItem(),
  onArrowUp: () => navigateUp(),
  onArrowDown: () => navigateDown(),
});
```

#### useFocusManagement
```tsx
const { containerRef, focusFirst } = useFocusManagement({
  trapFocus: true,
  restoreFocus: true,
  autoFocus: true,
});
```

### Utility Functions

#### Screen Reader Announcements
```tsx
announceToScreenReader(message, priority);
// priority: 'polite' | 'assertive'
```

#### ARIA Attribute Helpers
```tsx
getValidationAttributes(isValid, errorMessage);
getExpandableAttributes(isExpanded, controlsId);
getModalAttributes(isOpen, labelledBy, describedBy);
```

### CSS Utilities

#### Screen Reader Classes
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  /* ... restore normal styling */
}
```

#### Enhanced Focus Indicators
```css
.focus-visible-enhanced:focus-visible {
  outline: 3px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: 4px;
}
```

## 🧪 Testing

### Automated Testing
```bash
# Run accessibility tests
npm test -- accessibility.test.tsx

# Verify implementation
node scripts/verify-accessibility.js
```

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] All focusable elements have visible focus indicators
- [ ] Keyboard shortcuts work as expected
- [ ] No keyboard traps (except intentional modal focus trapping)

#### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with TalkBack (Android)

#### Color and Contrast
- [ ] All text meets WCAG AA contrast requirements
- [ ] UI works in high contrast mode
- [ ] Color is not the only way to convey information

#### Mobile Accessibility
- [ ] Touch targets are at least 44px
- [ ] Swipe gestures have alternatives
- [ ] Works with mobile screen readers

## 🚀 Usage Examples

### Adding Accessibility to New Components

```tsx
import { 
  generateId, 
  announceToScreenReader,
  getValidationAttributes 
} from '@/lib/utils/accessibility';

function MyComponent() {
  const id = generateId('my-component');
  
  const handleAction = () => {
    announceToScreenReader('Action completed', 'polite');
  };
  
  return (
    <div
      id={id}
      role="region"
      aria-label="My accessible component"
      {...getValidationAttributes(isValid, errorMessage)}
    >
      {/* Component content */}
    </div>
  );
}
```

### Keyboard Navigation Integration

```tsx
import { useKeyboardNavigation } from '@/lib/hooks/use-keyboard-navigation';

function NavigableList({ items, onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  useKeyboardNavigation({
    onArrowUp: () => setSelectedIndex(Math.max(0, selectedIndex - 1)),
    onArrowDown: () => setSelectedIndex(Math.min(items.length - 1, selectedIndex + 1)),
    onEnter: () => onSelect(items[selectedIndex]),
    enabled: true,
  });
  
  return (
    <ul role="listbox">
      {items.map((item, index) => (
        <li
          key={item.id}
          role="option"
          aria-selected={index === selectedIndex}
          tabIndex={index === selectedIndex ? 0 : -1}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

## 📚 Resources

### WCAG Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)

### Screen Readers
- [NVDA (Free)](https://www.nvaccess.org/download/)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver](https://support.apple.com/guide/voiceover/) (Built into macOS/iOS)

## 🔄 Continuous Improvement

### Regular Audits
1. Run automated accessibility tests in CI/CD
2. Conduct quarterly manual testing sessions
3. Gather feedback from users with disabilities
4. Stay updated with WCAG guidelines and best practices

### Monitoring
- Track accessibility metrics in analytics
- Monitor user feedback and support requests
- Regular code reviews for accessibility compliance
- Performance impact assessment of accessibility features

---

**Note**: This implementation provides a solid foundation for accessibility, but ongoing testing with real users who have disabilities is essential for ensuring the best possible experience.