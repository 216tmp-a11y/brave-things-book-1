# Return Button Integration for External Books

## Overview
This document provides the code needed to add a "Back to Library" button in your external book project. When users click "Read Book" from their personal library, they'll be able to return directly back to their library page to continue browsing their books and tracking their reading progress.

## 1. Get Return URL from Query Parameters

When your book loads, extract the return information from the URL:

```javascript
// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const returnUrl = urlParams.get('returnUrl');
const returnLabel = urlParams.get('returnLabel') || 'Back to Library';
const platform = urlParams.get('platform');

// Only show return button if we have return info
const shouldShowReturnButton = returnUrl && platform === 'brave-things-books';
```

## 2. Return Button Component (React)

Add this component to your book project:

```jsx
import React from 'react';

// Return Button Component
export function ReturnToLibraryButton({ returnUrl, returnLabel = 'Back to My Library' }) {
  if (!returnUrl) return null;

  const handleReturn = () => {
    // Navigate back to the platform
    window.location.href = returnUrl;
  };

  return (
    <button
      onClick={handleReturn}
      className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-lg hover:bg-green-50 transition-all duration-200 flex items-center gap-2"
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      {returnLabel}
    </button>
  );
}
```

## 3. Usage in Your Book Component

```jsx
import React, { useState, useEffect } from 'react';
import { ReturnToLibraryButton } from './ReturnToLibraryButton';

export function BookApp() {
  const [returnUrl, setReturnUrl] = useState(null);
  const [returnLabel, setReturnLabel] = useState('Back to My Library');

  useEffect(() => {
    // Extract return parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    const url = urlParams.get('returnUrl');
    const label = urlParams.get('returnLabel');
    const platform = urlParams.get('platform');

    if (url && platform === 'brave-things-books') {
      setReturnUrl(url);
      if (label) setReturnLabel(label);
    }
  }, []);

  return (
    <div className="book-container">
      {/* Return Button - Fixed position top-left */}
      <ReturnToLibraryButton 
        returnUrl={returnUrl} 
        returnLabel={returnLabel} 
      />
      
      {/* Your book content */}
      <div className="book-content">
        {/* ... rest of your book ... */}
      </div>
    </div>
  );
}
```

## 4. Alternative: Simple HTML/JavaScript

If you're not using React, here's a vanilla JavaScript version:

```html
<!-- Add this to your book's HTML -->
<div id="return-button" style="display: none; position: fixed; top: 16px; left: 16px; z-index: 1000;">
  <button 
    id="return-btn" 
    style="
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      border: 1px solid #d1fae5;
      color: #047857;
      padding: 8px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      transition: all 0.2s;
    "
    onmouseover="this.style.background='rgba(240, 253, 244, 0.9)'"
    onmouseout="this.style.background='rgba(255, 255, 255, 0.9)'"
  >
    <svg style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span id="return-label">Back to Library</span>
  </button>
</div>

<script>
  // Initialize return button on page load
  document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl');
    const returnLabel = urlParams.get('returnLabel') || 'Back to My Library';
    const platform = urlParams.get('platform');

    if (returnUrl && platform === 'brave-things-books') {
      // Show the return button
      const returnButton = document.getElementById('return-button');
      const returnBtn = document.getElementById('return-btn');
      const returnLabelEl = document.getElementById('return-label');
      
      returnButton.style.display = 'block';
      returnLabelEl.textContent = returnLabel;
      
      // Add click handler
      returnBtn.addEventListener('click', function() {
        window.location.href = returnUrl;
      });
    }
  });
</script>
```

## 5. CSS Styling (Optional Enhancement)

Add this CSS for better styling:

```css
.return-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid #d1fae5;
  color: #047857;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.return-button:hover {
  background: rgba(240, 253, 244, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.return-button:active {
  transform: translateY(0);
}

/* Responsive: smaller on mobile */
@media (max-width: 640px) {
  .return-button {
    top: 0.5rem;
    left: 0.5rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
}
```

## 6. Testing

To test the return button:

1. Add these parameters to your book URL:
   ```
   ?returnUrl=http://localhost:3000/library&returnLabel=Back%20to%20Library&platform=brave-things-books
   ```

2. The button should appear in the top-left corner
3. Clicking it should navigate back to the library

## Example Integration URL

When users click "Read Book" from their personal library, they'll be taken to a URL like:

```
https://your-book-url.com?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...&platform=brave-things-books&returnUrl=https://brave-things-books.com/library&returnLabel=Back%20to%20My%20Library
```

Your book should:
1. Extract and validate the token for access
2. Show the return button using the returnUrl and returnLabel
3. Allow users to navigate back seamlessly to their personal library

## User Flow

1. **User starts in their library** at `/library` where they can see their purchased books and reading progress
2. **Clicks "Read Book"** → Platform generates secure access token with return URL pointing to `/library`
3. **Gets redirected to your external book** with token and return parameters
4. **Reads the book** with full interactive features
5. **Clicks "Back to My Library"** → Returns directly to their personal library page
6. **Continues in their library** with updated reading progress and can access other books

This creates a seamless reading experience where users never lose their place in the platform.
