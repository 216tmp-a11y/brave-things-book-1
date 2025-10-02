# Book Integration Guide

## Overview

The Brave Things Books platform provides a complete token-based access system that allows external book projects to integrate seamlessly with centralized user management and sales.

## Integration Flow

```
1. User clicks "Read Book" on platform
   ↓
2. Platform checks for existing valid token or generates new one (PERSISTENT)
   ↓
3. Platform redirects to external book with stable token
   ↓
4. External book validates token via API
   ↓
5. Book allows access and syncs progress back

🔄 Token Persistence: Same user + same book = same token (until expiration)
✅ This FIXES the "new token every time" issue for continuous tracking
```

## API Endpoints

### 1. Generate Access Token
**POST** `/api/book-access/generate-token`

**Purpose:** Called by the platform when user clicks "Read Book"

**Request:**
```json
{
  "bookId": "wtbtg"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "expiresAt": 1672531200,
  "bookUrl": "https://your-book-url.com?token=...&platform=brave-things-books"
}
```

### 2. Validate Token (For External Books)
**POST** `/api/book-access/validate-token`

**Purpose:** Called by external books to verify user access

**Request:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "bookId": "wtbtg"
}
```

**Response:**
```json
{
  "valid": true,
  "userId": "user123",
  "bookId": "wtbtg",
  "permissions": ["read", "bookmark", "progress"],
  "user": {
    "id": "user123",
    "name": "Sarah Johnson",
    "email": "sarah@example.com"
  }
}
```

### 3. Update Reading Progress
**POST** `/api/book-access/update-progress`

**Purpose:** Called by external books to sync reading progress

**Request:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "progress": 45.5,
  "currentPage": 12,
  "currentChapter": "Chapter 3: The Brave Forest",
  "timeSpent": 15,
  "bookmarks": [
    {
      "page": 8,
      "chapter": "Chapter 2",
      "note": "Favorite illustration"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "userId": "user123",
    "bookId": "wtbtg",
    "progress": 45.5,
    "currentPage": 12,
    "currentChapter": "Chapter 3: The Brave Forest",
    "timeSpent": 145,
    "lastReadAt": "2024-01-15T10:30:00.000Z",
    "bookmarks": [...]
  }
}
```

### 4. Get Reading Progress
**GET** `/api/book-access/progress/:userId/:bookId`

**Purpose:** Retrieve current reading progress

**Response:**
```json
{
  "progress": 45.5,
  "currentPage": 12,
  "currentChapter": "Chapter 3: The Brave Forest",
  "timeSpent": 145,
  "lastReadAt": "2024-01-15T10:30:00.000Z",
  "bookmarks": [...]
}
```

## Implementation Guide for External Books

### Step 1: Extract Token and Return Information from URL
```javascript
// Get token and return navigation from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const platform = urlParams.get('platform');
const returnUrl = urlParams.get('returnUrl');
const returnLabel = urlParams.get('returnLabel') || 'Back to Account';

if (platform !== 'brave-things-books' || !token) {
  // Handle unauthorized access
  if (returnUrl) {
    window.location.href = returnUrl;
  } else {
    window.location.href = 'https://brave-things-books.com/unauthorized';
  }
}

// Store return info globally for use in navigation
window.braveThingsReturn = {
  url: returnUrl,
  label: returnLabel
};
```

### Step 2: Validate Token (Enhanced with Return Info)
```javascript
async function validateAccess(token, bookId) {
  try {
    // Use enhanced validation endpoint for full integration
    const response = await fetch('https://brave-things-books.com/api/book-access/validate-enhanced', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, bookId })
    });
    
    const result = await response.json();
    
    if (result.valid) {
      // Store return information from API response
      window.braveThingsReturn = {
        url: result.return_info?.url || window.braveThingsReturn?.url,
        label: result.return_info?.label || window.braveThingsReturn?.label,
        platform: result.return_info?.platform || 'Brave Things Books'
      };
      
      // User has access, show the book
      return {
        user: result.user,
        bookmarks: result.bookmarks,
        progress: result.progress,
        sessionId: result.analytics_session_id
      };
    } else {
      // Invalid token, redirect to purchase or return URL
      const redirectUrl = window.braveThingsReturn?.url || 'https://brave-things-books.com/store/wtbtg';
      window.location.href = redirectUrl;
    }
  } catch (error) {
    console.error('Token validation failed:', error);
    // Handle error appropriately
  }
}
```

### Step 3: Add Return to Account Button

```javascript
function createReturnButton() {
  // Create a floating return button
  const returnButton = document.createElement('button');
  returnButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
    ${window.braveThingsReturn?.label || 'Back to Account'}
  `;
  
  // Style the button
  returnButton.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 10000;
    background: #2D5F3F;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 16px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(45, 95, 63, 0.15);
    transition: all 0.2s ease;
    text-decoration: none;
  `;
  
  // Add hover effects
  returnButton.addEventListener('mouseenter', () => {
    returnButton.style.background = '#1e4a33';
    returnButton.style.transform = 'translateY(-1px)';
    returnButton.style.boxShadow = '0 6px 16px rgba(45, 95, 63, 0.2)';
  });
  
  returnButton.addEventListener('mouseleave', () => {
    returnButton.style.background = '#2D5F3F';
    returnButton.style.transform = 'translateY(0)';
    returnButton.style.boxShadow = '0 4px 12px rgba(45, 95, 63, 0.15)';
  });
  
  // Handle click
  returnButton.addEventListener('click', () => {
    if (window.braveThingsReturn?.url) {
      window.location.href = window.braveThingsReturn.url;
    } else {
      // Fallback if no return URL is available
      window.location.href = 'https://brave-things-books.com/library';
    }
  });
  
  // Add to page
  document.body.appendChild(returnButton);
  
  return returnButton;
}

// Call this function after successful token validation
function initializeBookWithReturn() {
  // Create the return button
  createReturnButton();
  
  // Initialize your book content
  initializeBookContent();
}
```

### Alternative: Simple Text Link
If you prefer a simpler approach, you can add a text link:

```javascript
function addReturnLink() {
  const returnLink = document.createElement('a');
  returnLink.href = window.braveThingsReturn?.url || 'https://brave-things-books.com/library';
  returnLink.textContent = `← ${window.braveThingsReturn?.label || 'Back to Library'}`;
  returnLink.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 10000;
    color: #2D5F3F;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
  `;
  
  document.body.appendChild(returnLink);
}
```

### Step 4: Sync Reading Progress
```javascript
async function updateProgress(token, progressData) {
  try {
    const response = await fetch('https://brave-things-books.com/api/book-access/update-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        progress: progressData.progress,
        currentPage: progressData.currentPage,
        currentChapter: progressData.currentChapter,
        timeSpent: progressData.timeSpent,
        bookmarks: progressData.bookmarks
      })
    });
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Progress update failed:', error);
    return false;
  }
}

// Example: Update progress every 30 seconds while reading
setInterval(() => {
  const currentProgress = calculateReadingProgress(); // Your implementation
  updateProgress(token, currentProgress);
}, 30000);
```

## Security Features

- **JWT Tokens:** Secure, signed tokens with expiration
- **CORS Protection:** Configurable origin restrictions
- **Permission System:** Granular access control (read, bookmark, progress)
- **Token Expiry:** 24-hour token lifetime
- **Purchase Verification:** Validates user owns the book

## Error Handling

| Status Code | Meaning | Action |
|-------------|---------|--------|
| 403 | Book not purchased | Redirect to store |
| 404 | Book not found | Show error message |
| 401 | Invalid token | Re-authenticate |
| 500 | Server error | Retry or show error |

## Testing the Integration

### Health Check
```bash
curl https://brave-things-books.com/api/book-access/health
```

### Test Token Generation
```bash
curl -X POST https://brave-things-books.com/api/book-access/generate-token \
  -H "Content-Type: application/json" \
  -d '{"bookId": "wtbtg"}'
```

### Test Token Validation
```bash
curl -X POST https://brave-things-books.com/api/book-access/validate-token \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_TOKEN", "bookId": "wtbtg"}'
```

## Complete Example Integration: Where the Brave Things Grow

```html
<!DOCTYPE html>
<html>
<head>
    <title>Where the Brave Things Grow</title>
    <style>
        body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
        #book-content { padding: 20px 60px 20px 20px; /* Extra left padding for return button */ }
        .loading { text-align: center; padding: 50px; color: #666; }
    </style>
</head>
<body>
    <div id="loading" class="loading">
        Loading your personalized book experience...
    </div>
    
    <div id="book-content" style="display: none;">
        <h1>Where the Brave Things Grow</h1>
        <p>Welcome! Your adventure begins here...</p>
        <!-- Your interactive book content here -->
    </div>
    
    <script>
        // Global variables for integration
        let currentToken = null;
        let currentUser = null;
        let sessionId = null;
        
        // Extract URL parameters including return information
        function extractUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            return {
                token: urlParams.get('token'),
                platform: urlParams.get('platform'),
                returnUrl: urlParams.get('returnUrl'),
                returnLabel: urlParams.get('returnLabel') || 'Back to Account'
            };
        }
        
        // Enhanced token validation with return info
        async function validateAccess(token, bookId) {
            try {
                const response = await fetch('https://brave-things-books.com/api/book-access/validate-enhanced', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, bookId })
                });
                
                const result = await response.json();
                
                if (result.valid) {
                    // Store return information
                    window.braveThingsReturn = result.return_info || window.braveThingsReturn;
                    return result;
                } else {
                    throw new Error('Invalid access token');
                }
            } catch (error) {
                console.error('Token validation failed:', error);
                return null;
            }
        }
        
        // Create return button
        function createReturnButton() {
            const returnButton = document.createElement('button');
            returnButton.innerHTML = \`
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                \${window.braveThingsReturn?.label || 'Back to Account'}
            \`;
            
            returnButton.style.cssText = \`
                position: fixed; top: 20px; left: 20px; z-index: 10000;
                background: #2D5F3F; color: white; border: none; border-radius: 8px;
                padding: 12px 16px; font-size: 14px; font-weight: 500;
                display: flex; align-items: center; gap: 8px; cursor: pointer;
                box-shadow: 0 4px 12px rgba(45, 95, 63, 0.15);
                transition: all 0.2s ease;
            \`;
            
            returnButton.addEventListener('click', () => {
                const returnUrl = window.braveThingsReturn?.url || 'https://brave-things-books.com/library';
                window.location.href = returnUrl;
            });
            
            document.body.appendChild(returnButton);
        }
        
        // Update reading progress
        async function updateProgress(progressData) {
            if (!currentToken) return;
            
            try {
                await fetch('https://brave-things-books.com/api/book-access/update-progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: currentToken,
                        ...progressData
                    })
                });
            } catch (error) {
                console.error('Progress update failed:', error);
            }
        }
        
        // Main initialization function
        async function initializeBook() {
            const params = extractUrlParams();
            
            // Store return info from URL
            window.braveThingsReturn = {
                url: params.returnUrl,
                label: params.returnLabel
            };
            
            if (params.platform !== 'brave-things-books' || !params.token) {
                const redirectUrl = params.returnUrl || 'https://brave-things-books.com/store/wtbtg';
                window.location.href = redirectUrl;
                return;
            }
            
            // Validate access
            const validation = await validateAccess(params.token, 'wtbtg');
            if (validation) {
                currentToken = params.token;
                currentUser = validation.user;
                sessionId = validation.analytics_session_id;
                
                // Show book content
                document.getElementById('loading').style.display = 'none';
                document.getElementById('book-content').style.display = 'block';
                
                // Add return button
                createReturnButton();
                
                // Start the reading experience
                startReadingSession();
            } else {
                // Redirect on validation failure
                const redirectUrl = window.braveThingsReturn?.url || 'https://brave-things-books.com/store/wtbtg';
                window.location.href = redirectUrl;
            }
        }
        
        function startReadingSession() {
            console.log('Starting reading session for:', currentUser.name);
            
            // Example: Update progress every 30 seconds
            setInterval(() => {
                const progress = calculateCurrentProgress(); // Your implementation
                updateProgress(progress);
            }, 30000);
            
            // Your book-specific logic here
        }
        
        function calculateCurrentProgress() {
            // Example progress calculation
            return {
                progress: 25, // percentage
                currentPage: 5,
                currentChapter: "Chapter 2: The Colorful Chameleon",
                timeSpent: 10 // minutes spent in this session
            };
        }
        
        // Initialize when page loads
        initializeBook();
    </script>
</body>
</html>
```

### Quick Integration Checklist

For external book developers, here's what you need to implement:

1. **✅ Extract URL Parameters**: Get `token`, `returnUrl`, and `returnLabel`
2. **✅ Validate Token**: Use `/validate-enhanced` endpoint 
3. **✅ Add Return Button**: Fixed position button linking back to platform
4. **✅ Sync Progress**: Call `/update-progress` periodically
5. **✅ Error Handling**: Redirect to return URL on failures

### Return Button Styles

The return button uses Brave Things Books brand colors:
- **Background**: `#2D5F3F` (Forest Green)
- **Hover**: `#1e4a33` (Darker Forest)
- **Position**: Fixed top-left corner
- **Style**: Friendly rounded button with back arrow

This integration provides a seamless user experience where readers can easily navigate back to their account while maintaining their reading progress.

This integration system provides a complete, secure foundation for your publishing ecosystem while maintaining the flexibility for each book to have its own unique experience and technology stack.
