# Contributing to BelleBook

Thank you for your interest in contributing to BelleBook! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/BelleBook.git`
3. Add upstream remote: `git remote add upstream https://github.com/SilvaGabriel011/BelleBook.git`
4. Follow the [Setup Guide](./docs/SETUP.md)

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Urgent production fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Commit Your Changes

We follow conventional commits:

```bash
git commit -m "feat: add user profile editing"
git commit -m "fix: resolve booking timezone issue"
git commit -m "docs: update API documentation"
```

Commit types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type - use proper types or `unknown`
- Use interfaces for object shapes
- Export types that are used across files

### React/React Native

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Avoid inline styles - use StyleSheet or Tailwind classes

### Testing

- Write unit tests for utilities and services
- Write integration tests for API endpoints
- Write component tests for UI components
- Aim for >80% code coverage

### Linting and Formatting

Before committing:

```bash
npm run lint:fix
npm run format
npm run type-check
```

## Pull Request Process

1. **Update Documentation**: Update relevant docs if needed
2. **Add Tests**: Ensure your changes are tested
3. **Run Tests**: Make sure all tests pass
4. **Check Linting**: Run linting and fix any issues
5. **Update Changelog**: Add entry to CHANGELOG.md if applicable
6. **Request Review**: Tag relevant reviewers

### PR Title Format

Use conventional commit format:

```
feat: add Google Calendar sync
fix: resolve payment webhook timeout
docs: update setup instructions
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings
```

## Review Process

- All PRs require at least one approval
- Address review comments promptly
- Keep PRs focused and reasonably sized
- Be open to feedback and suggestions

## Questions?

- Open an issue for bugs or feature requests
- Tag maintainers for urgent matters
- Check existing issues before creating new ones

Thank you for contributing to BelleBook! 🎉
