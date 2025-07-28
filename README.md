# Safe Credentials Auth

A modern Vue 3 + Vite application for secure authentication, featuring robust password policies, reusable UI components, and real-time form validation.

## Features

- **Login Form**: Email and password fields with instant validation feedback.
- **Password Policy**: Enforces minimum length, uppercase, lowercase, number, and special character requirements (configurable).
- **Reusable Components**:
  - `TextField`: Customizable text input.
  - `PasswordField`: Secure password input with policy feedback.
  - `PrimaryButton`: Styled button with loading state.
  - `MaterialIcon`: Consistent icon rendering.
- **Form Validation**: Powered by Vuelidate, with custom rules and error messages.
- **Tailwind CSS**: Utility-first styling for rapid UI development.
- **Router Integration**: Navigation using Vue Router, including register page link.
- **Extensible Structure**: Easily add new pages, components, or validation rules.

## Project Structure

```
src/
  App.vue                # Main app shell
  assets/                # Static assets (logo, CSS)
  components/            # UI components (TextField, PasswordField, etc.)
  composables/           # Custom composables (form validation logic)
  pages/                 # Page components (LoginPage, etc.)
  utils/                 # Constants, messages, regex
  main.js                # App entry point
```

## Getting Started

### Install dependencies

```sh
npm install
```

### Run for development

```sh
npm run dev
```

### Build for production

```sh
npm run build
```

## Customization

- **Password Policy**: Edit `src/utils/constants.js` to adjust password requirements.
- **Validation Messages**: Update `src/utils/messages.js` for custom error texts.
- **Add Pages**: Place new page components in `src/pages/` and configure routes.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## License

MIT
