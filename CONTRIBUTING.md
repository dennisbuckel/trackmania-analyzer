# Contributing to Trackmania COTD Analyzer

Thank you for your interest in contributing to the Trackmania COTD Analyzer! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

### 🐛 Bug Reports
- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include detailed steps to reproduce
- Provide browser and OS information
- Add screenshots if applicable

### 💡 Feature Requests
- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Describe the use case clearly
- Explain the expected behavior
- Consider technical implications

### 🌍 Translations
Help make the app accessible to more users by adding translations:

1. **Add a new language**:
   - Fork the repository
   - Add your language to `src/i18n/translations.js`
   - Follow the existing structure for English (`en`) and German (`de`)
   - Add your language to `src/components/LanguageSelector.js`

2. **Translation guidelines**:
   - Keep translations concise and clear
   - Maintain the same tone as the original
   - Use appropriate technical terms for your language
   - Test the UI with your translations

### 🔧 Code Contributions

#### Development Setup
```bash
# Fork and clone the repository
git clone https://github.com/yourusername/trackmania-cotd-analyzer.git
cd trackmania-cotd-analyzer

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

#### Code Style Guidelines
- **React**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes, avoid inline styles
- **Naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic
- **Performance**: Use `useMemo` and `useCallback` for expensive operations

#### Component Structure
```javascript
// Component imports
import React, { useState, useEffect } from 'react';

// Component definition
const ComponentName = ({ prop1, prop2 }) => {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

#### File Organization
```
src/
├── components/          # React components
├── i18n/              # Internationalization
├── utils/             # Utility functions
├── index.css          # Global styles
└── App.js             # Main app component
```

## 📋 Pull Request Process

### Before Submitting
1. **Test your changes**:
   - Verify the app works in development mode
   - Test the production build
   - Check responsive design on different screen sizes
   - Test with sample data

2. **Code quality**:
   - Follow the existing code style
   - Add comments for complex logic
   - Remove console.log statements
   - Ensure no ESLint warnings

3. **Documentation**:
   - Update README.md if needed
   - Add JSDoc comments for new functions
   - Update CHANGELOG.md for significant changes

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Translation
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested in development mode
- [ ] Tested production build
- [ ] Tested on mobile devices
- [ ] Tested with sample data

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🎨 Design Guidelines

### UI/UX Principles
- **Simplicity**: Keep interfaces clean and intuitive
- **Consistency**: Follow established patterns
- **Accessibility**: Ensure keyboard navigation and screen reader support
- **Performance**: Optimize for fast loading and smooth interactions

### Visual Design
- **Colors**: Use the existing color palette
- **Typography**: Maintain consistent font sizes and weights
- **Spacing**: Follow Tailwind's spacing scale
- **Animations**: Use subtle, purposeful animations

### Component Guidelines
- **Reusability**: Create reusable components when possible
- **Props**: Use clear, descriptive prop names
- **State**: Keep state as local as possible
- **Performance**: Memoize expensive calculations

## 🌍 Internationalization (i18n)

### Adding a New Language

1. **Language Code**: Use ISO 639-1 codes (e.g., 'fr' for French)

2. **Translation Structure**:
```javascript
// In src/i18n/translations.js
export const translations = {
  // ... existing languages
  fr: {
    title: "Analyseur COTD Trackmania",
    subtitle: "Analysez vos performances Cup of the Day comme un pro",
    // ... all other keys
  }
};
```

3. **Language Selector**:
```javascript
// In src/components/LanguageSelector.js
const languages = [
  // ... existing languages
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];
```

### Translation Best Practices
- **Context**: Understand the context where text appears
- **Length**: Consider text expansion/contraction in your language
- **Cultural**: Adapt to cultural norms when appropriate
- **Technical**: Use established technical terms
- **Testing**: Test the UI with your translations

## 🔍 Testing Guidelines

### Manual Testing Checklist
- [ ] Data import works with various formats
- [ ] All chart views display correctly
- [ ] Advanced search filters work
- [ ] Keyboard shortcuts function
- [ ] Mobile responsive design
- [ ] Language switching works
- [ ] Data export/import functions
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

### Test Data
Use the sample data feature or create test data with various scenarios:
- Different divisions (1-64)
- Various percentiles (0-100%)
- Multiple map types
- Different date ranges
- Edge cases (missing data, extreme values)

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: For sensitive issues or direct contact

### Code Review Process
1. Submit pull request with clear description
2. Automated checks will run (if configured)
3. Maintainers will review the code
4. Address any feedback or requested changes
5. Once approved, changes will be merged

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks for major features or improvements

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Trackmania COTD Analyzer! Your help makes this tool better for the entire Trackmania community. 🏁
