# Dashboards Page - Refactored Architecture

This directory contains the refactored dashboards page following modern React best practices.

## Architecture Overview

The code has been refactored from a single monolithic component into a clean, modular architecture:

### Components (`/components`)
- **Sidebar.js** - Navigation sidebar with menu items
- **TopBar.js** - Header section with plan information and API usage
- **ApiKeysCard.js** - Main container for the API keys section
- **ApiKeyTable.js** - Table displaying API keys with actions
- **CreateApiKeyModal.js** - Modal for creating new API keys
- **EditApiKeyModal.js** - Modal for editing existing API keys
- **DeleteConfirmationModal.js** - Confirmation modal for deletions
- **index.js** - Barrel export for clean imports

### Hooks (`/hooks`)
- **useApiKeys.js** - Custom hook managing all API key operations (CRUD, state)
- **useModals.js** - Custom hook managing modal states and operations
- **index.js** - Barrel export for clean imports

### Main Page (`page.js`)
- Clean, focused component that orchestrates the UI
- Uses custom hooks for business logic
- Renders components with proper prop passing

## Key Improvements

1. **Separation of Concerns** - Each component has a single responsibility
2. **Custom Hooks** - Business logic extracted into reusable hooks
3. **Clean Imports** - Barrel exports for organized imports
4. **Navy Blue Theme** - Applied consistent navy blue color scheme
5. **Accessibility** - Proper ARIA labels and keyboard navigation
6. **Error Handling** - Centralized error management
7. **State Management** - Organized state with custom hooks
8. **Reusability** - Components can be easily reused elsewhere

## Usage

```jsx
import { Sidebar, TopBar, ApiKeysCard } from "./components";
import { useApiKeys, useModals } from "./hooks";

const DashboardsPage = () => {
  const { apiKeys, loading, error, createKey } = useApiKeys();
  const { showCreate, openCreate, closeCreate } = useModals();
  
  // Component logic here
};
```

## Benefits

- **Maintainability** - Easy to find and modify specific functionality
- **Testability** - Components and hooks can be tested in isolation
- **Reusability** - Components can be used in other parts of the app
- **Readability** - Clear separation makes code easier to understand
- **Scalability** - Easy to add new features or modify existing ones
