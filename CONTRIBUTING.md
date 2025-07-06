# Contributing to SPADE

Thank you for your interest in contributing to SPADE! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Next.js

### Setting Up Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   \`\`\`bash
   git clone https://github.com/yourusername/spade-air-quality-monitor.git
   cd spade-air-quality-monitor
   \`\`\`
3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
4. Copy environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## 📋 Development Guidelines

### Code Style

We use ESLint and Prettier for consistent code formatting:

\`\`\`bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
\`\`\`

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

Example:
\`\`\`bash
git commit -m "feat: add real-time pollution alerts"
git commit -m "fix: resolve map rendering issue on mobile"
git commit -m "docs: update API documentation"
\`\`\`

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## 🧪 Testing

### Running Tests

\`\`\`bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
\`\`\`

### Writing Tests

- Write unit tests for utility functions
- Add integration tests for components
- Include E2E tests for critical user flows
- Maintain test coverage above 80%

Example test structure:
\`\`\`typescript
// components/__tests__/Dashboard.test.tsx
import { render, screen } from '@testing-library/react'
import { Dashboard } from '../Dashboard'

describe('Dashboard', () => {
  it('renders pollution data correctly', () => {
    render(<Dashboard />)
    expect(screen.getByText('SPADE Dashboard')).toBeInTheDocument()
  })
})
\`\`\`

## 🏗️ Project Structure

\`\`\`
spade-air-quality-monitor/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── feature/          # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── utils/                # Helper functions
├── types/                # TypeScript definitions
└── __tests__/            # Test files
\`\`\`

## 🎯 Areas for Contribution

### High Priority
- **Performance optimization** - Improve map rendering performance
- **Mobile responsiveness** - Enhance mobile user experience
- **Accessibility** - Add ARIA labels and keyboard navigation
- **Data visualization** - Create new chart types and visualizations

### Medium Priority
- **API integration** - Connect to real data sources
- **Export features** - Add new export formats
- **Alert system** - Enhance notification capabilities
- **Documentation** - Improve code documentation

### Low Priority
- **UI enhancements** - Polish existing components
- **Code refactoring** - Improve code organization
- **Testing** - Increase test coverage

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description** - Clear description of the issue
2. **Steps to reproduce** - Detailed steps to reproduce the bug
3. **Expected behavior** - What should happen
4. **Actual behavior** - What actually happens
5. **Environment** - Browser, OS, Node.js version
6. **Screenshots** - If applicable

Use the bug report template:
\`\`\`markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g. macOS 12.0]
- Browser: [e.g. Chrome 96.0]
- Node.js: [e.g. 18.0.0]
- npm: [e.g. 8.0.0]
\`\`\`

## 💡 Feature Requests

For feature requests, please:

1. Check existing issues to avoid duplicates
2. Provide clear use case and motivation
3. Include mockups or examples if possible
4. Consider implementation complexity

## 🔄 Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following our guidelines
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run the test suite** to ensure everything passes
6. **Submit a pull request** with a clear description

### Pull Request Template

\`\`\`markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
\`\`\`

## 📚 Documentation

### Code Documentation
- Use JSDoc comments for functions and classes
- Include TypeScript types for all parameters
- Provide usage examples for complex functions

### README Updates
- Keep installation instructions current
- Update feature lists when adding new capabilities
- Include screenshots for UI changes

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

## 📞 Getting Help

- **GitHub Discussions** - For questions and ideas
- **GitHub Issues** - For bugs and feature requests
- **Email** - dev@spade-project.com for direct contact

## 📄 License

By contributing to SPADE, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SPADE! 🌍
