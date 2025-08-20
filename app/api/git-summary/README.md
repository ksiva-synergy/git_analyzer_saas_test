# Git Summary API Endpoint

This endpoint provides AI-powered analysis of GitHub repositories by analyzing their README files and generating comprehensive summaries.

## Features

- **API Key Authentication**: Secure access using Supabase API keys
- **GitHub Integration**: Fetches README content from GitHub repositories
- **AI-Powered Analysis**: Uses OpenAI GPT to analyze repository content
- **Schema Validation**: Zod schema ensures consistent response format
- **Flexible Input**: Accepts git URLs via query parameters or request body

## Environment Variables Required

```bash
# Required for API key validation
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required for AI-powered summaries
OPENAI_API_KEY=your_openai_api_key
```

## API Usage

### GET Request (Query Parameters)
```bash
GET /api/git-summary?gitUrl=https://github.com/username/repository
Headers: x-api-key: your-api-key-here
```

### POST Request (Request Body)
```bash
POST /api/git-summary
Headers: 
  x-api-key: your-api-key-here
  Content-Type: application/json
Body: {"gitUrl": "https://github.com/username/repository"}
```

## Response Format

### Success Response
```json
{
  "valid": true,
  "message": "Git summary generated successfully",
  "keyId": "api-key-id",
  "gitUrl": "https://github.com/username/repository",
  "ai_available": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "status": "success",
  "summary": {
    "repository": "https://github.com/username/repository",
    "readme_info": {
      "found": true,
      "path": "README.md",
      "size": 1024,
      "content_preview": "Repository description..."
    },
    "ai_analysis": {
      "repository_analysis": "Comprehensive overview...",
      "commit_history_insights": "Development insights...",
      "tech_stack_overview": "Technology analysis...",
      "project_structure_overview": "Architecture overview..."
    },
    "status": "ai_enhanced"
  }
}
```

### Error Response
```json
{
  "valid": false,
  "error": "Error description",
  "details": "Detailed error information",
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "status": "error_type"
}
```

## Error Types

- `missing_api_key`: API key not provided in x-api-key header
- `invalid_format`: API key format is invalid
- `key_not_found`: API key doesn't exist in database
- `key_inactive`: API key has been deactivated
- `missing_git_url`: Git URL not provided
- `invalid_git_url`: Git URL format is invalid
- `github_only`: Only GitHub repositories are currently supported
- `summary_generation_failed`: Error during summary generation

## Dependencies

- `@langchain/openai`: OpenAI integration
- `@langchain/core`: Core LangChain functionality
- `zod`: Schema validation
- `@supabase/supabase-js`: Database integration

## Limitations

- Currently only supports GitHub repositories
- Requires public repositories for full analysis
- AI analysis depends on README content quality
- Rate limited by GitHub API and OpenAI API

## Future Enhancements

- Support for other git hosting platforms
- Repository cloning for deeper analysis
- Commit history analysis
- Language and framework detection
- Dependency analysis
- Security vulnerability scanning
