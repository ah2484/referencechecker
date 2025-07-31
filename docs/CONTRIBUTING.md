# Contributing to Reference Validator

Thank you for your interest in contributing to Reference Validator! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/reference-validator.git
   cd reference-validator
   ```
3. **Set up the development environment**
   ```bash
   npm run setup
   ```
4. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
5. **Make your changes**
6. **Run tests**
   ```bash
   npm test
   ```
7. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
8. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
9. **Open a Pull Request**

## 📋 Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Environment Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your service credentials:
   - Supabase (for database)
   - Clerk (for authentication)
   - Resend (for email)
   - OpenAI (for AI features)

3. **Set up the database**
   ```bash
   npm run db:setup
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run type-check` - Run TypeScript type checking

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 14 app router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Admin dashboard routes
│   ├── api/               # API routes
│   ├── submit/            # Candidate submission
│   └── reference/         # Reference forms
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utility functions
│   ├── supabase.ts       # Database client
│   ├── auth.ts           # Authentication utilities
│   ├── email.ts          # Email service
│   └── ai-scoring.ts     # AI scoring logic
├── providers/            # Pluggable service providers
│   ├── auth/             # Authentication providers
│   ├── email/            # Email providers
│   └── nlp/              # AI/NLP providers
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Prefer interfaces over types for object shapes
- Use strict type checking
- Avoid `any` type - use proper typing instead

### React

- Use functional components with hooks
- Prefer named exports over default exports
- Use proper prop typing with interfaces
- Follow React best practices

### Styling

- Use Tailwind CSS for styling
- Follow the design system defined in `tailwind.config.js`
- Use CSS variables for theming
- Prefer utility classes over custom CSS

### File Naming

- Use kebab-case for file names
- Use PascalCase for component names
- Use camelCase for function and variable names
- Use UPPER_SNAKE_CASE for constants

### Code Organization

- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper separation of concerns
- Follow the established folder structure

## 🧪 Testing

### Writing Tests

- Write tests for all new features
- Use React Testing Library for component tests
- Use Jest for unit tests
- Aim for good test coverage

### Test Structure

```typescript
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected text')).toBeInTheDocument()
  })

  it('should handle user interactions', () => {
    render(<ComponentName />)
    // Test user interactions
  })
})
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔧 Adding New Features

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Implement the Feature

- Follow the established patterns
- Add proper TypeScript types
- Write tests for your feature
- Update documentation if needed

### 3. Test Your Changes

```bash
npm run lint
npm run type-check
npm test
npm run build
```

### 4. Commit Your Changes

Use conventional commit messages:

```
feat: add new feature
fix: fix existing bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Try to reproduce the bug with the latest version
3. Check the documentation for known issues

### Bug Report Template

```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear description of what you expected to happen.

**Actual Behavior**
A clear description of what actually happened.

**Environment**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]

**Additional Context**
Add any other context about the problem here.
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Use Case**
Describe how this feature would be used.

**Proposed Implementation**
If you have ideas for implementation, share them here.

**Additional Context**
Add any other context or screenshots about the feature request.
```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows the style guidelines**
   ```bash
   npm run lint:fix
   npm run type-check
   ```

2. **Run the test suite**
   ```bash
   npm test
   ```

3. **Update documentation**
   - Update README.md if needed
   - Add JSDoc comments for new functions
   - Update API documentation if applicable

4. **Test your changes**
   - Test in different browsers
   - Test on different screen sizes
   - Test with different data scenarios

### PR Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs tests
   - Code quality checks
   - Type checking

2. **Code Review**
   - At least one maintainer must approve
   - Address any feedback
   - Make requested changes

3. **Merge**
   - Squash commits if needed
   - Use conventional commit messages
   - Update changelog if applicable

## 🏷️ Issue Labels

We use the following labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on

## 📚 Documentation

### Writing Documentation

- Use clear, concise language
- Include code examples
- Keep documentation up to date
- Use proper markdown formatting

### Documentation Structure

- `README.md` - Project overview and quick start
- `docs/` - Detailed documentation
  - `API.md` - API documentation
  - `ARCHITECTURE.md` - System architecture
  - `DEPLOYMENT.md` - Deployment guides
  - `CONTRIBUTING.md` - This file

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the project's code of conduct

### Communication

- Use GitHub issues for bug reports and feature requests
- Use GitHub discussions for questions and general discussion
- Be patient and helpful with newcomers
- Use clear, professional language

## 🎯 Getting Help

### Resources

- [GitHub Issues](https://github.com/your-org/reference-validator/issues)
- [GitHub Discussions](https://github.com/your-org/reference-validator/discussions)
- [Documentation](./README.md)
- [API Documentation](./API.md)

### Questions

If you have questions about contributing:

1. Check the documentation first
2. Search existing issues and discussions
3. Create a new discussion if needed
4. Be specific about your question

## 🙏 Recognition

Contributors will be recognized in:

- GitHub contributors list
- Project README (for significant contributions)
- Release notes
- Project documentation

Thank you for contributing to Reference Validator! 🎉 