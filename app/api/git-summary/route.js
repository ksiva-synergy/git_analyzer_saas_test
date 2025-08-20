import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

// Schema for AI response validation
const GitSummarySchema = z.object({
  repository_analysis: z.string().min(10, "Repository analysis must be at least 10 characters"),
  commit_history_insights: z.string().min(10, "Commit history insights must be at least 10 characters"),
  tech_stack_overview: z.string().min(10, "Tech stack overview must be at least 10 characters"),
  project_structure_overview: z.string().min(10, "Project structure overview must be at least 10 characters")
});

// Function to create and execute LangChain chain for git summary
async function generateAIGitSummary(readmeContent) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    // Initialize the LLM (OpenAI GPT)
    const llm = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create a prompt template for git repository analysis
    const promptTemplate = PromptTemplate.fromTemplate(`
      You are an expert software developer and code analyst. Analyze the following GitHub repository README content and provide a comprehensive summary.

      README Content:
      {readmeContent}

      Based on the README content, provide a detailed analysis in the following JSON format:

      {{
        "repository_analysis": "A comprehensive overview of what this repository is about, its purpose, and main functionality",
        "commit_history_insights": "Insights about the development process, release patterns, and project maturity based on the README information",
        "tech_stack_overview": "Detailed analysis of technologies, frameworks, languages, and tools mentioned in the README",
        "project_structure_overview": "Overview of the project organization, architecture, and key components as described in the README"
      }}

      Ensure your response is a valid JSON object with these exact field names. Be thorough but concise in your analysis.
    `);

    // Create a chain that combines the prompt and LLM
    const chain = RunnableSequence.from([
      promptTemplate,
      llm,
    ]);

    // Execute the chain with the README content
    const result = await chain.invoke({
      readmeContent: readmeContent || "No README content available for analysis."
    });

    // Parse the LLM response
    let parsedResult;
    try {
      // The result content should be a JSON string
      const responseText = result.content || result;
      parsedResult = JSON.parse(responseText);
      
      // Validate the response against our schema
      const validatedResult = GitSummarySchema.parse(parsedResult);
      return validatedResult;
      
    } catch (parseError) {
      console.error('Error parsing or validating LLM response:', parseError);
      // Fallback response if parsing fails
      return {
        repository_analysis: "Analysis unavailable - unable to parse LLM response",
        commit_history_insights: "Commit history analysis requires further repository data",
        tech_stack_overview: "Technology stack information not available",
        project_structure_overview: "Project structure overview requires repository scanning"
      };
    }

  } catch (error) {
    console.error('Error in AI git summary generation:', error);
    
    // Return fallback response
    return {
      repository_analysis: "AI analysis unavailable due to processing error",
      commit_history_insights: "Commit history analysis requires repository access",
      tech_stack_overview: "Technology stack detection needs implementation",
      project_structure_overview: "Project structure overview requires repository scanning"
    };
  }
}

// Enhanced git summary generation function that integrates with AI
async function generateGitSummary(gitUrl) {
  try {
    // Helper function to extract owner and repo from GitHub URL
    function parseGitHubUrl(url) {
      try {
        const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
        if (!match) return null;
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, '') // Remove .git suffix if present
        };
      } catch (error) {
        return null;
      }
    }

    // Function to fetch README.md from GitHub
    async function fetchReadme(gitUrl) {
      try {
        const parsed = parseGitHubUrl(gitUrl);
        if (!parsed) {
          throw new Error('Invalid GitHub URL format');
        }

        const { owner, repo } = parsed;
        const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
        
        const response = await fetch(readmeUrl, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Synergize-App'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            return null; // README not found
          }
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        // Content is base64 encoded
        const readmeContent = Buffer.from(data.content, 'base64').toString('utf-8');
        
        return {
          content: readmeContent,
          path: data.path,
          size: data.size
        };
      } catch (error) {
        console.error('Error fetching README:', error);
        return null;
      }
    }

    // Try to fetch README for analysis
    const readme = await fetchReadme(gitUrl);
    console.log('Git URL:', gitUrl);
    console.log('Parsed README:', readme ? 'Found' : 'Not found');
    
    if (readme) {
      console.log('README size:', readme.size);
      console.log('README path:', readme.path);
      console.log('README content preview:', readme.content.substring(0, 200) + '...');
      
      // Generate AI-powered summary using the README content
      const aiSummary = await generateAIGitSummary(readme.content);
      
      return {
        repository: gitUrl,
        readme_info: {
          found: true,
          path: readme.path,
          size: readme.size,
          content_preview: readme.content.substring(0, 300) + '...'
        },
        ai_analysis: aiSummary,
        status: "ai_enhanced"
      };
    } else {
      // No README found, return basic info
      return {
        repository: gitUrl,
        readme_info: {
          found: false,
          message: "No README.md found in this repository"
        },
        ai_analysis: {
          repository_analysis: "Repository analysis limited - no README available",
          commit_history_insights: "Commit history analysis requires repository access",
          tech_stack_overview: "Technology stack detection needs repository scanning",
          project_structure_overview: "Project structure overview requires repository access"
        },
        status: "basic"
      };
    }
    
  } catch (error) {
    console.error('Error in generateGitSummary:', error);
    throw error; // Re-throw to be handled by the calling function
  }
}

// Helper function to extract git URL from request (either query params or body)
async function extractGitUrl(request) {
  try {
    // First try to get from query parameters
    const url = new URL(request.url);
    const gitUrlFromQuery = url.searchParams.get('gitUrl');
    
    if (gitUrlFromQuery) {
      return gitUrlFromQuery;
    }
    
    // If not in query params, try to get from request body
    try {
      const body = await request.json();
      return body.gitUrl;
    } catch (bodyError) {
      // If body parsing fails, return null
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  return await handleRequest(request);
}

export async function POST(request) {
  return await handleRequest(request);
}

async function handleRequest(request) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured');
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Database not configured',
          details: 'Please check your environment variables and ensure Supabase is properly configured.',
          status: 'configuration_error'
        },
        { status: 500 }
      );
    }

    // Check if OpenAI is configured (optional but recommended for enhanced summaries)
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured - AI-powered summaries will not be available');
    }

    // Get API key from header
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'API key is required',
          details: 'Please provide an API key in the x-api-key header.',
          status: 'missing_api_key'
        },
        { status: 400 }
      );
    }

    // Validate API key format
    if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Invalid API key format',
          details: 'API key must be a non-empty string.',
          status: 'invalid_format'
        },
        { status: 400 }
      );
    }

    // Check if API key follows expected pattern (optional but helpful)
    if (!apiKey.startsWith('syn-') && !apiKey.startsWith('sk_')) {
      console.log('API key format warning - unexpected prefix:', apiKey.substring(0, 10) + '...');
    }

    console.log('Attempting to validate API key:', apiKey.substring(0, 10) + '...');

    // Try to validate the API key directly first
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, key, created_at, label, description, usage, is_active')
        .eq('key', apiKey)
        .single();

      if (error) {
        // Handle specific database errors
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Database setup required',
              details: 'The API keys table has not been created yet. Please run the database setup script first.',
              setup_instructions: 'Run the SQL script in your Supabase SQL editor to create the required tables.',
              status: 'table_not_found'
            },
            { status: 500 }
          );
        }
        
        if (error.code === '42501') {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Database permissions issue',
              details: 'The application does not have permission to access the database. Please check your Supabase configuration.',
              status: 'permission_denied'
            },
            { status: 500 }
          );
        }
        
        if (error.code === 'PGRST200') {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'API key not found',
              details: 'The provided API key does not exist in our system.',
              suggestions: [
                'Check if the API key is correct',
                'Ensure the API key hasn\'t been deleted',
                'Verify you\'re using the right environment (development/staging/production)'
              ],
              status: 'key_not_found'
            },
            { status: 401 }
          );
        }
        
        // For other database errors, return a generic error
        console.error('Database query error:', error);
        return NextResponse.json(
          { 
            valid: false, 
            error: 'Database query error',
            details: `Unable to validate API key: ${error.message}`,
            status: 'query_error'
          },
          { status: 500 }
        );
      }

      // Check if the key is active
      if (data && data.is_active === false) {
        return NextResponse.json(
          { 
            valid: false, 
            error: 'API key is inactive',
            details: 'This API key exists but has been deactivated.',
            suggestions: [
              'Contact your administrator to reactivate the key',
              'Generate a new API key if needed'
            ],
            status: 'key_inactive'
          },
          { status: 401 }
        );
      }

      if (data) {
        console.log('API key validated successfully:', data.id);
        
        // Extract git URL from request (either query params or body)
        const gitUrl = await extractGitUrl(request);
        
        if (!gitUrl) {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Git URL is required',
              details: 'Please provide a git URL either as a query parameter (?gitUrl=...) or in the request body.',
              examples: [
                'GET /api/git-summary?gitUrl=https://github.com/username/repo',
                'POST /api/git-summary with body: {"gitUrl": "https://github.com/username/repo"}'
              ],
              status: 'missing_git_url'
            },
            { status: 400 }
          );
        }

        // Validate git URL format
        if (typeof gitUrl !== 'string' || gitUrl.trim().length === 0) {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Invalid git URL format',
              details: 'Git URL must be a non-empty string.',
              status: 'invalid_git_url_format'
            },
            { status: 400 }
          );
        }

        // Enhanced git URL validation with GitHub-specific validation
        const gitUrlPattern = /^(https?:\/\/|git:\/\/|ssh:\/\/|git@)[^\s]+$/;
        if (!gitUrlPattern.test(gitUrl.trim())) {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Invalid git URL format',
              details: 'Please provide a valid git repository URL (HTTPS, SSH, or git:// protocol).',
              examples: [
                'https://github.com/username/repo.git',
                'git@github.com:username/repo.git',
                'ssh://git@github.com:username/repo.git'
              ],
              status: 'invalid_git_url'
            },
            { status: 400 }
          );
        }

        // Additional GitHub-specific validation
        if (!gitUrl.trim().includes('github.com')) {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'GitHub repository required',
              details: 'Currently, only GitHub repositories are supported for AI-powered analysis.',
              suggestions: [
                'Use a GitHub repository URL (e.g., https://github.com/username/repo)',
                'Ensure the repository is public for full analysis',
                'Check that the repository exists and is accessible'
              ],
              status: 'github_only'
            },
            { status: 400 }
          );
        }

        try {
          // Generate comprehensive git summary with AI analysis
          const summary = await generateGitSummary(gitUrl);
          
          return NextResponse.json({
            valid: true,
            message: 'Git summary generated successfully',
            keyId: data.id,
            gitUrl: gitUrl.trim(),
            summary: summary,
            ai_available: !!process.env.OPENAI_API_KEY,
            timestamp: new Date().toISOString(),
            status: 'success'
          });
          
        } catch (summaryError) {
          console.error('Git summary generation error:', summaryError);
          
          // Provide more specific error details
          let errorDetails = 'Unable to generate summary for the provided git repository.';
          let suggestions = [
            'Check if the repository is accessible',
            'Verify the repository URL is correct',
            'Ensure the repository is not private or requires authentication'
          ];
          
          if (summaryError.message.includes('GitHub API error')) {
            errorDetails = 'GitHub API access issue - the repository may be private or require authentication.';
            suggestions = [
              'Ensure the repository is public',
              'Check if the repository exists',
              'Verify the URL format is correct'
            ];
          } else if (summaryError.message.includes('OpenAI')) {
            errorDetails = 'AI analysis service unavailable - check OpenAI API configuration.';
            suggestions = [
              'Verify OPENAI_API_KEY environment variable',
              'Check OpenAI API quota and billing',
              'Ensure the API key has proper permissions'
            ];
          }
          
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Git summary generation failed',
              details: errorDetails,
              suggestions: suggestions,
              status: 'summary_generation_failed'
            },
            { status: 500 }
          );
        }
      }

      // If no data returned, the key doesn't exist
      return NextResponse.json(
        { 
          valid: false, 
          error: 'API key not found',
          details: 'The provided API key does not exist in our system.',
          suggestions: [
            'Check if the API key is correct',
            'Ensure the API key hasn\'t been deleted',
            'Verify you\'re using the right environment (development/staging/production)'
          ],
          status: 'key_not_found'
        },
        { status: 401 }
      );

    } catch (dbError) {
      // If we get a database connection error, check if it's a table structure issue
      console.error('Database connection error:', dbError);
      
      // Try a simple table check to see if it's a structure issue
      try {
        const { error: tableError } = await supabase
          .from('api_keys')
          .select('*')
          .limit(1);
        
        if (tableError && tableError.code === 'PGRST116') {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Database setup required',
              details: 'The API keys table has not been created yet. Please run the database setup script first.',
              setup_instructions: 'Run the SQL script in your Supabase SQL editor to create the required tables.',
              status: 'table_not_found'
            },
            { status: 500 }
          );
        }
      } catch (tableCheckError) {
        console.error('Table check error:', tableCheckError);
      }
      
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Database connection error',
          details: 'Unable to connect to the database. Please try again later.',
          status: 'connection_error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API key validation error:', error);
    
    // Handle specific error types
    if (error.name === 'SyntaxError') {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Invalid request format',
          details: 'The request body contains invalid JSON.',
          suggestions: [
            'Check your request body format',
            'Ensure the JSON is properly formatted'
          ],
          status: 'invalid_json'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Internal server error',
        details: 'An unexpected error occurred while processing your request.',
        status: 'internal_error'
      },
      { status: 500 }
    );
  }
}

